import { Subject } from "rxjs";
import { CmdStatus } from "../../api/command/Command";
import { CancelFSMException } from "../fsm/CancelFSMException";
import { catBinding, catCommand } from "../logging/ConfigLog";
import { isUndoableType } from "../../api/undo/Undoable";
import { MustBeUndoableCmdError } from "./MustBeUndoableCmdError";
export class BindingImpl {
    constructor(continuousExecution, interaction, cmdProducer, widgets, undoHistory) {
        this.asLogBinding = false;
        this.asLogCmd = false;
        this.continuousCmdExec = false;
        this.timeCancelled = 0;
        this.timeEnded = 0;
        this.cmdsProduced = new Subject();
        this.cmdProducer = cmdProducer;
        this.interaction = interaction;
        this.cmd = undefined;
        this.continuousCmdExec = continuousExecution;
        this.activated = true;
        this.undoHistory = undoHistory;
        this.interaction.getFsm().addHandler(this);
        interaction.registerToNodes(widgets);
    }
    when() {
        return true;
    }
    clearEvents() {
        this.interaction.fullReinit();
    }
    createCommand() {
        try {
            return this.cmdProducer(this.interaction.getData());
        }
        catch (ex) {
            if (ex instanceof Error) {
                catBinding.error("Error while creating a command", ex);
            }
            else {
                catBinding.warn(`Error while creating a command: ${String(ex)}`);
            }
            return undefined;
        }
    }
    catch(_err) {
    }
    first() {
    }
    then() {
    }
    end() {
    }
    cancel() {
    }
    endOrCancel() {
    }
    ifCmdHadNoEffect() {
    }
    ifCmdHadEffects() {
    }
    ifCannotExecuteCmd() {
    }
    getInteraction() {
        return this.interaction;
    }
    getCommand() {
        return this.cmd;
    }
    isActivated() {
        return this.activated;
    }
    isRunning() {
        return this.interaction.isRunning();
    }
    isStrictStart() {
        return false;
    }
    fsmCancels() {
        if (this.cmd !== undefined) {
            if (this.asLogBinding) {
                catBinding.info("Binding cancelled");
            }
            const hadEffects = this.cmd.hadEffect();
            this.cmd.cancel();
            if (this.asLogCmd) {
                catCommand.info(`Command ${this.cmd.constructor.name} cancelled`);
            }
            if (this.isContinuousCmdExec() && hadEffects) {
                this.cancelContinousWithEffectsCmd(this.cmd);
            }
            this.cmd = undefined;
            this.cancel();
            this.endOrCancel();
            this.timeCancelled++;
        }
    }
    cancelContinousWithEffectsCmd(c) {
        if (isUndoableType(c)) {
            c.undo();
            if (this.asLogCmd) {
                catCommand.info(`Command ${c.constructor.name} undone`);
            }
        }
        else {
            throw new MustBeUndoableCmdError(c);
        }
    }
    fsmStarts() {
        if (!this.isActivated()) {
            return;
        }
        const ok = this.when();
        if (this.asLogBinding) {
            catBinding.info(`Starting binding: ${String(ok)}`);
        }
        if (ok) {
            this.cmd = this.createCommand();
            if (this.cmd !== undefined) {
                this.first();
                if (this.asLogCmd) {
                    catCommand.info(`Command created and init: ${this.cmd.constructor.name}`);
                }
            }
        }
        else {
            if (this.isStrictStart()) {
                if (this.asLogBinding) {
                    catBinding.info(`Cancelling starting interaction: ${this.interaction.constructor.name}`);
                }
                throw new CancelFSMException();
            }
        }
    }
    fsmUpdates() {
        if (!this.isActivated()) {
            return;
        }
        if (this.asLogBinding) {
            catBinding.info("Binding updates");
        }
        if (this.createAndInitCommand()) {
            if (this.asLogCmd) {
                catCommand.info("Command update");
            }
            this.then();
            if (this.continuousCmdExec) {
                this.continuousExecutionOnFSMUpdate();
            }
        }
    }
    continuousExecutionOnFSMUpdate() {
        var _a, _b;
        const ok = (_b = (_a = this.cmd) === null || _a === void 0 ? void 0 : _a.execute()) !== null && _b !== void 0 ? _b : false;
        if (this.asLogCmd) {
            catCommand.info(`Try to execute command (continuous execution), is cmd undefined? ${String(this.cmd === undefined)}`);
        }
        if (ok instanceof Promise) {
            ok.then(executed => {
                if (!executed) {
                    this.ifCannotExecuteCmd();
                }
                if (this.asLogCmd) {
                    catCommand.info(`Continuous command execution had this result: ${String(executed)}`);
                }
            }).catch(ex => {
                catCommand.error("Error while executing the command continuously", ex);
            });
        }
        else {
            if (!ok) {
                this.ifCannotExecuteCmd();
            }
            if (this.asLogCmd) {
                catCommand.info(`Continuous command execution had this result: ${String(ok)}`);
            }
        }
    }
    fsmStops() {
        if (!this.isActivated()) {
            return;
        }
        if (this.asLogBinding) {
            catBinding.info("Binding stops");
        }
        if (this.createAndInitCommand()) {
            this.executeCommandOnFSMStop();
        }
        else {
            if (this.cmd !== undefined) {
                if (this.asLogCmd) {
                    catCommand.info("Cancelling the command");
                }
                this.cmd.cancel();
                this.cmd = undefined;
                this.timeCancelled++;
            }
        }
    }
    executeCommandOnFSMStop() {
        if (!this.continuousCmdExec) {
            this.then();
            if (this.asLogCmd) {
                catCommand.info("Command updated");
            }
        }
        if (this.cmd !== undefined) {
            const cmdToExecute = this.cmd;
            const result = this.cmd.execute();
            if (result instanceof Promise) {
                result.then(executed => {
                    this.cmd = cmdToExecute;
                    this.afterCmdExecuted(cmdToExecute, executed);
                    this.cmd = undefined;
                    this.timeEnded++;
                }).catch(ex => {
                    catCommand.error("Error while executing the command", ex);
                    this.cmd = undefined;
                    this.timeEnded++;
                });
            }
            else {
                this.afterCmdExecuted(this.cmd, result);
                this.cmd = undefined;
                this.timeEnded++;
            }
        }
    }
    createAndInitCommand() {
        let ok = this.when();
        if (this.asLogBinding) {
            catBinding.info(`when predicate is ${String(ok)}`);
        }
        if (ok) {
            if (this.cmd === undefined) {
                if (this.asLogCmd) {
                    catCommand.info("Command creation");
                }
                this.cmd = this.createCommand();
                ok = this.cmd !== undefined;
                if (ok) {
                    this.first();
                }
            }
        }
        return ok;
    }
    afterCmdExecuted(cmd, ok) {
        if (this.asLogCmd) {
            catCommand.info(`Command execution had this result: ${String(ok)}`);
        }
        if (ok) {
            this.end();
            this.endOrCancel();
        }
        else {
            this.ifCannotExecuteCmd();
        }
        if (cmd.getStatus() !== CmdStatus.executed) {
            return;
        }
        cmd.done();
        this.cmdsProduced.next(cmd);
        const hadEffect = cmd.hadEffect();
        if (this.asLogCmd) {
            catCommand.info(`Command execution had effect: ${String(hadEffect)}`);
        }
        if (hadEffect) {
            if (isUndoableType(cmd)) {
                this.undoHistory.add(cmd);
            }
            this.ifCmdHadEffects();
        }
        else {
            this.ifCmdHadNoEffect();
        }
    }
    uninstallBinding() {
        this.setActivated(false);
        this.cmdsProduced.complete();
        this.asLogBinding = false;
        this.asLogCmd = false;
        this.interaction.uninstall();
    }
    isContinuousCmdExec() {
        return this.continuousCmdExec;
    }
    setActivated(activated) {
        if (this.asLogBinding) {
            catBinding.info(`Binding Activated: ${String(activated)}`);
        }
        this.activated = activated;
        this.interaction.setActivated(activated);
        if (!this.activated && this.cmd !== undefined) {
            this.cmd.flush();
            this.cmd = undefined;
        }
    }
    setLogBinding(log) {
        this.asLogBinding = log;
    }
    setLogCmd(log) {
        this.asLogCmd = log;
    }
    produces() {
        return this.cmdsProduced;
    }
    getTimesEnded() {
        return this.timeEnded;
    }
    getTimesCancelled() {
        return this.timeCancelled;
    }
}
