import { isEltRef } from "../../api/binder/BaseBinderBuilder";
import { AnonCmd } from "../command/AnonCmd";
export class Binder {
    firstFn;
    produceFn;
    widgets;
    dynamicNodes;
    usingFn;
    hadEffectsFn;
    hadNoEffectFn;
    cannotExecFn;
    endFn;
    onErrFn;
    logLevels;
    stopPropagation;
    prevDefault;
    bindingName;
    observer;
    undoHistory;
    logger;
    whenFnArray = [];
    firstFnArray = [];
    endFnArray = [];
    hadEffectsFnArray = [];
    hadNoEffectFnArray = [];
    cannotExecFnArray = [];
    onErrFnArray = [];
    accInit;
    linterRules;
    constructor(undoHistory, logger, observer, binder, acc) {
        this.widgets = [];
        this.dynamicNodes = [];
        this.logLevels = [];
        this.linterRules = new Map();
        this.stopPropagation = false;
        this.prevDefault = false;
        Object.assign(this, binder);
        this.accInit = acc;
        this.undoHistory = undoHistory;
        this.logger = logger;
        this.observer = observer;
        this.copyFnArrays();
    }
    copyFnArrays() {
        this.whenFnArray = Array.from(this.whenFnArray);
        this.firstFnArray = Array.from(this.firstFnArray);
        this.firstFn = (c, i, acc) => {
            for (const fn of this.firstFnArray) {
                fn(c, i, acc);
            }
        };
        this.endFnArray = Array.from(this.endFnArray);
        this.endFn = (c, i, acc) => {
            for (const fn of this.endFnArray) {
                fn(c, i, acc);
            }
        };
        this.hadEffectsFnArray = Array.from(this.hadEffectsFnArray);
        this.hadEffectsFn = (c, i, acc) => {
            for (const fn of this.hadEffectsFnArray) {
                fn(c, i, acc);
            }
        };
        this.hadNoEffectFnArray = Array.from(this.hadNoEffectFnArray);
        this.hadNoEffectFn = (c, i, acc) => {
            for (const fn of this.hadNoEffectFnArray) {
                fn(c, i, acc);
            }
        };
        this.cannotExecFnArray = Array.from(this.cannotExecFnArray);
        this.cannotExecFn = (c, i, acc) => {
            for (const fn of this.cannotExecFnArray) {
                fn(c, i, acc);
            }
        };
        this.onErrFnArray = Array.from(this.onErrFnArray);
        this.onErrFn = (ex) => {
            for (const fn of this.onErrFnArray) {
                fn(ex);
            }
        };
    }
    on(widget, ...widgets) {
        const ws = Array
            .from(widgets)
            .concat(widget)
            .map(currWidget => {
            if (isEltRef(currWidget)) {
                return currWidget.nativeElement;
            }
            return currWidget;
        });
        const currWidget = this.widgets.length === 0 ? ws : Array.from(this.widgets).concat(ws);
        const dup = this.duplicate();
        dup.widgets = currWidget;
        return dup;
    }
    onDynamic(node) {
        const dup = this.duplicate();
        const nodeEvt = isEltRef(node) ? node.nativeElement : node;
        dup.dynamicNodes = Array.from(this.dynamicNodes).concat(nodeEvt);
        return dup;
    }
    first(fn) {
        const dup = this.duplicate();
        dup.firstFnArray.push(fn);
        return dup;
    }
    when(fn, mode = "nonStrict") {
        const dup = this.duplicate();
        dup.whenFnArray.push({
            fn,
            "type": mode
        });
        return dup;
    }
    ifHadEffects(fn) {
        const dup = this.duplicate();
        dup.hadEffectsFnArray.push(fn);
        return dup;
    }
    ifHadNoEffect(fn) {
        const dup = this.duplicate();
        dup.hadNoEffectFnArray.push(fn);
        return dup;
    }
    ifCannotExecute(fn) {
        const dup = this.duplicate();
        dup.cannotExecFnArray.push(fn);
        return dup;
    }
    end(fn) {
        const dup = this.duplicate();
        dup.endFnArray.push(fn);
        return dup;
    }
    log(...level) {
        const dup = this.duplicate();
        dup.logLevels = Array.from(level);
        return dup;
    }
    stopImmediatePropagation() {
        const dup = this.duplicate();
        dup.stopPropagation = true;
        return dup;
    }
    preventDefault() {
        const dup = this.duplicate();
        dup.prevDefault = true;
        return dup;
    }
    catch(fn) {
        const dup = this.duplicate();
        dup.onErrFnArray.push(fn);
        return dup;
    }
    name(name) {
        const dup = this.duplicate();
        dup.bindingName = name;
        return dup;
    }
    configureRules(ruleName, severity) {
        const dup = this.duplicate();
        dup.linterRules.set(ruleName, severity);
        return dup;
    }
    usingInteraction(fn) {
        const dup = this.duplicate();
        dup.usingFn = fn;
        return dup;
    }
    toProduce(fn) {
        const dup = this.duplicate();
        dup.produceFn = fn;
        return dup;
    }
    toProduceAnon(fn) {
        const dup = this.duplicate();
        dup.produceFn = (() => new AnonCmd(fn));
        return dup;
    }
}
