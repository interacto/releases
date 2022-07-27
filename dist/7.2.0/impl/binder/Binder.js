import { isEltRef } from "../../api/binder/BaseBinderBuilder";
import { AnonCmd } from "../command/AnonCmd";
import { WhenType } from "../../api/binder/When";
export class Binder {
    constructor(undoHistory, logger, observer, binder) {
        this.whenFnArray = [];
        this.firstFnArray = [];
        this.endFnArray = [];
        this.hadEffectsFnArray = [];
        this.hadNoEffectFnArray = [];
        this.cannotExecFnArray = [];
        this.onErrFnArray = [];
        Object.assign(this, binder);
        this.undoHistory = undoHistory;
        this.logger = logger;
        this.widgets ?? (this.widgets = []);
        this.dynamicNodes ?? (this.dynamicNodes = []);
        this.logLevels ?? (this.logLevels = []);
        this.stopPropagation ?? (this.stopPropagation = false);
        this.prevDefault ?? (this.prevDefault = false);
        this.observer = observer;
        this.copyFnArrays();
    }
    copyFnArrays() {
        this.whenFnArray = [...this.whenFnArray];
        this.firstFnArray = [...this.firstFnArray];
        this.firstFn = (c, i) => {
            this.firstFnArray.forEach(fn => {
                fn(c, i);
            });
        };
        this.endFnArray = [...this.endFnArray];
        this.endFn = (c, i) => {
            this.endFnArray.forEach(fn => {
                fn(c, i);
            });
        };
        this.hadEffectsFnArray = [...this.hadEffectsFnArray];
        this.hadEffectsFn = (c, i) => {
            this.hadEffectsFnArray.forEach(fn => {
                fn(c, i);
            });
        };
        this.hadNoEffectFnArray = [...this.hadNoEffectFnArray];
        this.hadNoEffectFn = (c, i) => {
            this.hadNoEffectFnArray.forEach(fn => {
                fn(c, i);
            });
        };
        this.cannotExecFnArray = [...this.cannotExecFnArray];
        this.cannotExecFn = (c, i) => {
            this.cannotExecFnArray.forEach(fn => {
                fn(c, i);
            });
        };
        this.onErrFnArray = [...this.onErrFnArray];
        this.onErrFn = (ex) => {
            this.onErrFnArray.forEach(fn => {
                fn(ex);
            });
        };
    }
    on(widget, ...widgets) {
        const ws = [...widgets].concat(widget).map(w => {
            if (isEltRef(w)) {
                return w.nativeElement;
            }
            return w;
        });
        const w = this.widgets.length === 0 ? ws : [...this.widgets].concat(ws);
        const dup = this.duplicate();
        dup.widgets = w;
        return dup;
    }
    onDynamic(node) {
        const dup = this.duplicate();
        const nodeEvt = isEltRef(node) ? node.nativeElement : node;
        dup.dynamicNodes = [...this.dynamicNodes].concat(nodeEvt);
        return dup;
    }
    first(fn) {
        const dup = this.duplicate();
        dup.firstFnArray.push(fn);
        return dup;
    }
    when(fn, mode = WhenType.nonStrict) {
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
        dup.logLevels = [...level];
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
