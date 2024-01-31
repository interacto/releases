import { MustBeUndoableCmdError } from "./MustBeUndoableCmdError";
import { isUndoableType } from "../../api/undo/Undoable";
import { Subject } from "rxjs";
export class BindingImpl {
    _name;
    _timeEnded;
    _timeCancelled;
    _activated;
    _interaction;
    accumulator;
    linterRules;
    _cmd;
    continuousCmdExecution;
    cmdProducer;
    cmdsProduced;
    accumulatorInit;
    undoHistory;
    logger;
    logBinding;
    logCmd;
    logUsage;
    constructor(continuousExecution, interaction, cmdProducer, widgets, undoHistory, logger, linterRules, name, accInit) {
        this._name = name;
        this.linterRules = linterRules;
        this.accumulatorInit = accInit;
        this.logBinding = false;
        this.logCmd = false;
        this.logUsage = false;
        this._timeCancelled = 0;
        this._timeEnded = 0;
        this.accumulator = { ...this.accumulatorInit };
        this.cmdsProduced = new Subject();
        this.cmdProducer = cmdProducer;
        this._interaction = interaction;
        this._cmd = undefined;
        this.continuousCmdExecution = continuousExecution;
        this._activated = true;
        this.undoHistory = undoHistory;
        this.logger = logger;
        this._interaction.fsm.addHandler({
            "fsmStarts": () => {
                this.fsmStarts();
            },
            "fsmUpdates": () => {
                this.fsmUpdates();
            },
            "fsmStops": () => {
                this.fsmStops();
            },
            "fsmCancels": () => {
                this.fsmCancels();
            },
            "fsmError": (err) => {
                this.fsmError(err);
            }
        });
        interaction.registerToNodes(widgets);
    }
    reinitAccumulator() {
        this.accumulator = { ...this.accumulatorInit };
    }
    get name() {
        return this._name ?? this._interaction.constructor.name;
    }
    whenStart() {
        return true;
    }
    whenUpdate() {
        return true;
    }
    whenStop() {
        return true;
    }
    clearEvents() {
        this._interaction.fullReinit();
    }
    createCommand() {
        try {
            const cmd = this.cmdProducer(this.interaction.data);
            if (this._name === undefined) {
                this._name = `${this._interaction.constructor.name}:${cmd.constructor.name}`;
            }
            return cmd;
        }
        catch (error) {
            this.logger.logBindingErr("Error while creating a command", error);
            this.catch(error);
            return undefined;
        }
    }
    isWhenDefined() {
        return false;
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
    get interaction() {
        return this._interaction;
    }
    get command() {
        return this._cmd;
    }
    get activated() {
        return this._activated;
    }
    set activated(activated) {
        if (this.logBinding) {
            this.logger.logBindingMsg(`Binding Activated: ${String(activated)}`);
        }
        this._activated = activated;
        this._interaction.setActivated(activated);
        if (!this._activated && this._cmd !== undefined) {
            this._cmd.flush();
            this._cmd = undefined;
        }
        this.reinitAccumulator();
    }
    get running() {
        return this._interaction.isRunning();
    }
    fsmError(err) {
        if (this.logBinding) {
            this.logger.logBindingErr("", err);
        }
        this.catch(err);
    }
    fsmCancels() {
        if (this._cmd !== undefined) {
            if (this.logBinding) {
                this.logger.logBindingMsg("Binding cancelled");
            }
            this._cmd.cancel();
            if (this.logCmd) {
                this.logger.logCmdMsg("Cancelling command", this._cmd.constructor.name);
            }
            try {
                if (this.continuousCmdExecution) {
                    this.cancelContinousWithEffectsCmd(this._cmd);
                }
            }
            finally {
                this._cmd = undefined;
                this.cancel();
                this.endOrCancel();
                this._timeCancelled++;
            }
        }
        this.reinitAccumulator();
        if (this.logUsage) {
            this.logger.logBindingEnd(this.name, true);
        }
    }
    cancelContinousWithEffectsCmd(cmd) {
        if (isUndoableType(cmd)) {
            cmd.undo();
            if (this.logCmd) {
                this.logger.logCmdMsg("Command undone", cmd.constructor.name);
            }
        }
        else {
            throw new MustBeUndoableCmdError(cmd);
        }
    }
    fsmStarts() {
        if (!this._activated) {
            return;
        }
        const ok = this.whenStart();
        if (this.logBinding) {
            this.logger.logBindingMsg(`Starting binding: ${String(ok)}`);
        }
        if (ok) {
            this.reinitAccumulator();
            this._cmd = this.createCommand();
            if (this._cmd !== undefined) {
                this.first();
                if (this.logCmd) {
                    this.logger.logCmdMsg("Command created and init", this._cmd.constructor.name);
                }
            }
        }
        if (this.logUsage) {
            this.logger.logBindingStart(this.name);
        }
    }
    fsmUpdates() {
        if (!this._activated) {
            return;
        }
        if (this.logBinding) {
            this.logger.logBindingMsg("Binding updates");
        }
        const cmd = this.createAndInitCommand(this.whenUpdate());
        if (cmd !== undefined) {
            if (this.logCmd) {
                this.logger.logCmdMsg("Command update");
            }
            this.then();
            if (this.continuousCmdExecution) {
                this.continuousExecutionOnFSMUpdate(cmd);
            }
        }
    }
    continuousExecutionOnFSMUpdate(cmd) {
        const ok = cmd.execute();
        if (this.logCmd) {
            this.logger.logCmdMsg(`Try to execute command (continuous execution), is cmd undefined? ${String(this._cmd === undefined)}`);
        }
        if (ok instanceof Promise) {
            ok.then(executed => {
                if (!executed) {
                    this.ifCannotExecuteCmd();
                }
                if (this.logCmd) {
                    this.logger.logCmdMsg(`Continuous command execution had this result: ${String(executed)}`);
                }
            }).catch((error) => {
                this.logger.logCmdErr("Error while executing the command continuously", error);
            });
        }
        else {
            if (!ok) {
                this.ifCannotExecuteCmd();
            }
            if (this.logCmd) {
                this.logger.logCmdMsg(`Continuous command execution had this result: ${String(ok)}`);
            }
        }
    }
    fsmStops() {
        if (!this._activated) {
            return;
        }
        if (this.logBinding) {
            this.logger.logBindingMsg("Binding stops");
        }
        let cancelled = false;
        const cmd = this.createAndInitCommand(this.whenStop());
        if (cmd === undefined) {
            if (this._cmd !== undefined) {
                if (this.logCmd) {
                    this.logger.logCmdMsg("Cancelling the command");
                }
                this._cmd.cancel();
                try {
                    if (this.continuousCmdExecution) {
                        this.cancelContinousWithEffectsCmd(this._cmd);
                    }
                }
                finally {
                    this._cmd = undefined;
                    this.cancel();
                    this.endOrCancel();
                    this._timeCancelled++;
                    cancelled = true;
                }
            }
        }
        else {
            this.executeCommandOnFSMStop(cmd);
        }
        this.reinitAccumulator();
        if (this.logUsage) {
            this.logger.logBindingEnd(this.name, cancelled);
        }
    }
    executeCommandOnFSMStop(cmd) {
        if (!this.continuousCmdExecution) {
            this.then();
            if (this.logCmd) {
                this.logger.logCmdMsg("Command updated");
            }
        }
        const result = cmd.execute();
        if (result instanceof Promise) {
            result.then(executed => {
                this._cmd = cmd;
                this.afterCmdExecuted(cmd, executed);
                this._cmd = undefined;
                this._timeEnded++;
            }).catch((error) => {
                this.logger.logCmdErr("Error while executing the command", error);
                this._cmd = undefined;
                this._timeEnded++;
            });
        }
        else {
            this.afterCmdExecuted(cmd, result);
            this._cmd = undefined;
            this._timeEnded++;
        }
    }
    createAndInitCommand(whenOk) {
        if (this.logBinding) {
            this.logger.logBindingMsg(`when predicate is ${String(whenOk)}`);
        }
        if (whenOk) {
            if (this._cmd === undefined) {
                if (this.logCmd) {
                    this.logger.logCmdMsg("Command creation");
                }
                this._cmd = this.createCommand();
                if (this._cmd !== undefined) {
                    this.first();
                }
            }
            return this._cmd;
        }
        return undefined;
    }
    afterCmdExecuted(cmd, ok) {
        if (this.logCmd) {
            this.logger.logCmdMsg(`Command execution had this result: ${String(ok)}`);
        }
        if (ok) {
            this.end();
            this.endOrCancel();
        }
        else {
            this.ifCannotExecuteCmd();
        }
        if (cmd.getStatus() !== "executed") {
            return;
        }
        cmd.done();
        this.cmdsProduced.next(cmd);
        const hadEffect = cmd.hadEffect();
        if (this.logCmd) {
            this.logger.logCmdMsg(`Command execution had effect: ${String(hadEffect)}`);
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
        this.activated = false;
        this.cmdsProduced.complete();
        this.logBinding = false;
        this.logCmd = false;
        this.logUsage = false;
        this._interaction.uninstall();
    }
    get produces() {
        return this.cmdsProduced;
    }
    get timesEnded() {
        return this._timeEnded;
    }
    get timesCancelled() {
        return this._timeCancelled;
    }
    acceptVisitor(visitor) {
        visitor.visitBinding(this);
    }
}
