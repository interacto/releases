import { AnonBinding } from "../binding/AnonBinding";
import { KeysDataImpl } from "../interaction/KeysDataImpl";
import { KeyDataImpl } from "../interaction/KeyDataImpl";
import { UpdateBinder } from "./UpdateBinder";
import { WhenType } from "../../api/binder/When";
export class KeysBinder extends UpdateBinder {
    constructor(undoHistory, logger, observer, binder) {
        super(undoHistory, logger, observer, binder);
        this.isCode = false;
        this.keysOrCodes = [];
        Object.assign(this, binder);
        this.copyFnArraysUpdate();
        this.keysOrCodes = this.keysOrCodes === undefined ? [] : [...this.keysOrCodes];
        this.completeWhenWithKeysPredicates();
    }
    completeWhenWithKeysPredicates() {
        const checkCodeFn = (i) => {
            let currentKeys = [];
            if (this.isCode) {
                if (i instanceof KeysDataImpl) {
                    currentKeys = i.keys.map(k => k.code);
                }
                else {
                    if (i instanceof KeyDataImpl) {
                        currentKeys = [i.code];
                    }
                }
            }
            else {
                if (i instanceof KeysDataImpl) {
                    currentKeys = i.keys.map(k => k.key);
                }
                else {
                    if (i instanceof KeyDataImpl) {
                        currentKeys = [i.key];
                    }
                }
            }
            return (this.keysOrCodes.length === 0 || this.keysOrCodes.length === currentKeys.length &&
                currentKeys.every((v) => this.keysOrCodes.includes(v)));
        };
        this.whenFnArray.push({
            "fn": checkCodeFn,
            "type": WhenType.nonStrict
        });
    }
    with(isCode, ...keysOrCodes) {
        const dup = this.duplicate();
        dup.keysOrCodes = [...keysOrCodes];
        dup.isCode = isCode;
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
    then(fn) {
        return super.then(fn);
    }
    continuousExecution() {
        return super.continuousExecution();
    }
    throttle(timeout) {
        return super.throttle(timeout);
    }
    cancel(fn) {
        return super.cancel(fn);
    }
    endOrCancel(fn) {
        return super.endOrCancel(fn);
    }
    catch(fn) {
        return super.catch(fn);
    }
    name(name) {
        return super.name(name);
    }
    toProduce(fn) {
        return super.toProduce(fn);
    }
    toProduceAnon(fn) {
        return super.toProduceAnon(fn);
    }
    usingInteraction(fn) {
        return super.usingInteraction(fn);
    }
    duplicate() {
        return new KeysBinder(this.undoHistory, this.logger, this.observer, this);
    }
    bind() {
        if (this.usingFn === undefined) {
            throw new Error("The interaction supplier cannot be undefined here");
        }
        if (this.produceFn === undefined) {
            throw new Error("The command supplier cannot be undefined here");
        }
        const binding = new AnonBinding(this.continuousCmdExecution, this.usingFn(), this.undoHistory, this.logger, this.produceFn, [...this.widgets], [...this.dynamicNodes], [...this.logLevels], this.throttleTimeout, this.stopPropagation, this.prevDefault, this.firstFn, this.thenFn, [...this.whenFnArray], this.endFn, this.cancelFn, this.endOrCancelFn, this.hadEffectsFn, this.hadNoEffectFn, this.cannotExecFn, this.onErrFn, this.bindingName);
        this.observer?.observeBinding(binding);
        return binding;
    }
}
