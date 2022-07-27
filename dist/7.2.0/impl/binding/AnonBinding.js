import { LogLevel } from "../../api/logging/LogLevel";
import { BindingImpl } from "./BindingImpl";
import { isWhenAtEnd, isWhenAtStart, isWhenAtThen, isWhenStrict } from "../../api/binder/When";
import { CancelFSMException } from "../fsm/CancelFSMException";
export class AnonBinding extends BindingImpl {
    constructor(continuousExec, interaction, undoHistory, logger, cmdSupplierFn, widgets, dynamicNodes, loggers, timeoutThrottle, stopPropagation, prevDefault, firstFn, thenFn, whenFn, endFn, cancelFn, endOrCancelFn, hadEffectsFn, hadNoEffectFn, cannotExecFn, onErrFn, name) {
        super(continuousExec, interaction, cmdSupplierFn, widgets, undoHistory, logger, name);
        this.configureLoggers(loggers);
        this.firstFn = firstFn;
        this.thenFn = thenFn;
        this.cancelFn = cancelFn;
        this.endOrCancelFn = endOrCancelFn;
        this.whenFn = whenFn;
        this.onEndFn = endFn;
        this.hadEffectsFn = hadEffectsFn;
        this.hadNoEffectFn = hadNoEffectFn;
        this.cannotExecFn = cannotExecFn;
        this.onErrFn = onErrFn;
        this.interaction.stopImmediatePropagation = stopPropagation;
        this.interaction.preventDefault = prevDefault;
        this.interaction.setThrottleTimeout(timeoutThrottle);
        dynamicNodes.forEach(node => {
            interaction.registerToNodeChildren(node);
        });
    }
    configureLoggers(loggers) {
        if (loggers.length !== 0) {
            this.logCmd = loggers.includes(LogLevel.command.valueOf());
            this.logBinding = loggers.includes(LogLevel.binding.valueOf());
            this.logUsage = loggers.includes(LogLevel.usage.valueOf());
            this.interaction.log(loggers.includes(LogLevel.interaction.valueOf()));
        }
    }
    first() {
        const cmd = this.command;
        if (this.firstFn !== undefined && cmd !== undefined) {
            try {
                this.firstFn(cmd, this.interaction.data);
            }
            catch (ex) {
                this.catch(ex);
                this.logger.logBindingErr("Crash in 'first'", ex);
            }
        }
    }
    then() {
        const cmd = this.command;
        if (this.thenFn !== undefined && cmd !== undefined) {
            try {
                this.thenFn(cmd, this.interaction.data);
            }
            catch (ex) {
                this.catch(ex);
                this.logger.logBindingErr("Crash in 'then'", ex);
            }
        }
    }
    end() {
        const cmd = this.command;
        if (this.onEndFn !== undefined && cmd !== undefined) {
            try {
                this.onEndFn(cmd, this.interaction.data);
            }
            catch (ex) {
                this.catch(ex);
                this.logger.logBindingErr("Crash in 'end'", ex);
            }
        }
    }
    cancel() {
        if (this.cancelFn !== undefined) {
            try {
                this.cancelFn(this.interaction.data);
            }
            catch (ex) {
                this.catch(ex);
                this.logger.logBindingErr("Crash in 'cancel'", ex);
            }
        }
    }
    endOrCancel() {
        if (this.endOrCancelFn !== undefined) {
            try {
                this.endOrCancelFn(this.interaction.data);
            }
            catch (ex) {
                this.catch(ex);
                this.logger.logBindingErr("Crash in 'endOrCancel'", ex);
            }
        }
    }
    ifCmdHadNoEffect() {
        const cmd = this.command;
        if (this.hadNoEffectFn !== undefined && cmd !== undefined) {
            try {
                this.hadNoEffectFn(cmd, this.interaction.data);
            }
            catch (ex) {
                this.catch(ex);
                this.logger.logBindingErr("Crash in 'ifHadNoEffect'", ex);
            }
        }
    }
    ifCmdHadEffects() {
        const cmd = this.command;
        if (this.hadEffectsFn !== undefined && cmd !== undefined) {
            try {
                this.hadEffectsFn(cmd, this.interaction.data);
            }
            catch (ex) {
                this.catch(ex);
                this.logger.logBindingErr("Crash in 'ifHadEffects'", ex);
            }
        }
    }
    ifCannotExecuteCmd() {
        const cmd = this.command;
        if (this.cannotExecFn !== undefined && cmd !== undefined) {
            try {
                this.cannotExecFn(cmd, this.interaction.data);
            }
            catch (ex) {
                this.catch(ex);
                this.logger.logBindingErr("Crash in 'ifCannotExecute'", ex);
            }
        }
    }
    whenStart() {
        return this.whenChecker(when => isWhenAtStart(when.type));
    }
    whenUpdate() {
        return this.whenChecker(when => isWhenAtThen(when.type));
    }
    whenStop() {
        return this.whenChecker(when => isWhenAtEnd(when.type));
    }
    whenChecker(filterPredicate) {
        const ok = this.whenFn
            ?.filter(filterPredicate)
            .every(when => this.executeWhen(when)) ?? false;
        if (this.logBinding) {
            this.logger.logBindingMsg(`Checking condition: ${String(ok)}`);
        }
        return ok;
    }
    executeWhen(when) {
        let res;
        try {
            res = when.fn(this.interaction.data);
        }
        catch (ex) {
            res = false;
            this.catch(ex);
            this.logger.logBindingErr("Crash in checking condition", ex);
        }
        if (!res && isWhenStrict(when.type)) {
            if (this.logBinding) {
                this.logger.logBindingMsg(`Cancelling interaction: ${this._interaction.constructor.name}`);
            }
            throw new CancelFSMException();
        }
        return res;
    }
    catch(err) {
        if (this.onErrFn !== undefined) {
            try {
                this.onErrFn(err);
            }
            catch (ex) {
                this.logger.logBindingErr("Crash in 'catch'", ex);
            }
        }
    }
}
