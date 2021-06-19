import { LogLevel } from "../../api/logging/LogLevel";
import { BindingImpl } from "./BindingImpl";
import { catBinding } from "../logging/ConfigLog";
export class AnonBinding extends BindingImpl {
    constructor(continuousExec, interaction, undoHistory, cmdSupplierFn, widgets, dynamicNodes, strict, loggers, timeoutThrottle, stopPropagation, prevDefault, firstFn, thenFn, whenFn, endFn, cancelFn, endOrCancelFn, hadEffectsFn, hadNoEffectFn, cannotExecFn, onErrFn) {
        super(continuousExec, interaction, cmdSupplierFn, widgets, undoHistory);
        this.configureLoggers(loggers);
        this.firstFn = firstFn;
        this.thenFn = thenFn;
        this.cancelFn = cancelFn;
        this.endOrCancelFn = endOrCancelFn;
        this.whenFn = whenFn;
        this.onEndFn = endFn;
        this.strictStart = strict;
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
            this.setLogCmd(loggers.includes(LogLevel.command.valueOf()));
            this.setLogBinding(loggers.includes(LogLevel.binding.valueOf()));
            this.interaction.log(loggers.includes(LogLevel.interaction.valueOf()));
        }
    }
    isStrictStart() {
        return this.strictStart;
    }
    first() {
        const cmd = this.getCommand();
        if (this.firstFn !== undefined && cmd !== undefined) {
            try {
                this.firstFn(cmd, this.getInteraction().getData());
            }
            catch (ex) {
                this.catch(ex);
                if (ex instanceof Error) {
                    catBinding.error("Crash in 'first'", ex);
                }
                else {
                    catBinding.warn(`Crash in 'first': ${String(ex)}`);
                }
            }
        }
    }
    then() {
        const cmd = this.getCommand();
        if (this.thenFn !== undefined && cmd !== undefined) {
            try {
                this.thenFn(cmd, this.getInteraction().getData());
            }
            catch (ex) {
                this.catch(ex);
                if (ex instanceof Error) {
                    catBinding.error("Crash in 'then'", ex);
                }
                else {
                    catBinding.warn(`Crash in 'then': ${String(ex)}`);
                }
            }
        }
    }
    end() {
        const cmd = this.getCommand();
        if (this.onEndFn !== undefined && cmd !== undefined) {
            try {
                this.onEndFn(cmd, this.getInteraction().getData());
            }
            catch (ex) {
                this.catch(ex);
                if (ex instanceof Error) {
                    catBinding.error("Crash in 'end'", ex);
                }
                else {
                    catBinding.warn(`Crash in 'end': ${String(ex)}`);
                }
            }
        }
    }
    cancel() {
        if (this.cancelFn !== undefined) {
            try {
                this.cancelFn(this.getInteraction().getData());
            }
            catch (ex) {
                this.catch(ex);
                if (ex instanceof Error) {
                    catBinding.error("Crash in 'cancel'", ex);
                }
                else {
                    catBinding.warn(`Crash in 'cancel': ${String(ex)}`);
                }
            }
        }
    }
    endOrCancel() {
        if (this.endOrCancelFn !== undefined) {
            try {
                this.endOrCancelFn(this.getInteraction().getData());
            }
            catch (ex) {
                this.catch(ex);
                if (ex instanceof Error) {
                    catBinding.error("Crash in 'endOrCancel'", ex);
                }
                else {
                    catBinding.warn(`Crash in 'endOrCancel': ${String(ex)}`);
                }
            }
        }
    }
    ifCmdHadNoEffect() {
        const cmd = this.getCommand();
        if (this.hadNoEffectFn !== undefined && cmd !== undefined) {
            try {
                this.hadNoEffectFn(cmd, this.getInteraction().getData());
            }
            catch (ex) {
                this.catch(ex);
                if (ex instanceof Error) {
                    catBinding.error("Crash in 'ifHadNoEffect'", ex);
                }
                else {
                    catBinding.warn(`Crash in 'ifHadNoEffect': ${String(ex)}`);
                }
            }
        }
    }
    ifCmdHadEffects() {
        const cmd = this.getCommand();
        if (this.hadEffectsFn !== undefined && cmd !== undefined) {
            try {
                this.hadEffectsFn(cmd, this.getInteraction().getData());
            }
            catch (ex) {
                this.catch(ex);
                if (ex instanceof Error) {
                    catBinding.error("Crash in 'ifHadEffects'", ex);
                }
                else {
                    catBinding.warn(`Crash in 'ifHadEffects': ${String(ex)}`);
                }
            }
        }
    }
    ifCannotExecuteCmd() {
        const cmd = this.getCommand();
        if (this.cannotExecFn !== undefined && cmd !== undefined) {
            try {
                this.cannotExecFn(cmd, this.getInteraction().getData());
            }
            catch (ex) {
                this.catch(ex);
                if (ex instanceof Error) {
                    catBinding.error("Crash in 'ifCannotExecute'", ex);
                }
                else {
                    catBinding.warn(`Crash in 'ifCannotExecute': ${String(ex)}`);
                }
            }
        }
    }
    when() {
        let ok;
        try {
            ok = this.whenFn === undefined || this.whenFn(this.getInteraction().getData());
        }
        catch (ex) {
            ok = false;
            this.catch(ex);
            if (ex instanceof Error) {
                catBinding.error("Crash in 'when'", ex);
            }
            else {
                catBinding.warn(`Crash in 'when': ${String(ex)}`);
            }
        }
        if (this.asLogBinding) {
            catBinding.info(`Checking condition: ${String(ok)}`);
        }
        return ok;
    }
    catch(err) {
        if (this.onErrFn !== undefined) {
            try {
                this.onErrFn(err);
            }
            catch (ex) {
                if (ex instanceof Error) {
                    catBinding.error("Crash in 'catch'", ex);
                }
                else {
                    catBinding.warn(`Crash in 'catch': ${String(ex)}`);
                }
            }
        }
    }
}
