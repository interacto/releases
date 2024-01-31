import { Binder } from "./Binder";
import { AnonBinding } from "../binding/AnonBinding";
export class UpdateBinder extends Binder {
    thenFn;
    cancelFn;
    endOrCancelFn;
    continuousCmdExecution;
    throttleTimeout;
    thenFnArray = [];
    cancelFnArray = [];
    endOrCancelFnArray = [];
    constructor(undoHistory, logger, observer, binder, acc) {
        super(undoHistory, logger, observer, binder, acc);
        this.continuousCmdExecution = false;
        this.throttleTimeout = 0;
        Object.assign(this, binder);
        this.copyFnArraysUpdate();
    }
    copyFnArraysUpdate() {
        super.copyFnArrays();
        this.thenFnArray = Array.from(this.thenFnArray);
        this.thenFn = (c, i, acc) => {
            for (const fn of this.thenFnArray) {
                fn(c, i, acc);
            }
        };
        this.cancelFnArray = Array.from(this.cancelFnArray);
        this.cancelFn = (i, acc) => {
            for (const fn of this.cancelFnArray) {
                fn(i, acc);
            }
        };
        this.endOrCancelFnArray = Array.from(this.endOrCancelFnArray);
        this.endOrCancelFn = (i, acc) => {
            for (const fn of this.endOrCancelFnArray) {
                fn(i, acc);
            }
        };
    }
    then(fn) {
        const dup = this.duplicate();
        dup.thenFnArray.push(fn);
        return dup;
    }
    continuousExecution() {
        const dup = this.duplicate();
        dup.continuousCmdExecution = true;
        return dup;
    }
    cancel(fn) {
        const dup = this.duplicate();
        dup.cancelFnArray.push(fn);
        return dup;
    }
    endOrCancel(fn) {
        const dup = this.duplicate();
        dup.endOrCancelFnArray.push(fn);
        return dup;
    }
    throttle(timeout) {
        const dup = this.duplicate();
        dup.throttleTimeout = timeout;
        return dup;
    }
    on(widget, ...widgets) {
        return super.on(widget, ...widgets);
    }
    onDynamic(node) {
        return super.onDynamic(node);
    }
    first(fn) {
        return super.first(fn);
    }
    when(fn, mode) {
        return super.when(fn, mode);
    }
    ifHadEffects(fn) {
        return super.ifHadEffects(fn);
    }
    ifHadNoEffect(fn) {
        return super.ifHadNoEffect(fn);
    }
    ifCannotExecute(fn) {
        return super.ifCannotExecute(fn);
    }
    end(fn) {
        return super.end(fn);
    }
    log(...level) {
        return super.log(...level);
    }
    stopImmediatePropagation() {
        return super.stopImmediatePropagation();
    }
    preventDefault() {
        return super.preventDefault();
    }
    catch(fn) {
        return super.catch(fn);
    }
    name(name) {
        return super.name(name);
    }
    configureRules(ruleName, severity) {
        return super.configureRules(ruleName, severity);
    }
    usingInteraction(fn) {
        return super.usingInteraction(fn);
    }
    toProduce(fn) {
        return super.toProduce(fn);
    }
    toProduceAnon(fn) {
        return super.toProduceAnon(fn);
    }
    duplicate() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, this);
    }
    bind() {
        if (this.usingFn === undefined) {
            throw new Error("The interaction supplier cannot be undefined here");
        }
        if (this.produceFn === undefined) {
            throw new Error("The command supplier cannot be undefined here");
        }
        const binding = new AnonBinding(this.continuousCmdExecution, this.usingFn(), this.undoHistory, this.logger, this.produceFn, Array.from(this.widgets), Array.from(this.dynamicNodes), Array.from(this.logLevels), this.throttleTimeout, this.stopPropagation, this.prevDefault, new Map(this.linterRules), this.firstFn, this.thenFn, Array.from(this.whenFnArray), this.endFn, this.cancelFn, this.endOrCancelFn, this.hadEffectsFn, this.hadNoEffectFn, this.cannotExecFn, this.onErrFn, this.bindingName, this.accInit);
        this.observer?.observeBinding(binding);
        return binding;
    }
}
