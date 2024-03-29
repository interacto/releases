import { BindingImpl } from "./BindingImpl";
import { isWhenAtEnd, isWhenAtStart, isWhenAtThen, isWhenStrict } from "../../api/binder/When";
import { CancelFSMError } from "../fsm/CancelFSMError";
export class AnonBinding extends BindingImpl {
    firstFn;
    thenFn;
    whenFn;
    cancelFn;
    endOrCancelFn;
    hadEffectsFn;
    hadNoEffectFn;
    cannotExecFn;
    onEndFn;
    onErrFn;
    constructor(continuousExec, interaction, undoHistory, logger, cmdSupplierFn, widgets, dynamicNodes, loggers, timeoutThrottle, stopPropagation, prevDefault, linterRules, firstFn, thenFn, whenFn, endFn, cancelFn, endOrCancelFn, hadEffectsFn, hadNoEffectFn, cannotExecFn, onErrFn, name, accInit) {
        super(continuousExec, interaction, cmdSupplierFn, widgets, undoHistory, logger, linterRules, name, accInit);
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
        for (const node of dynamicNodes) {
            interaction.registerToNodeChildren(node);
        }
    }
    configureLoggers(loggers) {
        if (loggers.length > 0) {
            this.logCmd = loggers.includes("command");
            this.logBinding = loggers.includes("binding");
            this.logUsage = loggers.includes("usage");
            this.interaction.log(loggers.includes("interaction"));
        }
    }
    first() {
        const cmd = this.command;
        if (this.firstFn !== undefined && cmd !== undefined) {
            try {
                this.firstFn(cmd, this.interaction.data, this.accumulator);
            }
            catch (error) {
                this.catch(error);
                this.logger.logBindingErr("Crash in 'first'", error);
            }
        }
    }
    then() {
        const cmd = this.command;
        if (this.thenFn !== undefined && cmd !== undefined) {
            try {
                this.thenFn(cmd, this.interaction.data, this.accumulator);
            }
            catch (error) {
                this.catch(error);
                this.logger.logBindingErr("Crash in 'then'", error);
            }
        }
    }
    end() {
        const cmd = this.command;
        if (this.onEndFn !== undefined && cmd !== undefined) {
            try {
                this.onEndFn(cmd, this.interaction.data, this.accumulator);
            }
            catch (error) {
                this.catch(error);
                this.logger.logBindingErr("Crash in 'end'", error);
            }
        }
    }
    cancel() {
        if (this.cancelFn !== undefined) {
            try {
                this.cancelFn(this.interaction.data, this.accumulator);
            }
            catch (error) {
                this.catch(error);
                this.logger.logBindingErr("Crash in 'cancel'", error);
            }
        }
    }
    endOrCancel() {
        if (this.endOrCancelFn !== undefined) {
            try {
                this.endOrCancelFn(this.interaction.data, this.accumulator);
            }
            catch (error) {
                this.catch(error);
                this.logger.logBindingErr("Crash in 'endOrCancel'", error);
            }
        }
    }
    ifCmdHadNoEffect() {
        const cmd = this.command;
        if (this.hadNoEffectFn !== undefined && cmd !== undefined) {
            try {
                this.hadNoEffectFn(cmd, this.interaction.data, this.accumulator);
            }
            catch (error) {
                this.catch(error);
                this.logger.logBindingErr("Crash in 'ifHadNoEffect'", error);
            }
        }
    }
    ifCmdHadEffects() {
        const cmd = this.command;
        if (this.hadEffectsFn !== undefined && cmd !== undefined) {
            try {
                this.hadEffectsFn(cmd, this.interaction.data, this.accumulator);
            }
            catch (error) {
                this.catch(error);
                this.logger.logBindingErr("Crash in 'ifHadEffects'", error);
            }
        }
    }
    ifCannotExecuteCmd() {
        const cmd = this.command;
        if (this.cannotExecFn !== undefined && cmd !== undefined) {
            try {
                this.cannotExecFn(cmd, this.interaction.data, this.accumulator);
            }
            catch (error) {
                this.catch(error);
                this.logger.logBindingErr("Crash in 'ifCannotExecute'", error);
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
            res = when.fn(this.interaction.data, this.accumulator);
        }
        catch (error) {
            res = false;
            this.catch(error);
            this.logger.logBindingErr("Crash in checking condition", error);
        }
        if (!res && isWhenStrict(when.type)) {
            if (this.logBinding) {
                this.logger.logBindingMsg(`Cancelling interaction: ${this._interaction.constructor.name}`);
            }
            throw new CancelFSMError();
        }
        return res;
    }
    catch(err) {
        if (this.onErrFn !== undefined) {
            try {
                this.onErrFn(err);
            }
            catch (error) {
                this.logger.logBindingErr("Crash in 'catch'", error);
            }
        }
    }
    isWhenDefined() {
        return this.whenFn !== undefined && this.whenFn.length > 0;
    }
}
