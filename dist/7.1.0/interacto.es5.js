function isEltRef(o) {
    if (o === undefined || o === null) {
        return false;
    }
    return o.nativeElement instanceof EventTarget;
}

var WhenType;
(function (WhenType) {
    WhenType[WhenType["nonStrict"] = 0] = "nonStrict";
    WhenType[WhenType["strict"] = 1] = "strict";
    WhenType[WhenType["strictStart"] = 2] = "strictStart";
    WhenType[WhenType["then"] = 3] = "then";
    WhenType[WhenType["strictThen"] = 4] = "strictThen";
    WhenType[WhenType["end"] = 5] = "end";
})(WhenType || (WhenType = {}));
function isWhenAtStart(type) {
    return type === WhenType.strictStart || type === WhenType.then || type === WhenType.nonStrict || type === WhenType.strict;
}
function isWhenAtThen(type) {
    return type === WhenType.strictThen || type === WhenType.then || type === WhenType.nonStrict || type === WhenType.strict;
}
function isWhenAtEnd(type) {
    return type === WhenType.end || type === WhenType.nonStrict || type === WhenType.strict;
}
function isWhenStrict(type) {
    return type === WhenType.end || type === WhenType.strict || type === WhenType.strictThen || type === WhenType.strictStart;
}

class Bindings {
}

var CmdStatus;
(function (CmdStatus) {
    CmdStatus[CmdStatus["created"] = 0] = "created";
    CmdStatus[CmdStatus["executed"] = 1] = "executed";
    CmdStatus[CmdStatus["cancelled"] = 2] = "cancelled";
    CmdStatus[CmdStatus["done"] = 3] = "done";
    CmdStatus[CmdStatus["flushed"] = 4] = "flushed";
})(CmdStatus || (CmdStatus = {}));

const eventTypes = [
    "mousedown",
    "mouseup",
    "mousemove",
    "mouseover",
    "mouseout",
    "mouseenter",
    "mouseleave",
    "mousemove",
    "keydown",
    "keyup",
    "click",
    "auxclick",
    "input",
    "scroll",
    "change",
    "touchstart",
    "touchend",
    "touchmove",
    "wheel"
];

function isOutputStateType(obj) {
    if (obj === undefined) {
        return false;
    }
    return "exit" in obj && "addTransition" in obj && "process" in obj && "transitions" in obj;
}

var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["interaction"] = 0] = "interaction";
    LogLevel[LogLevel["binding"] = 1] = "binding";
    LogLevel[LogLevel["command"] = 2] = "command";
    LogLevel[LogLevel["usage"] = 3] = "usage";
})(LogLevel || (LogLevel = {}));

class TreeUndoHistory {
}

class UndoHistory {
}

function isUndoableType(obj) {
    if (typeof obj !== "object" || obj === null) {
        return false;
    }
    return "undo" in obj && "redo" in obj && "getUndoName" in obj;
}

class DwellSpringAnimation {
    constructor(handle, spring) {
        var _a;
        this.displaySpring = false;
        this.radius = parseInt((_a = handle.nativeElement.getAttribute("r")) !== null && _a !== void 0 ? _a : "20", 10);
        this.handle = handle;
        this.spring = spring;
        this.positionSpring = {
            "x": 0,
            "y": 0
        };
    }
    process(i) {
        if (this.displaySpring) {
            const distance = Math.sqrt((i.tgt.clientX - this.positionSpring.x) ** 2 + (i.tgt.clientY - this.positionSpring.y) ** 2);
            if (Math.abs(distance) > (this.radius * 4)) {
                this.spring.nativeElement.setAttribute("display", "none");
                this.handle.nativeElement.setAttribute("display", "none");
                this.displaySpring = false;
            }
        }
        else {
            clearInterval(this.interval);
            this.interval = window.setInterval(() => {
                clearInterval(this.interval);
                this.displaySpring = true;
                this.positionSpring = {
                    "x": i.tgt.clientX < this.radius ? this.radius : i.tgt.clientX - this.radius * 2,
                    "y": i.tgt.clientY
                };
                this.spring.nativeElement.setAttribute("display", "block");
                this.handle.nativeElement.setAttribute("display", "block");
                this.handle.nativeElement.setAttribute("cx", String(this.positionSpring.x));
                this.handle.nativeElement.setAttribute("cy", String(this.positionSpring.y));
                this.spring.nativeElement.setAttribute("x1", String(i.src.clientX));
                this.spring.nativeElement.setAttribute("y1", String(i.src.clientY));
                this.spring.nativeElement.setAttribute("x2", String(this.positionSpring.x));
                this.spring.nativeElement.setAttribute("y2", String(i.tgt.clientY));
            }, 1000);
        }
    }
    end() {
        clearInterval(this.interval);
        this.displaySpring = false;
        this.spring.nativeElement.setAttribute("display", "none");
        this.handle.nativeElement.setAttribute("display", "none");
    }
}

class CommandBase {
    constructor() {
        this.status = CmdStatus.created;
    }
    flush() {
        this.status = CmdStatus.flushed;
    }
    createMemento() {
    }
    execute() {
        let ok;
        if ((this.status === CmdStatus.created || this.status === CmdStatus.executed) && this.canExecute()) {
            if (this.status === CmdStatus.created) {
                this.createMemento();
            }
            ok = true;
            try {
                const result = this.execution();
                if (result instanceof Promise) {
                    return result
                        .then(() => {
                        this.status = CmdStatus.executed;
                        return true;
                    })
                        .catch(() => {
                        this.status = CmdStatus.executed;
                        return false;
                    });
                }
            }
            catch (err) {
                this.status = CmdStatus.executed;
                throw err;
            }
            this.status = CmdStatus.executed;
        }
        else {
            ok = false;
        }
        return ok;
    }
    hadEffect() {
        return this.isDone();
    }
    done() {
        if (this.status === CmdStatus.created || this.status === CmdStatus.executed) {
            this.status = CmdStatus.done;
        }
    }
    isDone() {
        return this.status === CmdStatus.done;
    }
    cancel() {
        this.status = CmdStatus.cancelled;
    }
    getStatus() {
        return this.status;
    }
    canExecute() {
        return true;
    }
}

class AnonCmd extends CommandBase {
    constructor(fct) {
        super();
        this.exec = fct;
    }
    canExecute() {
        return true;
    }
    execution() {
        this.exec();
    }
}

class Binder {
    constructor(undoHistory, logger, observer, binder) {
        var _a, _b, _c, _d, _e;
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
        (_a = this.widgets) !== null && _a !== void 0 ? _a : (this.widgets = []);
        (_b = this.dynamicNodes) !== null && _b !== void 0 ? _b : (this.dynamicNodes = []);
        (_c = this.logLevels) !== null && _c !== void 0 ? _c : (this.logLevels = []);
        (_d = this.stopPropagation) !== null && _d !== void 0 ? _d : (this.stopPropagation = false);
        (_e = this.prevDefault) !== null && _e !== void 0 ? _e : (this.prevDefault = false);
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

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

function isFunction(value) {
    return typeof value === 'function';
}

function createErrorClass(createImpl) {
    var _super = function (instance) {
        Error.call(instance);
        instance.stack = new Error().stack;
    };
    var ctorFunc = createImpl(_super);
    ctorFunc.prototype = Object.create(Error.prototype);
    ctorFunc.prototype.constructor = ctorFunc;
    return ctorFunc;
}

var UnsubscriptionError = createErrorClass(function (_super) {
    return function UnsubscriptionErrorImpl(errors) {
        _super(this);
        this.message = errors
            ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ')
            : '';
        this.name = 'UnsubscriptionError';
        this.errors = errors;
    };
});

function arrRemove(arr, item) {
    if (arr) {
        var index = arr.indexOf(item);
        0 <= index && arr.splice(index, 1);
    }
}

var Subscription = (function () {
    function Subscription(initialTeardown) {
        this.initialTeardown = initialTeardown;
        this.closed = false;
        this._parentage = null;
        this._teardowns = null;
    }
    Subscription.prototype.unsubscribe = function () {
        var e_1, _a, e_2, _b;
        var errors;
        if (!this.closed) {
            this.closed = true;
            var _parentage = this._parentage;
            if (_parentage) {
                this._parentage = null;
                if (Array.isArray(_parentage)) {
                    try {
                        for (var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
                            var parent_1 = _parentage_1_1.value;
                            parent_1.remove(this);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return)) _a.call(_parentage_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                else {
                    _parentage.remove(this);
                }
            }
            var initialTeardown = this.initialTeardown;
            if (isFunction(initialTeardown)) {
                try {
                    initialTeardown();
                }
                catch (e) {
                    errors = e instanceof UnsubscriptionError ? e.errors : [e];
                }
            }
            var _teardowns = this._teardowns;
            if (_teardowns) {
                this._teardowns = null;
                try {
                    for (var _teardowns_1 = __values(_teardowns), _teardowns_1_1 = _teardowns_1.next(); !_teardowns_1_1.done; _teardowns_1_1 = _teardowns_1.next()) {
                        var teardown_1 = _teardowns_1_1.value;
                        try {
                            execTeardown(teardown_1);
                        }
                        catch (err) {
                            errors = errors !== null && errors !== void 0 ? errors : [];
                            if (err instanceof UnsubscriptionError) {
                                errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
                            }
                            else {
                                errors.push(err);
                            }
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_teardowns_1_1 && !_teardowns_1_1.done && (_b = _teardowns_1.return)) _b.call(_teardowns_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            if (errors) {
                throw new UnsubscriptionError(errors);
            }
        }
    };
    Subscription.prototype.add = function (teardown) {
        var _a;
        if (teardown && teardown !== this) {
            if (this.closed) {
                execTeardown(teardown);
            }
            else {
                if (teardown instanceof Subscription) {
                    if (teardown.closed || teardown._hasParent(this)) {
                        return;
                    }
                    teardown._addParent(this);
                }
                (this._teardowns = (_a = this._teardowns) !== null && _a !== void 0 ? _a : []).push(teardown);
            }
        }
    };
    Subscription.prototype._hasParent = function (parent) {
        var _parentage = this._parentage;
        return _parentage === parent || (Array.isArray(_parentage) && _parentage.includes(parent));
    };
    Subscription.prototype._addParent = function (parent) {
        var _parentage = this._parentage;
        this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
    };
    Subscription.prototype._removeParent = function (parent) {
        var _parentage = this._parentage;
        if (_parentage === parent) {
            this._parentage = null;
        }
        else if (Array.isArray(_parentage)) {
            arrRemove(_parentage, parent);
        }
    };
    Subscription.prototype.remove = function (teardown) {
        var _teardowns = this._teardowns;
        _teardowns && arrRemove(_teardowns, teardown);
        if (teardown instanceof Subscription) {
            teardown._removeParent(this);
        }
    };
    Subscription.EMPTY = (function () {
        var empty = new Subscription();
        empty.closed = true;
        return empty;
    })();
    return Subscription;
}());
var EMPTY_SUBSCRIPTION = Subscription.EMPTY;
function isSubscription(value) {
    return (value instanceof Subscription ||
        (value && 'closed' in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe)));
}
function execTeardown(teardown) {
    if (isFunction(teardown)) {
        teardown();
    }
    else {
        teardown.unsubscribe();
    }
}

var config = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: undefined,
    useDeprecatedSynchronousErrorHandling: false,
    useDeprecatedNextContext: false,
};

var timeoutProvider = {
    setTimeout: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var delegate = timeoutProvider.delegate;
        return ((delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) || setTimeout).apply(void 0, __spreadArray([], __read(args)));
    },
    clearTimeout: function (handle) {
        var delegate = timeoutProvider.delegate;
        return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
    },
    delegate: undefined,
};

function reportUnhandledError(err) {
    timeoutProvider.setTimeout(function () {
        {
            throw err;
        }
    });
}

function noop() { }

var context = null;
function errorContext(cb) {
    if (config.useDeprecatedSynchronousErrorHandling) {
        var isRoot = !context;
        if (isRoot) {
            context = { errorThrown: false, error: null };
        }
        cb();
        if (isRoot) {
            var _a = context, errorThrown = _a.errorThrown, error = _a.error;
            context = null;
            if (errorThrown) {
                throw error;
            }
        }
    }
    else {
        cb();
    }
}

var Subscriber = (function (_super) {
    __extends(Subscriber, _super);
    function Subscriber(destination) {
        var _this = _super.call(this) || this;
        _this.isStopped = false;
        if (destination) {
            _this.destination = destination;
            if (isSubscription(destination)) {
                destination.add(_this);
            }
        }
        else {
            _this.destination = EMPTY_OBSERVER;
        }
        return _this;
    }
    Subscriber.create = function (next, error, complete) {
        return new SafeSubscriber(next, error, complete);
    };
    Subscriber.prototype.next = function (value) {
        if (this.isStopped) ;
        else {
            this._next(value);
        }
    };
    Subscriber.prototype.error = function (err) {
        if (this.isStopped) ;
        else {
            this.isStopped = true;
            this._error(err);
        }
    };
    Subscriber.prototype.complete = function () {
        if (this.isStopped) ;
        else {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (!this.closed) {
            this.isStopped = true;
            _super.prototype.unsubscribe.call(this);
            this.destination = null;
        }
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        try {
            this.destination.error(err);
        }
        finally {
            this.unsubscribe();
        }
    };
    Subscriber.prototype._complete = function () {
        try {
            this.destination.complete();
        }
        finally {
            this.unsubscribe();
        }
    };
    return Subscriber;
}(Subscription));
var SafeSubscriber = (function (_super) {
    __extends(SafeSubscriber, _super);
    function SafeSubscriber(observerOrNext, error, complete) {
        var _this = _super.call(this) || this;
        var next;
        if (isFunction(observerOrNext)) {
            next = observerOrNext;
        }
        else if (observerOrNext) {
            (next = observerOrNext.next, error = observerOrNext.error, complete = observerOrNext.complete);
            var context_1;
            if (_this && config.useDeprecatedNextContext) {
                context_1 = Object.create(observerOrNext);
                context_1.unsubscribe = function () { return _this.unsubscribe(); };
            }
            else {
                context_1 = observerOrNext;
            }
            next = next === null || next === void 0 ? void 0 : next.bind(context_1);
            error = error === null || error === void 0 ? void 0 : error.bind(context_1);
            complete = complete === null || complete === void 0 ? void 0 : complete.bind(context_1);
        }
        _this.destination = {
            next: next ? wrapForErrorHandling(next) : noop,
            error: wrapForErrorHandling(error !== null && error !== void 0 ? error : defaultErrorHandler),
            complete: complete ? wrapForErrorHandling(complete) : noop,
        };
        return _this;
    }
    return SafeSubscriber;
}(Subscriber));
function wrapForErrorHandling(handler, instance) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        try {
            handler.apply(void 0, __spreadArray([], __read(args)));
        }
        catch (err) {
            {
                reportUnhandledError(err);
            }
        }
    };
}
function defaultErrorHandler(err) {
    throw err;
}
var EMPTY_OBSERVER = {
    closed: true,
    next: noop,
    error: defaultErrorHandler,
    complete: noop,
};

var observable = (function () { return (typeof Symbol === 'function' && Symbol.observable) || '@@observable'; })();

function identity(x) {
    return x;
}

function pipeFromArray(fns) {
    if (fns.length === 0) {
        return identity;
    }
    if (fns.length === 1) {
        return fns[0];
    }
    return function piped(input) {
        return fns.reduce(function (prev, fn) { return fn(prev); }, input);
    };
}

var Observable = (function () {
    function Observable(subscribe) {
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    Observable.prototype.lift = function (operator) {
        var observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    };
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var _this = this;
        var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
        errorContext(function () {
            var _a = _this, operator = _a.operator, source = _a.source;
            subscriber.add(operator
                ?
                    operator.call(subscriber, source)
                : source
                    ?
                        _this._subscribe(subscriber)
                    :
                        _this._trySubscribe(subscriber));
        });
        return subscriber;
    };
    Observable.prototype._trySubscribe = function (sink) {
        try {
            return this._subscribe(sink);
        }
        catch (err) {
            sink.error(err);
        }
    };
    Observable.prototype.forEach = function (next, promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var subscriber = new SafeSubscriber({
                next: function (value) {
                    try {
                        next(value);
                    }
                    catch (err) {
                        reject(err);
                        subscriber.unsubscribe();
                    }
                },
                error: reject,
                complete: resolve,
            });
            _this.subscribe(subscriber);
        });
    };
    Observable.prototype._subscribe = function (subscriber) {
        var _a;
        return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
    };
    Observable.prototype[observable] = function () {
        return this;
    };
    Observable.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        return pipeFromArray(operations)(this);
    };
    Observable.prototype.toPromise = function (promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var value;
            _this.subscribe(function (x) { return (value = x); }, function (err) { return reject(err); }, function () { return resolve(value); });
        });
    };
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    return Observable;
}());
function getPromiseCtor(promiseCtor) {
    var _a;
    return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a !== void 0 ? _a : Promise;
}
function isObserver(value) {
    return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
}
function isSubscriber(value) {
    return (value && value instanceof Subscriber) || (isObserver(value) && isSubscription(value));
}

var ObjectUnsubscribedError = createErrorClass(function (_super) {
    return function ObjectUnsubscribedErrorImpl() {
        _super(this);
        this.name = 'ObjectUnsubscribedError';
        this.message = 'object unsubscribed';
    };
});

var Subject = (function (_super) {
    __extends(Subject, _super);
    function Subject() {
        var _this = _super.call(this) || this;
        _this.closed = false;
        _this.observers = [];
        _this.isStopped = false;
        _this.hasError = false;
        _this.thrownError = null;
        return _this;
    }
    Subject.prototype.lift = function (operator) {
        var subject = new AnonymousSubject(this, this);
        subject.operator = operator;
        return subject;
    };
    Subject.prototype._throwIfClosed = function () {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
    };
    Subject.prototype.next = function (value) {
        var _this = this;
        errorContext(function () {
            var e_1, _a;
            _this._throwIfClosed();
            if (!_this.isStopped) {
                var copy = _this.observers.slice();
                try {
                    for (var copy_1 = __values(copy), copy_1_1 = copy_1.next(); !copy_1_1.done; copy_1_1 = copy_1.next()) {
                        var observer = copy_1_1.value;
                        observer.next(value);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (copy_1_1 && !copy_1_1.done && (_a = copy_1.return)) _a.call(copy_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
        });
    };
    Subject.prototype.error = function (err) {
        var _this = this;
        errorContext(function () {
            _this._throwIfClosed();
            if (!_this.isStopped) {
                _this.hasError = _this.isStopped = true;
                _this.thrownError = err;
                var observers = _this.observers;
                while (observers.length) {
                    observers.shift().error(err);
                }
            }
        });
    };
    Subject.prototype.complete = function () {
        var _this = this;
        errorContext(function () {
            _this._throwIfClosed();
            if (!_this.isStopped) {
                _this.isStopped = true;
                var observers = _this.observers;
                while (observers.length) {
                    observers.shift().complete();
                }
            }
        });
    };
    Subject.prototype.unsubscribe = function () {
        this.isStopped = this.closed = true;
        this.observers = null;
    };
    Object.defineProperty(Subject.prototype, "observed", {
        get: function () {
            var _a;
            return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
        },
        enumerable: false,
        configurable: true
    });
    Subject.prototype._trySubscribe = function (subscriber) {
        this._throwIfClosed();
        return _super.prototype._trySubscribe.call(this, subscriber);
    };
    Subject.prototype._subscribe = function (subscriber) {
        this._throwIfClosed();
        this._checkFinalizedStatuses(subscriber);
        return this._innerSubscribe(subscriber);
    };
    Subject.prototype._innerSubscribe = function (subscriber) {
        var _a = this, hasError = _a.hasError, isStopped = _a.isStopped, observers = _a.observers;
        return hasError || isStopped
            ? EMPTY_SUBSCRIPTION
            : (observers.push(subscriber), new Subscription(function () { return arrRemove(observers, subscriber); }));
    };
    Subject.prototype._checkFinalizedStatuses = function (subscriber) {
        var _a = this, hasError = _a.hasError, thrownError = _a.thrownError, isStopped = _a.isStopped;
        if (hasError) {
            subscriber.error(thrownError);
        }
        else if (isStopped) {
            subscriber.complete();
        }
    };
    Subject.prototype.asObservable = function () {
        var observable = new Observable();
        observable.source = this;
        return observable;
    };
    Subject.create = function (destination, source) {
        return new AnonymousSubject(destination, source);
    };
    return Subject;
}(Observable));
var AnonymousSubject = (function (_super) {
    __extends(AnonymousSubject, _super);
    function AnonymousSubject(destination, source) {
        var _this = _super.call(this) || this;
        _this.destination = destination;
        _this.source = source;
        return _this;
    }
    AnonymousSubject.prototype.next = function (value) {
        var _a, _b;
        (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 ? void 0 : _b.call(_a, value);
    };
    AnonymousSubject.prototype.error = function (err) {
        var _a, _b;
        (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, err);
    };
    AnonymousSubject.prototype.complete = function () {
        var _a, _b;
        (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    AnonymousSubject.prototype._subscribe = function (subscriber) {
        var _a, _b;
        return (_b = (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null && _b !== void 0 ? _b : EMPTY_SUBSCRIPTION;
    };
    return AnonymousSubject;
}(Subject));

class MustBeUndoableCmdError extends Error {
    constructor(cmdProducer) {
        super(`The following command must be undoable: ${String(cmdProducer)}`);
    }
}

class BindingImpl {
    constructor(continuousExecution, interaction, cmdProducer, widgets, undoHistory, logger, name) {
        this._name = name;
        this.logBinding = false;
        this.logCmd = false;
        this.logUsage = false;
        this._timeCancelled = 0;
        this._timeEnded = 0;
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
    get name() {
        var _a;
        return (_a = this._name) !== null && _a !== void 0 ? _a : this._interaction.constructor.name;
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
        catch (ex) {
            this.logger.logBindingErr("Error while creating a command", ex);
            this.catch(ex);
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
        if (this.logUsage) {
            this.logger.logBindingEnd(this.name, true);
        }
    }
    cancelContinousWithEffectsCmd(c) {
        if (isUndoableType(c)) {
            c.undo();
            if (this.logCmd) {
                this.logger.logCmdMsg("Command undone", c.constructor.name);
            }
        }
        else {
            throw new MustBeUndoableCmdError(c);
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
            }).catch((ex) => {
                this.logger.logCmdErr("Error while executing the command continuously", ex);
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
            }).catch((ex) => {
                this.logger.logCmdErr("Error while executing the command", ex);
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
        if (cmd.getStatus() !== CmdStatus.executed) {
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
}

class CancelFSMException extends Error {
    constructor() {
        super();
    }
}

class AnonBinding extends BindingImpl {
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
        var _a, _b;
        const ok = (_b = (_a = this.whenFn) === null || _a === void 0 ? void 0 : _a.filter(filterPredicate).every(when => this.executeWhen(when))) !== null && _b !== void 0 ? _b : false;
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

class KeysDataImpl {
    constructor() {
        this.keysData = [];
    }
    flush() {
        this.keysData.length = 0;
    }
    get keys() {
        return this.keysData;
    }
    addKey(key) {
        this.keysData.push(key);
    }
}

class InteractionDataBase {
    constructor() {
        this.currentTargetData = null;
        this.targetData = null;
        this.timeStampData = 0;
    }
    copy(data) {
        this.currentTargetData = data.currentTarget;
        this.targetData = data.target;
        this.timeStampData = data.timeStamp;
    }
    flush() {
        this.currentTargetData = null;
        this.targetData = null;
        this.timeStampData = 0;
    }
    get currentTarget() {
        return this.currentTargetData;
    }
    get target() {
        return this.targetData;
    }
    get timeStamp() {
        return this.timeStampData;
    }
}

class KeyDataImpl extends InteractionDataBase {
    constructor() {
        super(...arguments);
        this.codeData = "";
        this.keyData = "";
        this.locationData = 0;
        this.repeatData = false;
        this.altKeyData = false;
        this.ctrlKeyData = false;
        this.metaKeyData = false;
        this.shiftKeyData = false;
    }
    flush() {
        super.flush();
        this.codeData = "";
        this.keyData = "";
        this.locationData = 0;
        this.repeatData = false;
        this.altKeyData = false;
        this.ctrlKeyData = false;
        this.metaKeyData = false;
        this.shiftKeyData = false;
    }
    copy(data) {
        super.copy(data);
        this.codeData = data.code;
        this.keyData = data.key;
        this.locationData = data.location;
        this.repeatData = data.repeat;
        this.altKeyData = data.altKey;
        this.ctrlKeyData = data.ctrlKey;
        this.metaKeyData = data.metaKey;
        this.shiftKeyData = data.shiftKey;
    }
    get altKey() {
        return this.altKeyData;
    }
    get code() {
        return this.codeData;
    }
    get ctrlKey() {
        return this.ctrlKeyData;
    }
    get key() {
        return this.keyData;
    }
    get location() {
        return this.locationData;
    }
    get metaKey() {
        return this.metaKeyData;
    }
    get repeat() {
        return this.repeatData;
    }
    get shiftKey() {
        return this.shiftKeyData;
    }
}

class UpdateBinder extends Binder {
    constructor(undoHistory, logger, observer, binder) {
        var _a, _b;
        super(undoHistory, logger, observer, binder);
        this.thenFnArray = [];
        this.cancelFnArray = [];
        this.endOrCancelFnArray = [];
        Object.assign(this, binder);
        (_a = this.continuousCmdExecution) !== null && _a !== void 0 ? _a : (this.continuousCmdExecution = false);
        (_b = this.throttleTimeout) !== null && _b !== void 0 ? _b : (this.throttleTimeout = 0);
        this.copyFnArraysUpdate();
    }
    copyFnArraysUpdate() {
        super.copyFnArrays();
        this.thenFnArray = [...this.thenFnArray];
        this.thenFn = (c, i) => {
            this.thenFnArray.forEach(fn => {
                fn(c, i);
            });
        };
        this.cancelFnArray = [...this.cancelFnArray];
        this.cancelFn = (i) => {
            this.cancelFnArray.forEach(fn => {
                fn(i);
            });
        };
        this.endOrCancelFnArray = [...this.endOrCancelFnArray];
        this.endOrCancelFn = (i) => {
            this.endOrCancelFnArray.forEach(fn => {
                fn(i);
            });
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
        var _a;
        if (this.usingFn === undefined) {
            throw new Error("The interaction supplier cannot be undefined here");
        }
        if (this.produceFn === undefined) {
            throw new Error("The command supplier cannot be undefined here");
        }
        const binding = new AnonBinding(this.continuousCmdExecution, this.usingFn(), this.undoHistory, this.logger, this.produceFn, [...this.widgets], [...this.dynamicNodes], [...this.logLevels], this.throttleTimeout, this.stopPropagation, this.prevDefault, this.firstFn, this.thenFn, [...this.whenFnArray], this.endFn, this.cancelFn, this.endOrCancelFn, this.hadEffectsFn, this.hadNoEffectFn, this.cannotExecFn, this.onErrFn, this.bindingName);
        (_a = this.observer) === null || _a === void 0 ? void 0 : _a.observeBinding(binding);
        return binding;
    }
}

class KeysBinder extends UpdateBinder {
    constructor(undoHistory, logger, observer, binder) {
        super(undoHistory, logger, observer, binder);
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
        var _a;
        if (this.usingFn === undefined) {
            throw new Error("The interaction supplier cannot be undefined here");
        }
        if (this.produceFn === undefined) {
            throw new Error("The command supplier cannot be undefined here");
        }
        const binding = new AnonBinding(this.continuousCmdExecution, this.usingFn(), this.undoHistory, this.logger, this.produceFn, [...this.widgets], [...this.dynamicNodes], [...this.logLevels], this.throttleTimeout, this.stopPropagation, this.prevDefault, this.firstFn, this.thenFn, [...this.whenFnArray], this.endFn, this.cancelFn, this.endOrCancelFn, this.hadEffectsFn, this.hadNoEffectFn, this.cannotExecFn, this.onErrFn, this.bindingName);
        (_a = this.observer) === null || _a === void 0 ? void 0 : _a.observeBinding(binding);
        return binding;
    }
}

class BindingsContext {
    constructor() {
        this.binds = [];
        this.disposables = [];
        this.cmds = [];
    }
    observeBinding(binding) {
        this.binds.push(binding);
        this.disposables.push(binding.produces.subscribe(cmd => this.cmds.push([cmd, binding])));
    }
    clearObservedBindings() {
        this.disposables.forEach(d => {
            d.unsubscribe();
        });
        this.binds.forEach(b => {
            b.uninstallBinding();
        });
    }
    get bindings() {
        return this.binds;
    }
    get commands() {
        return this.cmds.map(tuple => tuple[0]);
    }
    getCmd(index) {
        return this.cmds[index][0];
    }
    getCmdsProducedBy(binding) {
        return this.cmds
            .filter(c => c[1] === binding)
            .map(c => c[0]);
    }
}

function isEventType(evtType) {
    return eventTypes.includes(evtType);
}
function getTouch(touches, idToFind) {
    for (let i = 0; i < touches.length; i++) {
        if (touches[i].identifier === idToFind) {
            return touches[i];
        }
    }
    return undefined;
}
function isTouchEvent(eventType) {
    return eventType === "touchstart" || eventType === "touchend" || eventType === "touchmove";
}
function isMouseEvent(eventType) {
    return eventType === "mousedown" || eventType === "mouseup" || eventType === "mousemove" ||
        eventType === "mouseover" || eventType === "click" || eventType === "auxclick" || eventType === "mouseout" ||
        eventType === "mouseenter" || eventType === "mouseleave" || eventType === "wheel";
}
function isKeyEvent(eventType) {
    return eventType === "keydown" || eventType === "keyup";
}
function isButton(target) {
    return target instanceof HTMLButtonElement;
}
function isCheckBox(target) {
    return target instanceof HTMLInputElement && target.getAttribute("type") === "checkbox";
}
function isColorChoice(target) {
    return target instanceof HTMLInputElement && target.getAttribute("type") === "color";
}
function isComboBox(target) {
    return target instanceof HTMLSelectElement;
}
function isDatePicker(target) {
    return target instanceof HTMLInputElement && target.getAttribute("type") === "date";
}
function isSpinner(target) {
    return target instanceof HTMLInputElement && target.getAttribute("type") === "number";
}
function isHyperLink(target) {
    return target instanceof HTMLAnchorElement;
}
function isTextInput(target) {
    return (target instanceof HTMLInputElement && target.getAttribute("type") === "text") ||
        target instanceof HTMLTextAreaElement;
}
function isKeyDownEvent(event) {
    return event instanceof KeyboardEvent && isEventType(event.type) && event.type === "keydown";
}
function isKeyUpEvent(event) {
    return event instanceof KeyboardEvent && isEventType(event.type) && event.type === "keyup";
}
function isMouseDownEvent(event) {
    return event instanceof MouseEvent && isEventType(event.type) && event.type === "mousedown";
}
function isScrollEvent(event) {
    return isEventType(event.type) && event.type === "scroll";
}
var KeyCode;
(function (KeyCode) {
    KeyCode[KeyCode["escape"] = 27] = "escape";
})(KeyCode || (KeyCode = {}));

class TransitionBase {
    constructor(srcState, tgtState) {
        this.src = srcState;
        this.tgt = tgtState;
        this.src.addTransition(this);
    }
    execute(event) {
        if (this.accept(event) && this.isGuardOK(event)) {
            this.src.fsm.stopCurrentTimeout();
            this.action(event);
            this.src.exit();
            this.tgt.enter();
            return this.tgt;
        }
        return undefined;
    }
    action(_event) {
    }
    isGuardOK(_event) {
        return true;
    }
    get target() {
        return this.tgt;
    }
    uninstall() {
    }
}

class ButtonPressedTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(e) {
        return e.currentTarget !== null && isButton(e.currentTarget);
    }
    getAcceptedEvents() {
        return ["click", "auxclick"];
    }
}

class StateBase {
    constructor(stateMachine, stateName) {
        this.fsm = stateMachine;
        this.name = stateName;
    }
    checkStartingState() {
        if (!this.fsm.started && this.fsm.startingState === this) {
            this.fsm.onStarting();
        }
    }
    uninstall() {
    }
}

class TerminalState extends StateBase {
    constructor(stateMachine, stateName) {
        super(stateMachine, stateName);
    }
    enter() {
        this.checkStartingState();
        this.fsm.onTerminating();
    }
}

class OutputStateBase extends StateBase {
    constructor(stateMachine, stateName) {
        super(stateMachine, stateName);
        this._transitions = [];
    }
    process(event) {
        return this.transitions.find(tr => {
            try {
                return tr.execute(event) !== undefined;
            }
            catch (err) {
                if (err instanceof CancelFSMException) {
                    return false;
                }
                throw err;
            }
        }) !== undefined;
    }
    clearTransitions() {
        this._transitions.length = 0;
    }
    get transitions() {
        return [...this._transitions];
    }
    addTransition(tr) {
        this._transitions.push(tr);
    }
    uninstall() {
        super.uninstall();
        this.transitions.forEach(tr => {
            tr.uninstall();
        });
        this._transitions.length = 0;
    }
}

class InitState extends OutputStateBase {
    constructor(stateMachine, stateName) {
        super(stateMachine, stateName);
    }
    exit() {
        this.checkStartingState();
    }
}

class TimeoutTransition extends TransitionBase {
    constructor(srcState, tgtState, timeout, logger) {
        super(srcState, tgtState);
        this.logger = logger;
        this.timeouted = false;
        this.timeoutDuration = timeout;
        this.timeouted = false;
    }
    startTimeout() {
        if (this.timeoutThread === undefined) {
            const time = this.timeoutDuration();
            if (time <= 0) {
                this.src.fsm.onTimeout();
                return;
            }
            this.timeoutThread = window.setTimeout(() => {
                var _a;
                try {
                    this.timeouted = true;
                    this.src.fsm.onTimeout();
                }
                catch (ex) {
                    (_a = this.logger) === null || _a === void 0 ? void 0 : _a.logInteractionErr("Exception on timeout of a timeout transition", ex);
                }
            }, time);
        }
    }
    stopTimeout() {
        if (this.timeoutThread !== undefined) {
            clearTimeout(this.timeoutThread);
            this.timeoutThread = undefined;
        }
    }
    accept(event) {
        return this.timeouted;
    }
    isGuardOK(_event) {
        return this.timeouted;
    }
    execute(event) {
        try {
            if (this.accept(event) && this.isGuardOK(event)) {
                this.src.exit();
                this.action(event);
                this.tgt.enter();
                this.timeouted = false;
                return this.tgt;
            }
            return undefined;
        }
        catch (ex) {
            this.timeouted = false;
            throw ex;
        }
    }
    getAcceptedEvents() {
        return [];
    }
}

function remove(array, elt) {
    const index = array.indexOf(elt);
    if (index > -1) {
        array.splice(index, 1);
    }
}
function removeAt(array, index) {
    if (index > -1) {
        return array.splice(index, 1)[0];
    }
    return undefined;
}
function peek(array) {
    return array[array.length - 1];
}

class FSMImpl {
    constructor(logger) {
        this.logger = logger;
        this.inner = false;
        this._started = false;
        this.initState = new InitState(this, "init");
        this._states = [this.initState];
        this.startingState = this.initState;
        this._currentState = this.initState;
        this.currentStatePublisher = new Subject();
        this.handlers = [];
        this.eventsToProcess = [];
        this.currentSubFSM = undefined;
        this._log = false;
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        this.dataHandler = dataHandler;
    }
    get currentState() {
        return this._currentState;
    }
    set currentState(state) {
        const old = this._currentState;
        this._currentState = state;
        this.currentStatePublisher.next([old, this._currentState]);
    }
    get currentStateObservable() {
        return this.currentStatePublisher;
    }
    process(event) {
        if (isKeyUpEvent(event)) {
            this.removeKeyEvent(event.code);
        }
        const processed = this.processEvent(event);
        if (processed && isKeyDownEvent(event) && !(this._currentState instanceof InitState) &&
            this.eventsToProcess.find(evt => isKeyDownEvent(evt) && evt.code === event.code) === undefined) {
            this.addRemaningEventsToProcess(event);
        }
        return processed;
    }
    processEvent(event) {
        var _a, _b;
        if (this.currentSubFSM !== undefined) {
            if (this.log) {
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.logInteractionMsg(`processing event ${String(event.type)} in a sub-FSM`, this.constructor.name);
            }
            return this.currentSubFSM.process(event);
        }
        if (this.log) {
            (_b = this.logger) === null || _b === void 0 ? void 0 : _b.logInteractionMsg(`processing event ${String(event.type)} at state 
            ${this.currentState.name}: ${this.constructor.name}`, this.constructor.name);
        }
        try {
            return this.currentState.process(event);
        }
        catch (err) {
            this.notifyHandlerOnError(err);
            return false;
        }
    }
    get log() {
        return this._log;
    }
    set log(log) {
        this._log = log;
    }
    getDataHandler() {
        return this.dataHandler;
    }
    removeKeyEvent(key) {
        let removed = false;
        for (let i = 0, size = this.eventsToProcess.length; i < size && !removed; i++) {
            const event = this.eventsToProcess[i];
            if (event instanceof KeyboardEvent && event.code === key) {
                removed = true;
                removeAt(this.eventsToProcess, i);
            }
        }
    }
    enterStdState(state) {
        this.currentState = state;
        this.checkTimeoutTransition();
        if (this.started) {
            this.onUpdating();
        }
    }
    get started() {
        return this._started;
    }
    processRemainingEvents() {
        const list = [...this.eventsToProcess];
        list.forEach(event => {
            var _a;
            removeAt(this.eventsToProcess, 0);
            if (this.log) {
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.logInteractionMsg("Recycling event", this.constructor.name);
            }
            this.process(event);
        });
    }
    addRemaningEventsToProcess(event) {
        this.eventsToProcess.push(event);
    }
    onError(err) {
        this.notifyHandlerOnError(err);
    }
    onTerminating() {
        var _a;
        if (this.log) {
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.logInteractionMsg("FSM ended", this.constructor.name);
        }
        if (this.started) {
            this.notifyHandlerOnStop();
        }
        this.reinit();
        this.processRemainingEvents();
    }
    onCancelling() {
        var _a;
        if (this.log) {
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.logInteractionMsg("FSM cancelled", this.constructor.name);
        }
        if (this.started) {
            this.notifyHandlerOnCancel();
        }
        this.fullReinit();
    }
    onStarting() {
        var _a;
        if (this.log) {
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.logInteractionMsg("FSM started", this.constructor.name);
        }
        this._started = true;
        this.notifyHandlerOnStart();
    }
    onUpdating() {
        var _a;
        if (this.started) {
            if (this.log) {
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.logInteractionMsg("FSM updated", this.constructor.name);
            }
            this.notifyHandlerOnUpdate();
        }
    }
    addState(state) {
        this._states.push(state);
    }
    reinit() {
        var _a, _b, _c;
        if (this.log) {
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.logInteractionMsg("FSM reinitialised", this.constructor.name);
        }
        (_b = this.currentTimeout) === null || _b === void 0 ? void 0 : _b.stopTimeout();
        this._started = false;
        this.currentState = this.initState;
        this.currentTimeout = undefined;
        (_c = this.currentSubFSM) === null || _c === void 0 ? void 0 : _c.reinit();
        if (this.dataHandler !== undefined && !this.inner) {
            this.dataHandler.reinitData();
        }
    }
    fullReinit() {
        var _a;
        this.eventsToProcess.length = 0;
        this.reinit();
        (_a = this.currentSubFSM) === null || _a === void 0 ? void 0 : _a.fullReinit();
    }
    onTimeout() {
        var _a;
        if (this.currentTimeout !== undefined) {
            if (this.log) {
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.logInteractionMsg("Timeout", this.constructor.name);
            }
            const state = this.currentTimeout.execute();
            if (isOutputStateType(state)) {
                this.currentState = state;
                this.checkTimeoutTransition();
            }
        }
    }
    stopCurrentTimeout() {
        var _a;
        if (this.currentTimeout !== undefined) {
            if (this.log) {
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.logInteractionMsg("Timeout stopped", this.constructor.name);
            }
            this.currentTimeout.stopTimeout();
            this.currentTimeout = undefined;
        }
    }
    checkTimeoutTransition() {
        var _a;
        const tr = this.currentState.transitions
            .find(t => t instanceof TimeoutTransition);
        if (tr !== undefined) {
            if (this.log) {
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.logInteractionMsg("Timeout starting", this.constructor.name);
            }
            this.currentTimeout = tr;
            this.currentTimeout.startTimeout();
        }
    }
    addHandler(handler) {
        this.handlers.push(handler);
    }
    removeHandler(handler) {
        remove(this.handlers, handler);
    }
    notifyHandlerOnStart() {
        var _a;
        try {
            this.handlers.forEach(handler => {
                var _a;
                (_a = handler.fsmStarts) === null || _a === void 0 ? void 0 : _a.call(handler);
            });
        }
        catch (ex) {
            if (ex instanceof CancelFSMException) {
                this.onCancelling();
            }
            else {
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.logInteractionErr("An 'fsmStarts' produced an error", ex, this.constructor.name);
                this.onCancelling();
            }
            throw ex;
        }
    }
    notifyHandlerOnUpdate() {
        var _a;
        try {
            this.handlers.forEach(handler => {
                var _a;
                (_a = handler.fsmUpdates) === null || _a === void 0 ? void 0 : _a.call(handler);
            });
        }
        catch (ex) {
            if (ex instanceof CancelFSMException) {
                this.onCancelling();
            }
            else {
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.logInteractionErr("An 'fsmUpdates' produced an error", ex, this.constructor.name);
                this.onCancelling();
            }
            throw ex;
        }
    }
    notifyHandlerOnStop() {
        var _a;
        try {
            [...this.handlers].forEach(handler => {
                var _a;
                (_a = handler.fsmStops) === null || _a === void 0 ? void 0 : _a.call(handler);
            });
        }
        catch (ex) {
            if (!(ex instanceof CancelFSMException)) {
                (_a = this.logger) === null || _a === void 0 ? void 0 : _a.logInteractionErr("An 'fsmStops' produced an error", ex, this.constructor.name);
            }
            this.onCancelling();
            throw ex;
        }
    }
    notifyHandlerOnCancel() {
        var _a;
        try {
            [...this.handlers].forEach(handler => {
                var _a;
                (_a = handler.fsmCancels) === null || _a === void 0 ? void 0 : _a.call(handler);
            });
        }
        catch (ex) {
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.logInteractionErr("An 'fsmCancels' produced an error", ex, this.constructor.name);
            throw ex;
        }
    }
    notifyHandlerOnError(err) {
        var _a;
        try {
            [...this.handlers].forEach(handler => {
                var _a;
                (_a = handler.fsmError) === null || _a === void 0 ? void 0 : _a.call(handler, err);
            });
        }
        catch (ex) {
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.logInteractionErr("An 'fsmError' produced an error", ex, this.constructor.name);
        }
    }
    get states() {
        return [...this._states];
    }
    getEventsToProcess() {
        return [...this.eventsToProcess];
    }
    uninstall() {
        this.fullReinit();
        this.log = false;
        this.currentStatePublisher.complete();
        this.currentSubFSM = undefined;
        this._states.forEach(state => {
            state.uninstall();
        });
        this._states.length = 0;
        this.dataHandler = undefined;
    }
}

class InteractionBase {
    constructor(fsm, data, logger) {
        this.logger = logger;
        this.activated = false;
        this.stopImmediatePropag = false;
        this.preventDef = false;
        this._data = data;
        this._fsm = fsm;
        this.disposable = this._fsm.currentStateObservable.subscribe(current => {
            this.updateEventsRegistered(current[1], current[0]);
        });
        this.activated = true;
        this.asLog = false;
        this.registeredNodes = new Set();
        this.mutationObservers = [];
        this.throttleTimeout = 0;
    }
    reinitData() {
        this._data.flush();
    }
    get data() {
        return this._data;
    }
    setThrottleTimeout(timeout) {
        this.throttleTimeout = timeout;
    }
    createThrottleTimeout() {
        var _a;
        (_a = this.currentThrottling) === null || _a === void 0 ? void 0 : _a.cancel();
        this.currentThrottling = undefined;
        const currTimeout = this.throttleTimeout;
        let rejection;
        let timeout;
        this.currentThrottling = new Promise((resolve, reject) => {
            rejection = reject;
            timeout = setTimeout(() => {
                try {
                    const evt = this.latestThrottledEvent;
                    this.latestThrottledEvent = undefined;
                    if (evt !== undefined) {
                        this.directEventProcess(evt);
                    }
                    resolve();
                }
                catch (ex) {
                    rejection(ex);
                }
            }, currTimeout);
        }).catch((ex) => {
            var _a;
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.logInteractionErr("Error during the throttling process", ex, this.constructor.name);
        });
        this.currentThrottling.cancel = () => {
            clearTimeout(timeout);
            rejection(new Error("cancellation"));
        };
    }
    checkThrottlingEvent(event) {
        const latestEvt = this.latestThrottledEvent;
        if (latestEvt === undefined || latestEvt.type !== event.type) {
            if (latestEvt !== undefined) {
                this.directEventProcess(latestEvt);
            }
            this.latestThrottledEvent = event;
            this.createThrottleTimeout();
        }
        else {
            this.latestThrottledEvent = event;
        }
    }
    updateEventsRegistered(newState, oldState) {
        if (newState === oldState || this._fsm.states.length === 2) {
            return;
        }
        const currEvents = this.getCurrentAcceptedEvents(newState);
        const events = [...this.getEventTypesOf(oldState)];
        const eventsToRemove = events.filter(e => !currEvents.includes(e));
        const eventsToAdd = currEvents.filter(e => !events.includes(e));
        this.registeredNodes.forEach(n => {
            eventsToRemove.forEach(type => {
                this.unregisterEventToNode(type, n);
            });
            eventsToAdd.forEach(type => {
                this.registerEventToNode(type, n);
            });
        });
    }
    getCurrentAcceptedEvents(state) {
        return [...this.getEventTypesOf(state)];
    }
    callBackMutationObserver(mutationList) {
        mutationList.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                this.registerToNodes([node]);
            });
            mutation.removedNodes.forEach(node => {
                this.unregisterFromNodes([node]);
            });
        });
    }
    getEventTypesOf(state) {
        const tr = state.transitions;
        if (tr.length === 0) {
            return [];
        }
        return tr.map(t => t.getAcceptedEvents())
            .reduce((a, b) => [...a, ...b]);
    }
    registerToNodes(widgets) {
        widgets.forEach(w => {
            this.registeredNodes.add(w);
            this.onNewNodeRegistered(w);
        });
    }
    unregisterFromNodes(widgets) {
        widgets.forEach(w => {
            this.registeredNodes.delete(w);
            this.onNodeUnregistered(w);
        });
    }
    onNodeUnregistered(node) {
        this.getEventTypesOf(this._fsm.currentState).forEach(type => {
            this.unregisterEventToNode(type, node);
        });
    }
    onNewNodeRegistered(node) {
        this.getEventTypesOf(this._fsm.currentState).forEach(type => {
            this.registerEventToNode(type, node);
        });
    }
    registerToNodeChildren(elementToObserve) {
        elementToObserve.childNodes.forEach((node) => {
            this.registerToNodes([node]);
        });
        const newMutationObserver = new MutationObserver(mutations => {
            this.callBackMutationObserver(mutations);
        });
        newMutationObserver.observe(elementToObserve, { "childList": true });
        this.mutationObservers.push(newMutationObserver);
    }
    registerEventToNode(eventType, node) {
        if (isMouseEvent(eventType)) {
            node.addEventListener(eventType, this.getMouseHandler());
            return;
        }
        if (isTouchEvent(eventType)) {
            node.addEventListener(eventType, this.getTouchHandler());
            return;
        }
        if (isKeyEvent(eventType)) {
            node.addEventListener(eventType, this.getKeyHandler());
            return;
        }
        if (eventType === "scroll") {
            node.addEventListener(eventType, this.getUIHandler());
        }
    }
    unregisterEventToNode(eventType, node) {
        if (isMouseEvent(eventType)) {
            node.removeEventListener(eventType, this.getMouseHandler());
            return;
        }
        if (isTouchEvent(eventType)) {
            node.removeEventListener(eventType, this.getTouchHandler());
            return;
        }
        if (isKeyEvent(eventType)) {
            node.removeEventListener(eventType, this.getKeyHandler());
            return;
        }
        if (eventType === "scroll") {
            node.removeEventListener(eventType, this.getUIHandler());
        }
    }
    registerActionHandlerClick(node) {
        node.addEventListener("click", this.getActionHandler());
        node.addEventListener("auxclick", this.getActionHandler());
    }
    unregisterActionHandlerClick(node) {
        node.removeEventListener("click", this.getActionHandler());
        node.removeEventListener("auxclick", this.getActionHandler());
    }
    registerActionHandlerInput(node) {
        node.addEventListener("input", this.getActionHandler());
    }
    unregisterActionHandlerInput(node) {
        node.removeEventListener("input", this.getActionHandler());
    }
    getActionHandler() {
        if (this.actionHandler === undefined) {
            this.actionHandler = (evt) => {
                this.processEvent(evt);
            };
        }
        return this.actionHandler;
    }
    getMouseHandler() {
        if (this.mouseHandler === undefined) {
            this.mouseHandler = (evt) => {
                this.processEvent(evt);
            };
        }
        return this.mouseHandler;
    }
    getTouchHandler() {
        if (this.touchHandler === undefined) {
            this.touchHandler = (evt) => {
                this.processEvent(evt);
            };
        }
        return this.touchHandler;
    }
    getKeyHandler() {
        if (this.keyHandler === undefined) {
            this.keyHandler = (evt) => {
                this.processEvent(evt);
            };
        }
        return this.keyHandler;
    }
    getUIHandler() {
        if (this.uiHandler === undefined) {
            this.uiHandler = (evt) => {
                this.processEvent(evt);
            };
        }
        return this.uiHandler;
    }
    isRunning() {
        return this.activated && !(this._fsm.currentState instanceof InitState);
    }
    fullReinit() {
        this._fsm.fullReinit();
    }
    set stopImmediatePropagation(stop) {
        this.stopImmediatePropag = stop;
    }
    get stopImmediatePropagation() {
        return this.stopImmediatePropag;
    }
    set preventDefault(prevent) {
        this.preventDef = prevent;
    }
    get preventDefault() {
        return this.preventDef;
    }
    processEvent(event) {
        if (this.isActivated()) {
            if (this.throttleTimeout <= 0) {
                this.directEventProcess(event);
            }
            else {
                this.checkThrottlingEvent(event);
            }
        }
    }
    directEventProcess(event) {
        const processed = this._fsm.process(event);
        if (processed) {
            if (this.preventDef) {
                event.preventDefault();
            }
            if (this.stopImmediatePropag) {
                event.stopImmediatePropagation();
            }
        }
    }
    log(log) {
        this.asLog = log;
        this._fsm.log = log;
    }
    isActivated() {
        return this.activated;
    }
    setActivated(activated) {
        var _a;
        if (this.asLog) {
            (_a = this.logger) === null || _a === void 0 ? void 0 : _a.logInteractionMsg(`Interaction activation: ${String(activated)}`, this.constructor.name);
        }
        this.activated = activated;
        if (!activated) {
            this._fsm.fullReinit();
        }
    }
    get fsm() {
        return this._fsm;
    }
    reinit() {
        this._fsm.reinit();
        this.reinitData();
    }
    uninstall() {
        this.disposable.unsubscribe();
        this.registeredNodes.forEach(n => {
            this.onNodeUnregistered(n);
        });
        this.registeredNodes.clear();
        this.mutationObservers.forEach(m => {
            m.disconnect();
        });
        this.mutationObservers.length = 0;
        this.setActivated(false);
    }
}

class WidgetDataImpl extends InteractionDataBase {
    get widget() {
        return this.targetData;
    }
}

class ButtonPressedFSM extends FSMImpl {
    constructor() {
        super();
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const pressed = new TerminalState(this, "pressed");
        this.addState(pressed);
        const tr = new ButtonPressedTransition(this.initState, pressed);
        tr.action = (event) => {
            dataHandler.initToPressedHandler(event);
        };
    }
}
class ButtonPressed extends InteractionBase {
    constructor() {
        super(new ButtonPressedFSM(), new WidgetDataImpl());
        this.handler = {
            "initToPressedHandler": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
    onNewNodeRegistered(node) {
        if (isButton(node)) {
            this.registerActionHandlerClick(node);
        }
    }
    onNodeUnregistered(node) {
        if (isButton(node)) {
            this.unregisterActionHandlerClick(node);
        }
    }
}

class BoxCheckPressedTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(event) {
        return event.currentTarget !== null && isCheckBox(event.currentTarget);
    }
    getAcceptedEvents() {
        return ["input"];
    }
}

class BoxCheckedFSM extends FSMImpl {
    constructor() {
        super();
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const checked = new TerminalState(this, "checked");
        this.addState(checked);
        const tr = new BoxCheckPressedTransition(this.initState, checked);
        tr.action = (event) => {
            dataHandler.initToCheckHandler(event);
        };
    }
}
class BoxChecked extends InteractionBase {
    constructor() {
        super(new BoxCheckedFSM(), new WidgetDataImpl());
        this.handler = {
            "initToCheckHandler": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
    onNewNodeRegistered(node) {
        if (isCheckBox(node)) {
            this.registerActionHandlerInput(node);
        }
    }
    onNodeUnregistered(node) {
        if (isCheckBox(node)) {
            this.unregisterActionHandlerInput(node);
        }
    }
}

class ColorPickedTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(event) {
        return event.currentTarget !== null && isColorChoice(event.currentTarget);
    }
    getAcceptedEvents() {
        return ["input"];
    }
}

class ColorPickedFSM extends FSMImpl {
    constructor() {
        super();
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const picked = new TerminalState(this, "picked");
        this.addState(picked);
        const tr = new ColorPickedTransition(this.initState, picked);
        tr.action = (event) => {
            dataHandler.initToPickedHandler(event);
        };
    }
}
class ColorPicked extends InteractionBase {
    constructor() {
        super(new ColorPickedFSM(), new WidgetDataImpl());
        this.handler = {
            "initToPickedHandler": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
    onNewNodeRegistered(node) {
        if (isColorChoice(node)) {
            this.registerActionHandlerInput(node);
        }
    }
    onNodeUnregistered(node) {
        if (isColorChoice(node)) {
            this.unregisterActionHandlerInput(node);
        }
    }
}

class ComboBoxTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(event) {
        return event.currentTarget !== null && isComboBox(event.currentTarget);
    }
    getAcceptedEvents() {
        return ["input"];
    }
}

class ComboBoxSelectedFSM extends FSMImpl {
    constructor() {
        super();
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const selected = new TerminalState(this, "selected");
        this.addState(selected);
        const tr = new ComboBoxTransition(this.initState, selected);
        tr.action = (event) => {
            dataHandler.initToSelectedHandler(event);
        };
    }
}
class ComboBoxSelected extends InteractionBase {
    constructor() {
        super(new ComboBoxSelectedFSM(), new WidgetDataImpl());
        this.handler = {
            "initToSelectedHandler": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
    onNewNodeRegistered(node) {
        if (isComboBox(node)) {
            this.registerActionHandlerInput(node);
        }
    }
    onNodeUnregistered(node) {
        if (isComboBox(node)) {
            this.unregisterActionHandlerInput(node);
        }
    }
}

class SpinnerChangedTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(event) {
        return event.currentTarget !== null && isSpinner(event.currentTarget);
    }
    getAcceptedEvents() {
        return ["input"];
    }
}

class StdState extends OutputStateBase {
    constructor(stateMachine, stateName) {
        super(stateMachine, stateName);
    }
    enter() {
        this.checkStartingState();
        this.fsm.enterStdState(this);
    }
    exit() {
    }
}

class SpinnerChangedFSM extends FSMImpl {
    static getTimeGap() {
        return SpinnerChangedFSM.timeGap;
    }
    static setTimeGap(timeGapBetweenClicks) {
        if (timeGapBetweenClicks > 0) {
            SpinnerChangedFSM.timeGap = timeGapBetweenClicks;
        }
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const changed = new StdState(this, "valueChanged");
        const ended = new TerminalState(this, "ended");
        this.addState(changed);
        this.addState(ended);
        const spinnerAction = (event) => {
            dataHandler.initToChangedHandler(event);
        };
        const changedInit = new SpinnerChangedTransition(this.initState, changed);
        changedInit.action = spinnerAction;
        const changedChanged = new SpinnerChangedTransition(changed, changed);
        changedChanged.action = spinnerAction;
        new TimeoutTransition(changed, ended, SpinnerChangedFSM.timeGapSupplier);
    }
}
SpinnerChangedFSM.timeGap = 300;
SpinnerChangedFSM.timeGapSupplier = () => SpinnerChangedFSM.getTimeGap();
class SpinnerChanged extends InteractionBase {
    constructor() {
        super(new SpinnerChangedFSM(), new WidgetDataImpl());
        this.handler = {
            "initToChangedHandler": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
    onNewNodeRegistered(node) {
        if (isSpinner(node)) {
            this.registerActionHandlerInput(node);
        }
    }
    onNodeUnregistered(node) {
        if (isSpinner(node)) {
            this.unregisterActionHandlerInput(node);
        }
    }
}

class DatePickedTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(event) {
        return event.currentTarget !== null && isDatePicker(event.currentTarget);
    }
    getAcceptedEvents() {
        return ["input"];
    }
}

class DatePickedFSM extends FSMImpl {
    constructor() {
        super();
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const picked = new TerminalState(this, "picked");
        this.addState(picked);
        const tr = new DatePickedTransition(this.initState, picked);
        tr.action = (event) => {
            dataHandler.initToPickedHandler(event);
        };
    }
}
class DatePicked extends InteractionBase {
    constructor() {
        super(new DatePickedFSM(), new WidgetDataImpl());
        this.handler = {
            "initToPickedHandler": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
    onNewNodeRegistered(node) {
        if (isDatePicker(node)) {
            this.registerActionHandlerInput(node);
        }
    }
    onNodeUnregistered(node) {
        if (isDatePicker(node)) {
            this.unregisterActionHandlerInput(node);
        }
    }
}

class TextInputChangedTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(event) {
        return event.currentTarget !== null && isTextInput(event.currentTarget);
    }
    getAcceptedEvents() {
        return ["input"];
    }
}

class TextInputChangedFSM extends FSMImpl {
    constructor(timeSet) {
        super();
        this._timeGap = 1000;
        this.timeGapSupplier = () => this.getTimeGap();
        if (timeSet !== undefined) {
            this._timeGap = timeSet;
        }
    }
    getTimeGap() {
        return this._timeGap;
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const changed = new StdState(this, "changed");
        const ended = new TerminalState(this, "ended");
        this.addState(changed);
        this.addState(ended);
        const trInit = new TextInputChangedTransition(this.initState, changed);
        trInit.action = (event) => {
            dataHandler.initToChangedHandler(event);
        };
        const trChanged = new TextInputChangedTransition(changed, changed);
        trChanged.action = (event) => {
            dataHandler.initToChangedHandler(event);
        };
        new TimeoutTransition(changed, ended, this.timeGapSupplier);
    }
}
class TextInputChanged extends InteractionBase {
    constructor(timeGap) {
        super(new TextInputChangedFSM(timeGap), new WidgetDataImpl());
        this.handler = {
            "initToChangedHandler": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
    onNewNodeRegistered(node) {
        if (isTextInput(node)) {
            this.registerActionHandlerInput(node);
        }
    }
    onNodeUnregistered(node) {
        if (isTextInput(node)) {
            this.unregisterActionHandlerInput(node);
        }
    }
}

class ConcurrentFSM extends FSMImpl {
    constructor(fsms, secondaries = [], totalReinit = false) {
        super();
        this.totalReinit = totalReinit;
        const handler = {
            "fsmStarts": () => {
                if (this.started) {
                    this.onStarting();
                }
            },
            "fsmUpdates": () => {
                this.onUpdating();
            },
            "fsmStops": () => {
                this.onTerminating();
            },
            "fsmCancels": () => {
                this.onCancelling();
            },
            "fsmError": (err) => {
                this.notifyHandlerOnError(err);
            }
        };
        this._conccurFSMs = [...fsms];
        this._secondaryFSMs = [...secondaries];
        this.conccurFSMs.forEach(fsm => {
            fsm.addHandler(handler);
        });
    }
    getAllConccurFSMs() {
        return [...this._conccurFSMs, ...this._secondaryFSMs];
    }
    get conccurFSMs() {
        return [...this._conccurFSMs];
    }
    get secondaryFSMs() {
        return [...this._secondaryFSMs];
    }
    process(event) {
        return this.getAllConccurFSMs().some(conccurFSM => conccurFSM.process(event));
    }
    get started() {
        return this.conccurFSMs.every(fsm => fsm.started);
    }
    set log(log) {
        super.log = log;
        this.conccurFSMs.forEach(fsm => {
            fsm.log = log;
        });
        this.secondaryFSMs.forEach(fsm => {
            fsm.log = log;
        });
    }
    uninstall() {
        super.uninstall();
        this.conccurFSMs.forEach(fsm => {
            fsm.uninstall();
        });
        this.secondaryFSMs.forEach(fsm => {
            fsm.uninstall();
        });
    }
    fullReinit() {
        if (this.totalReinit) {
            this.conccurFSMs.forEach(f => {
                f.fullReinit();
            });
            this.secondaryFSMs.forEach(f => {
                f.fullReinit();
            });
        }
        super.fullReinit();
    }
    reinit() {
        if (this.totalReinit) {
            this.conccurFSMs.forEach(f => {
                f.reinit();
            });
            this.secondaryFSMs.forEach(f => {
                f.reinit();
            });
        }
        super.reinit();
    }
}

class ConcurrentInteraction extends InteractionBase {
    constructor(fsm, data) {
        super(fsm, data);
        this.subscriptions = this.fsm.getAllConccurFSMs()
            .map(conc => conc.currentStateObservable
            .subscribe(current => {
            this.updateEventsRegistered(current[1], current[0]);
        }));
    }
    isRunning() {
        return this.isActivated() && this.fsm.started;
    }
    onNodeUnregistered(node) {
        this.getCurrentAcceptedEvents().forEach(type => {
            this.unregisterEventToNode(type, node);
        });
    }
    onNewNodeRegistered(node) {
        this.getCurrentAcceptedEvents().forEach(type => {
            this.registerEventToNode(type, node);
        });
    }
    getCurrentAcceptedEvents(_state) {
        return this.fsm.getAllConccurFSMs().flatMap(concFSM => [...this.getEventTypesOf(concFSM.currentState)]);
    }
    uninstall() {
        super.uninstall();
        this.subscriptions.forEach(sub => {
            sub.unsubscribe();
        });
    }
}

class TouchPressureTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(evt) {
        return evt instanceof TouchEvent && isEventType(evt.type) && this.getAcceptedEvents().includes(evt.type);
    }
    getAcceptedEvents() {
        return ["touchstart"];
    }
}

class TouchMoveTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(evt) {
        return evt instanceof TouchEvent && isEventType(evt.type) && this.getAcceptedEvents().includes(evt.type);
    }
    getAcceptedEvents() {
        return ["touchmove"];
    }
}

class TouchReleaseTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(evt) {
        return evt instanceof TouchEvent && isEventType(evt.type) && this.getAcceptedEvents().includes(evt.type);
    }
    getAcceptedEvents() {
        return ["touchend"];
    }
}

class PointingDataBase extends InteractionDataBase {
    constructor() {
        super(...arguments);
        this.clientXData = 0;
        this.clientYData = 0;
        this.pageXData = 0;
        this.pageYData = 0;
        this.screenXData = 0;
        this.screenYData = 0;
        this.altKeyData = false;
        this.ctrlKeyData = false;
        this.metaKeyData = false;
        this.shiftKeyData = false;
    }
    flush() {
        super.flush();
        this.clientXData = 0;
        this.clientYData = 0;
        this.pageXData = 0;
        this.pageYData = 0;
        this.screenXData = 0;
        this.screenYData = 0;
        this.altKeyData = false;
        this.ctrlKeyData = false;
        this.metaKeyData = false;
        this.shiftKeyData = false;
    }
    copy(data) {
        super.copy(data);
        this.clientXData = data.clientX;
        this.clientYData = data.clientY;
        this.pageXData = data.pageX;
        this.pageYData = data.pageY;
        this.screenXData = data.screenX;
        this.screenYData = data.screenY;
        this.altKeyData = data.altKey;
        this.ctrlKeyData = data.ctrlKey;
        this.metaKeyData = data.metaKey;
        this.shiftKeyData = data.shiftKey;
    }
    get clientX() {
        return this.clientXData;
    }
    get clientY() {
        return this.clientYData;
    }
    get pageX() {
        return this.pageXData;
    }
    get pageY() {
        return this.pageYData;
    }
    get screenX() {
        return this.screenXData;
    }
    get screenY() {
        return this.screenYData;
    }
    get altKey() {
        return this.altKeyData;
    }
    get ctrlKey() {
        return this.ctrlKeyData;
    }
    get metaKey() {
        return this.metaKeyData;
    }
    get shiftKey() {
        return this.shiftKeyData;
    }
}

class TouchDataImpl extends PointingDataBase {
    constructor() {
        super(...arguments);
        this._allTouches = [];
        this.forceData = 0;
        this.identifierData = 0;
        this.radiusXData = 0;
        this.radiusYData = 0;
        this.rotationAngleData = 0;
    }
    get allTouches() {
        return this._allTouches;
    }
    get force() {
        return this.forceData;
    }
    get identifier() {
        return this.identifierData;
    }
    get radiusX() {
        return this.radiusXData;
    }
    get radiusY() {
        return this.radiusYData;
    }
    get rotationAngle() {
        return this.rotationAngleData;
    }
    copy(data) {
        super.copy(data);
        this.forceData = data.force;
        this.identifierData = data.identifier;
        this.radiusXData = data.radiusX;
        this.radiusYData = data.radiusY;
        this.rotationAngleData = data.rotationAngle;
        this._allTouches = data.allTouches.map(t => {
            const newT = new TouchDataImpl();
            newT.copy(t);
            return newT;
        });
    }
    flush() {
        super.flush();
        this.forceData = 0;
        this.identifierData = 0;
        this.radiusXData = 0;
        this.radiusYData = 0;
        this.rotationAngleData = 0;
        this._allTouches = [];
    }
    static mergeTouchEventData(touch, evt, allTouches) {
        const data = new TouchDataImpl();
        data.copy({
            "clientX": touch.clientX,
            "clientY": touch.clientY,
            "force": touch.force,
            "identifier": touch.identifier,
            "pageX": touch.pageX,
            "pageY": touch.pageY,
            "radiusX": touch.radiusX,
            "radiusY": touch.radiusY,
            "rotationAngle": touch.rotationAngle,
            "screenX": touch.screenX,
            "screenY": touch.screenY,
            "target": touch.target,
            "allTouches": allTouches.map(t => TouchDataImpl.mergeTouchEventData(t, evt, [])),
            "timeStamp": evt.timeStamp,
            "altKey": evt.altKey,
            "shiftKey": evt.shiftKey,
            "ctrlKey": evt.ctrlKey,
            "metaKey": evt.metaKey,
            "currentTarget": evt.currentTarget
        });
        return data;
    }
}

class SrcTgtTouchDataImpl {
    constructor() {
        this.srcData = new TouchDataImpl();
        this.tgtData = new TouchDataImpl();
    }
    get src() {
        return this.srcData;
    }
    get tgt() {
        return this.tgtData;
    }
    flush() {
        this.srcData.flush();
        this.tgtData.flush();
    }
    copySrc(data, evt, allTouches) {
        this.srcData.copy(TouchDataImpl.mergeTouchEventData(data, evt, allTouches));
    }
    copyTgt(data, evt, allTouches) {
        this.tgtData.copy(TouchDataImpl.mergeTouchEventData(data, evt, allTouches));
    }
    get diffClientX() {
        return this.tgt.clientX - this.src.clientX;
    }
    get diffClientY() {
        return this.tgt.clientY - this.src.clientY;
    }
    get diffPageX() {
        return this.tgt.pageX - this.src.pageX;
    }
    get diffPageY() {
        return this.tgt.pageY - this.src.pageY;
    }
    get diffScreenX() {
        return this.tgt.screenX - this.src.screenX;
    }
    get diffScreenY() {
        return this.tgt.screenY - this.src.screenY;
    }
    get duration() {
        return this.tgtData.timeStamp - this.srcData.timeStamp;
    }
    get velocity() {
        return Math.sqrt(this.diffScreenX ** 2 + this.diffScreenY ** 2) / this.duration;
    }
    isHorizontal(pxTolerance) {
        return Math.abs(this.diffScreenY) <= pxTolerance;
    }
    isVertical(pxTolerance) {
        return Math.abs(this.diffScreenX) <= pxTolerance;
    }
}

class CancellingState extends StateBase {
    constructor(stateMachine, stateName) {
        super(stateMachine, stateName);
    }
    enter() {
        this.fsm.onCancelling();
    }
    uninstall() {
    }
}

class TouchDnDFSM extends FSMImpl {
    constructor(cancellable, movementRequired = true) {
        super();
        this.touchID = undefined;
        this.cancellable = cancellable;
        this.movementRequired = movementRequired;
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const touched = new StdState(this, "touched");
        const moved = new StdState(this, "moved");
        const released = new TerminalState(this, "released");
        const cancelled = new CancellingState(this, "cancelled");
        this.addState(touched);
        this.addState(moved);
        this.addState(released);
        this.addState(cancelled);
        const touchDownFn = (event) => {
            this.touchID = event.changedTouches[0].identifier;
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onTouch(event);
        };
        const fixTouchDownCheck = (event) => [...event.touches].filter(t => t.identifier === this.touchID).length === 0;
        const pressure = new TouchPressureTransition(this.initState, touched);
        pressure.action = touchDownFn;
        const fixBlockedEvent = new TouchPressureTransition(touched, touched);
        fixBlockedEvent.isGuardOK = fixTouchDownCheck;
        fixBlockedEvent.action = touchDownFn;
        if (this.movementRequired) {
            this.startingState = moved;
            const tap = new TouchReleaseTransition(touched, cancelled);
            tap.isGuardOK = (event) => event.changedTouches[0].identifier === this.touchID;
        }
        else {
            const releaseTouched = new TouchReleaseTransition(touched, released);
            releaseTouched.isGuardOK = (event) => event.changedTouches[0].identifier === this.touchID;
            releaseTouched.action = (event) => {
                dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onRelease(event);
            };
        }
        const firstMove = new TouchMoveTransition(touched, moved);
        firstMove.isGuardOK = (event) => event.changedTouches[0].identifier === this.touchID;
        firstMove.action = (event) => {
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onMove(event);
        };
        const move = new TouchMoveTransition(moved, moved);
        move.isGuardOK = (event) => event.changedTouches[0].identifier === this.touchID;
        move.action = (event) => {
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onMove(event);
        };
        const fixBlockedEvent2 = new TouchPressureTransition(moved, touched);
        fixBlockedEvent2.isGuardOK = fixTouchDownCheck;
        fixBlockedEvent2.action = touchDownFn;
        if (this.cancellable) {
            const release = new TouchReleaseTransition(moved, released);
            release.isGuardOK = (event) => {
                const tgt = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
                return event.changedTouches[0].identifier === this.touchID &&
                    (!(tgt instanceof Element) || !tgt.classList.contains("ioDwellSpring"));
            };
            release.action = (event) => {
                dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onRelease(event);
            };
            const releaseCancel = new TouchReleaseTransition(moved, cancelled);
            releaseCancel.isGuardOK = (event) => {
                const tgt = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
                return event.changedTouches[0].identifier === this.touchID && tgt instanceof Element && tgt.classList.contains("ioDwellSpring");
            };
        }
        else {
            const release = new TouchReleaseTransition(moved, released);
            release.isGuardOK = (event) => event.changedTouches[0].identifier === this.touchID;
            release.action = (event) => {
                dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onRelease(event);
            };
        }
        super.buildFSM(dataHandler);
    }
    getTouchId() {
        return this.touchID;
    }
    reinit() {
        super.reinit();
        this.touchID = undefined;
    }
}
class TouchDnD extends InteractionBase {
    constructor(cancellable, movementRequired = true, fsm) {
        super(fsm !== null && fsm !== void 0 ? fsm : new TouchDnDFSM(cancellable, movementRequired), new SrcTgtTouchDataImpl());
        this.handler = {
            "onTouch": (evt) => {
                const touch = evt.changedTouches[0];
                const all = [...evt.touches];
                this._data.copySrc(touch, evt, all);
                this._data.copyTgt(touch, evt, all);
            },
            "onMove": (evt) => {
                this.setTgtData(evt);
            },
            "onRelease": (evt) => {
                this.setTgtData(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
    setTgtData(evt) {
        const touch = getTouch(evt.changedTouches, this.data.src.identifier);
        if (touch !== undefined) {
            this._data.copyTgt(touch, evt, [...evt.touches]);
        }
    }
}

class MultiTouchDataImpl {
    constructor() {
        this.touchesData = new Map();
    }
    get touches() {
        return [...this.touchesData.values()];
    }
    addTouchData(data) {
        this.touchesData.set(data.src.identifier, data);
    }
    removeTouchData(id) {
        const tdata = this.touchesData.get(id);
        if (tdata !== undefined) {
            this.touchesData.delete(id);
            tdata.flush();
        }
    }
    flush() {
        this.touchesData.forEach(data => {
            data.flush();
        });
        this.touchesData.clear();
    }
    setTouch(tp, evt) {
        const tdata = this.touchesData.get(tp.identifier);
        if (tdata !== undefined) {
            tdata.copyTgt(tp, evt, [...evt.touches]);
        }
    }
    isHorizontal(pxTolerance) {
        let direction = 0;
        for (const touch of this.touchesData) {
            if (direction === 0) {
                direction = touch[1].diffScreenX / Math.abs(touch[1].diffScreenX);
            }
            if (!touch[1].isHorizontal(pxTolerance) || (touch[1].diffScreenX / Math.abs(touch[1].diffScreenX) !== direction)) {
                return false;
            }
        }
        return true;
    }
    isVertical(pxTolerance) {
        let direction = 0;
        for (const touch of this.touchesData) {
            if (direction === 0) {
                direction = touch[1].diffScreenY / Math.abs(touch[1].diffScreenY);
            }
            if (!touch[1].isVertical(pxTolerance) || (touch[1].diffScreenY / Math.abs(touch[1].diffScreenY) !== direction)) {
                return false;
            }
        }
        return true;
    }
    pinchFactor(pxTolerance) {
        if (this.touches.length !== 2) {
            return undefined;
        }
        const tgt1 = [this.touches[0].tgt.screenX, this.touches[0].tgt.screenY];
        const tgt2 = [this.touches[1].tgt.screenX, this.touches[1].tgt.screenY];
        const src1 = [this.touches[0].src.screenX, this.touches[0].src.screenY];
        const src2 = [this.touches[1].src.screenX, this.touches[1].src.screenY];
        const vector1 = [this.touches[0].diffScreenX, this.touches[0].diffScreenY];
        const vector2 = [this.touches[1].diffScreenX, this.touches[1].diffScreenY];
        const lineVector = [tgt2[0] - tgt1[0], tgt2[1] - tgt1[1]];
        const projection1 = MultiTouchDataImpl.project(vector1, lineVector);
        const projectionVector1 = [projection1 * lineVector[0], projection1 * lineVector[1]];
        const projection2 = MultiTouchDataImpl.project(vector2, lineVector);
        const projectionVector2 = [projection2 * lineVector[0], projection2 * lineVector[1]];
        if (projection1 / Math.abs(projection1) === projection2 / Math.abs(projection2)) {
            return undefined;
        }
        const distance1 = MultiTouchDataImpl.distance(projectionVector1, vector1);
        const distance2 = MultiTouchDataImpl.distance(projectionVector2, vector2);
        if (distance1 > pxTolerance || distance2 > pxTolerance) {
            return undefined;
        }
        return MultiTouchDataImpl.distance(tgt1, tgt2) / MultiTouchDataImpl.distance(src1, src2);
    }
    static project(vector1, vector2) {
        return (vector1[0] * vector2[0] + vector1[1] * vector2[1]) / (vector2[0] ** 2 + vector2[1] ** 2);
    }
    static distance(point1, point2) {
        return Math.sqrt((point2[0] - point1[0]) ** 2 + (point2[1] - point1[1]) ** 2);
    }
}

class MultiTouchFSM extends ConcurrentFSM {
    constructor(nbTouch, totalReinit) {
        super([...Array(nbTouch).keys()].map(_ => new TouchDnDFSM(false, false)), totalReinit ? [new TouchDnDFSM(false, false)] : [], totalReinit);
    }
    buildFSM(dataHandler) {
        super.buildFSM(dataHandler);
        this.getAllConccurFSMs().forEach(fsm => {
            fsm.buildFSM(dataHandler);
        });
    }
    process(event) {
        if (!(event instanceof TouchEvent)) {
            return false;
        }
        let processed = false;
        let res = false;
        if (event.type === "touchstart") {
            const ids = new Set([...event.touches].map(touch => touch.identifier));
            const losts = this.conccurFSMs.filter(fsm => {
                const id = fsm.getTouchId();
                return id !== undefined && !ids.has(id);
            });
            losts.forEach(lost => {
                lost.reinit();
            });
        }
        for (let i = 0; i < event.changedTouches.length; i++) {
            const touches = this.conccurFSMs
                .filter(fsm => fsm.getTouchId() === event.changedTouches[i].identifier);
            if (touches.length > 0) {
                processed = true;
                res = touches[0].process(event) || res;
            }
            else {
                const remainingFSMs = this.conccurFSMs.filter(fsm => fsm.getTouchId() === undefined);
                if (remainingFSMs.length === 0) {
                    this.onCancelling();
                    res = false;
                }
                else {
                    res = remainingFSMs[0].process(event) || res;
                }
            }
        }
        return processed && res;
    }
}
class MultiTouch extends ConcurrentInteraction {
    constructor(nbTouches, strict) {
        super(new MultiTouchFSM(nbTouches, strict), new MultiTouchDataImpl());
        this.handler = {
            "onTouch": (event) => {
                for (let i = 0; i < event.changedTouches.length; i++) {
                    const data = new SrcTgtTouchDataImpl();
                    const all = [...event.touches];
                    data.copySrc(event.changedTouches[i], event, all);
                    data.copyTgt(event.changedTouches[i], event, all);
                    this._data.addTouchData(data);
                }
            },
            "onMove": (event) => {
                for (let i = 0; i < event.changedTouches.length; i++) {
                    this._data.setTouch(event.changedTouches[i], event);
                }
            },
            "onRelease": (event) => {
                for (let i = 0; i < event.changedTouches.length; i++) {
                    this._data.setTouch(event.changedTouches[i], event);
                }
            },
            "reinitData": () => {
                const currentIDs = this.fsm.conccurFSMs
                    .filter(fsm => fsm.started)
                    .map(fsm => fsm.getTouchId());
                this.data
                    .touches
                    .filter(data => !currentIDs.includes(data.src.identifier))
                    .forEach(data => {
                    this.data.removeTouchData(data.src.identifier);
                });
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}

class TapDataImpl {
    constructor() {
        this.tapsData = [];
    }
    get taps() {
        return [...this.tapsData];
    }
    addTapData(data) {
        this.tapsData.push(data);
    }
    flush() {
        this.tapsData.length = 0;
    }
}

class TapFSM extends FSMImpl {
    constructor(nbTaps) {
        super();
        this.nbTaps = nbTaps;
        this.countTaps = 0;
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const down = new StdState(this, "down");
        const up = new StdState(this, "up");
        const ended = new TerminalState(this, "ended");
        const cancelled = new CancellingState(this, "cancelled");
        this.addState(down);
        this.addState(up);
        this.addState(ended);
        this.addState(cancelled);
        const pressureAction = (event) => {
            this.touchID = event.changedTouches[0].identifier;
            this.countTaps++;
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.tap(event);
        };
        const press1 = new TouchPressureTransition(this.initState, down);
        press1.action = pressureAction;
        const move = new TouchMoveTransition(down, cancelled);
        move.isGuardOK = (event) => event.changedTouches[0].identifier === this.touchID;
        const noMulti = new TouchPressureTransition(down, cancelled);
        noMulti.isGuardOK = (event) => [...event.touches].filter(t => t.identifier === this.touchID).length > 0;
        const cleanEvent = new TouchPressureTransition(down, down);
        cleanEvent.isGuardOK = (event) => [...event.touches].filter(t => t.identifier === this.touchID).length === 0;
        cleanEvent.action = (event) => {
            this.touchID = event.changedTouches[0].identifier;
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.tap(event);
        };
        const release = new TouchReleaseTransition(down, ended);
        release.isGuardOK = (event) => event.changedTouches[0].identifier === this.touchID && this.nbTaps === this.countTaps;
        const release2 = new TouchReleaseTransition(down, up);
        release2.isGuardOK = (event) => event.changedTouches[0].identifier === this.touchID && this.nbTaps !== this.countTaps;
        const press2 = new TouchPressureTransition(up, down);
        press2.action = pressureAction;
        new TouchMoveTransition(up, cancelled);
        new TimeoutTransition(down, cancelled, () => 1000);
        new TimeoutTransition(up, cancelled, () => 1000);
    }
    reinit() {
        super.reinit();
        this.countTaps = 0;
    }
}
class Tap extends InteractionBase {
    constructor(numberTaps) {
        super(new TapFSM(numberTaps), new TapDataImpl());
        this.handler = {
            "tap": (evt) => {
                if (evt.changedTouches.length > 0) {
                    const touch = new TouchDataImpl();
                    touch.copy(TouchDataImpl.mergeTouchEventData(evt.changedTouches[0], evt, [...evt.touches]));
                    this._data.addTapData(touch);
                }
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}

class LongTouchFSM extends FSMImpl {
    constructor(duration) {
        super();
        if (duration <= 0) {
            throw new Error("Incorrect duration");
        }
        this.duration = duration;
        this.currentTouchID = undefined;
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        const touched = new StdState(this, "touched");
        const cancelled = new CancellingState(this, "cancelled");
        const timeouted = new TerminalState(this, "timeouted");
        this.addState(touched);
        this.addState(cancelled);
        this.addState(timeouted);
        const press = new TouchPressureTransition(this.initState, touched);
        press.action = (event) => {
            this.currentTouchID = event.changedTouches[0].identifier;
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.tap(event);
        };
        const moved = new TouchMoveTransition(touched, cancelled);
        moved.isGuardOK = (event) => event.changedTouches[0].identifier === this.currentTouchID;
        const release = new TouchReleaseTransition(touched, cancelled);
        release.isGuardOK = (event) => event.changedTouches[0].identifier === this.currentTouchID;
        new TimeoutTransition(touched, timeouted, () => this.duration);
        super.buildFSM(dataHandler);
    }
    reinit() {
        super.reinit();
        this.currentTouchID = undefined;
    }
}
class LongTouch extends InteractionBase {
    constructor(duration) {
        super(new LongTouchFSM(duration), new TouchDataImpl());
        this.handler = {
            "tap": (evt) => {
                if (evt.changedTouches.length > 0) {
                    this._data.copy(TouchDataImpl.mergeTouchEventData(evt.changedTouches[0], evt, [...evt.touches]));
                }
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}

class ClickTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(event) {
        return event instanceof MouseEvent && isEventType(event.type) && this.getAcceptedEvents().includes(event.type);
    }
    getAcceptedEvents() {
        return ["click", "auxclick"];
    }
}

class PointDataImpl extends PointingDataBase {
    constructor() {
        super(...arguments);
        this.buttonData = 0;
        this.buttonsData = 0;
        this.movementXData = 0;
        this.movementYData = 0;
        this.offsetXData = 0;
        this.offsetYData = 0;
        this.relatedTargetData = null;
    }
    flush() {
        super.flush();
        this.buttonData = 0;
        this.buttonsData = 0;
        this.movementXData = 0;
        this.movementYData = 0;
        this.offsetXData = 0;
        this.offsetYData = 0;
        this.relatedTargetData = null;
    }
    copy(data) {
        super.copy(data);
        this.buttonData = data.button;
        this.buttonsData = data.buttons;
        this.movementXData = data.movementX;
        this.movementYData = data.movementY;
        this.offsetXData = data.offsetX;
        this.offsetYData = data.offsetY;
        this.relatedTargetData = data.relatedTarget;
    }
    get button() {
        return this.buttonData;
    }
    get buttons() {
        return this.buttonsData;
    }
    get movementX() {
        return this.movementXData;
    }
    get movementY() {
        return this.movementYData;
    }
    get offsetX() {
        return this.offsetXData;
    }
    get offsetY() {
        return this.offsetYData;
    }
    get relatedTarget() {
        return this.relatedTargetData;
    }
}

class ClickFSM extends FSMImpl {
    constructor() {
        super();
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const clicked = new TerminalState(this, "clicked");
        this.addState(clicked);
        const clickt = new ClickTransition(this.initState, clicked);
        clickt.action = (event) => {
            this.setCheckButton(event.button);
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.initToClicked(event);
        };
        clickt.isGuardOK = (event) => this.checkButton === undefined || event.button === this.checkButton;
    }
    getCheckButton() {
        var _a;
        return (_a = this.checkButton) !== null && _a !== void 0 ? _a : -1;
    }
    setCheckButton(buttonToCheck) {
        if (this.checkButton === undefined) {
            this.checkButton = buttonToCheck;
        }
    }
    reinit() {
        super.reinit();
        this.checkButton = undefined;
    }
}
class Click extends InteractionBase {
    constructor(fsm, data) {
        super(fsm !== null && fsm !== void 0 ? fsm : new ClickFSM(), data !== null && data !== void 0 ? data : new PointDataImpl());
        this.handler = {
            "initToClicked": (evt) => {
                this._data.copy(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}

class MouseDownTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(event) {
        return isMouseDownEvent(event);
    }
    getAcceptedEvents() {
        return ["mousedown"];
    }
}

class MouseDownFSM extends FSMImpl {
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const pressed = new TerminalState(this, "pressed");
        this.addState(pressed);
        const pressure = new MouseDownTransition(this.initState, pressed);
        pressure.action = (event) => {
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.initToPress(event);
        };
    }
}
class MouseDown extends InteractionBase {
    constructor() {
        super(new MouseDownFSM(), new PointDataImpl());
        this.handler = {
            "initToPress": (evt) => {
                this._data.copy(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}

class KeyDownTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(event) {
        return isKeyDownEvent(event);
    }
    getAcceptedEvents() {
        return ["keydown"];
    }
}

class EscapeKeyPressureTransition extends KeyDownTransition {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    isGuardOK(event) {
        return event.code === "Escape" || event.code === String(KeyCode.escape);
    }
}

class MouseUpTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(event) {
        return event instanceof MouseEvent && isEventType(event.type) && this.getAcceptedEvents().includes(event.type);
    }
    getAcceptedEvents() {
        return ["mouseup"];
    }
}

class SrcTgtPointsDataImpl {
    constructor() {
        this.srcData = new PointDataImpl();
        this.tgtData = new PointDataImpl();
    }
    get src() {
        return this.srcData;
    }
    get tgt() {
        return this.tgtData;
    }
    flush() {
        this.srcData.flush();
        this.tgtData.flush();
    }
    copySrc(data) {
        this.srcData.copy(data);
    }
    copyTgt(data) {
        this.tgtData.copy(data);
    }
    get diffClientX() {
        return this.tgt.clientX - this.src.clientX;
    }
    get diffClientY() {
        return this.tgt.clientY - this.src.clientY;
    }
    get diffPageX() {
        return this.tgt.pageX - this.src.pageX;
    }
    get diffPageY() {
        return this.tgt.pageY - this.src.pageY;
    }
    get diffScreenX() {
        return this.tgt.screenX - this.src.screenX;
    }
    get diffScreenY() {
        return this.tgt.screenY - this.src.screenY;
    }
    get duration() {
        return this.tgtData.timeStamp - this.srcData.timeStamp;
    }
    get velocity() {
        return Math.sqrt(this.diffScreenX ** 2 + this.diffScreenY ** 2) / this.duration;
    }
    isHorizontal(pxTolerance) {
        return Math.abs(this.diffScreenY) < pxTolerance;
    }
    isVertical(pxTolerance) {
        return Math.abs(this.diffScreenX) < pxTolerance;
    }
}

class MouseMoveTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(event) {
        return event instanceof MouseEvent && isEventType(event.type) && this.getAcceptedEvents().includes(event.type);
    }
    getAcceptedEvents() {
        return ["mousemove"];
    }
}

class DnDFSM extends FSMImpl {
    constructor(cancellable) {
        super();
        this.cancellable = cancellable;
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const pressed = new StdState(this, "pressed");
        const dragged = new StdState(this, "dragged");
        const released = new TerminalState(this, "released");
        const cancelled = new CancellingState(this, "cancelled");
        this.addState(pressed);
        this.addState(dragged);
        this.addState(released);
        this.addState(cancelled);
        this.startingState = dragged;
        const press = new MouseDownTransition(this.initState, pressed);
        press.action = (event) => {
            this.buttonToCheck = event.button;
            dataHandler.onPress(event);
        };
        const relCancel = new MouseUpTransition(pressed, cancelled);
        relCancel.isGuardOK = (event) => event.button === this.buttonToCheck;
        const guardMove = (event) => event.button === this.buttonToCheck;
        const actionMove = (event) => {
            dataHandler.onDrag(event);
        };
        const move = new MouseMoveTransition(pressed, dragged);
        move.isGuardOK = guardMove;
        move.action = actionMove;
        const moveDrag = new MouseMoveTransition(dragged, dragged);
        moveDrag.isGuardOK = guardMove;
        moveDrag.action = actionMove;
        const release = new MouseUpTransition(dragged, released);
        release.isGuardOK = (event) => {
            const tgt = event.currentTarget;
            return event.button === this.buttonToCheck && (!(tgt instanceof Element) || !tgt.classList.contains("ioDwellSpring"));
        };
        release.action = (event) => {
            dataHandler.onRelease(event);
        };
        this.configureCancellation(pressed, dragged, cancelled);
    }
    configureCancellation(pressed, dragged, cancelled) {
        if (this.cancellable) {
            new EscapeKeyPressureTransition(pressed, cancelled);
            new EscapeKeyPressureTransition(dragged, cancelled);
            const releaseCancel = new MouseUpTransition(dragged, cancelled);
            releaseCancel.isGuardOK = (event) => {
                const tgt = event.currentTarget;
                return event.button === this.buttonToCheck && tgt instanceof Element && tgt.classList.contains("ioDwellSpring");
            };
        }
    }
    reinit() {
        super.reinit();
        this.buttonToCheck = undefined;
    }
}
class DnD extends InteractionBase {
    constructor(cancellable) {
        super(new DnDFSM(cancellable), new SrcTgtPointsDataImpl());
        this.handler = {
            "onPress": (evt) => {
                this._data.copySrc(evt);
                this._data.copyTgt(evt);
            },
            "onDrag": (evt) => {
                this._data.copyTgt(evt);
            },
            "onRelease": (evt) => {
                this._data.copyTgt(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}

class SubFSMTransition extends TransitionBase {
    constructor(srcState, tgtState, fsm) {
        super(srcState, tgtState);
        this.subFSM = fsm;
        this.subFSM.inner = true;
        this.subFSMHandler = {
            "fsmStarts": () => {
                this.src.exit();
            },
            "fsmUpdates": () => {
                this.src.fsm.onUpdating();
            },
            "fsmStops": () => {
                this.action(undefined);
                this.unsetFSMHandler();
                if (this.tgt instanceof TerminalState) {
                    this.tgt.enter();
                    return;
                }
                if (this.tgt instanceof CancellingState) {
                    this.cancelsFSM();
                    return;
                }
                if (isOutputStateType(this.tgt)) {
                    this.src.fsm.currentState = this.tgt;
                    this.tgt.enter();
                }
            },
            "fsmCancels": () => {
                this.cancelsFSM();
            },
            "fsmError": (err) => {
                this.src.fsm.onError(err);
            }
        };
    }
    setUpFSMHandler() {
        this.subFSM.addHandler(this.subFSMHandler);
        this.src.fsm.currentSubFSM = this.subFSM;
        this.subStateSubscription = this.subFSM.currentStateObservable
            .subscribe(value => {
            this.src.fsm.currentState = value[1];
        });
    }
    unsetFSMHandler() {
        var _a;
        this.subFSM.removeHandler(this.subFSMHandler);
        this.src.fsm.currentSubFSM = undefined;
        (_a = this.subStateSubscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
    cancelsFSM() {
        this.unsetFSMHandler();
        this.src.fsm.onCancelling();
    }
    execute(event) {
        const transition = this.findTransition(event);
        if (transition === undefined) {
            return undefined;
        }
        this.src.fsm.stopCurrentTimeout();
        this.setUpFSMHandler();
        this.subFSM.process(event);
        return transition.target;
    }
    accept(event) {
        return this.findTransition(event) !== undefined;
    }
    isGuardOK(event) {
        var _a, _b;
        return (_b = (_a = this.findTransition(event)) === null || _a === void 0 ? void 0 : _a.isGuardOK(event)) !== null && _b !== void 0 ? _b : false;
    }
    findTransition(event) {
        return this.subFSM
            .initState
            .transitions
            .find(tr => tr.accept(event));
    }
    getAcceptedEvents() {
        if (this.subFSM.initState.transitions.length === 0) {
            return [];
        }
        return this.subFSM.initState
            .transitions
            .map(tr => tr.getAcceptedEvents())
            .reduce((a, b) => [...a, ...b]);
    }
    uninstall() {
        this.unsetFSMHandler();
        this.subFSM.uninstall();
    }
}

class DoubleClickFSM extends FSMImpl {
    constructor() {
        super();
        this.firstClickFSM = new ClickFSM();
        this.sndClickFSM = new ClickFSM();
    }
    static getTimeGap() {
        return DoubleClickFSM.timeGap;
    }
    static setTimeGap(timeGapBetweenClicks) {
        if (timeGapBetweenClicks > 0) {
            DoubleClickFSM.timeGap = timeGapBetweenClicks;
        }
    }
    set log(log) {
        super.log = log;
        this.firstClickFSM.log = log;
        this.sndClickFSM.log = log;
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        this.firstClickFSM.buildFSM();
        this.sndClickFSM.buildFSM();
        const errorHandler = {
            "fsmError": (err) => {
                this.notifyHandlerOnError(err);
            }
        };
        this.firstClickFSM.addHandler(errorHandler);
        this.sndClickFSM.addHandler(errorHandler);
        const dbleclicked = new TerminalState(this, "dbleclicked");
        const cancelled = new CancellingState(this, "cancelled");
        const clicked = new StdState(this, "clicked");
        this.addState(clicked);
        this.addState(dbleclicked);
        this.addState(cancelled);
        this.startingState = dbleclicked;
        const firstClick = new SubFSMTransition(this.initState, clicked, this.firstClickFSM);
        firstClick.action = () => {
            this.setCheckButton(this.firstClickFSM.getCheckButton());
        };
        const move = new MouseMoveTransition(clicked, cancelled);
        move.isGuardOK = (event) => (this.checkButton === undefined || event instanceof MouseEvent &&
            event.button === this.checkButton);
        new TimeoutTransition(clicked, cancelled, DoubleClickFSM.timeGapSupplier);
        new SubFSMTransition(clicked, dbleclicked, this.sndClickFSM);
    }
    setCheckButton(buttonToCheck) {
        if (this.checkButton === undefined) {
            this.checkButton = buttonToCheck;
        }
        this.sndClickFSM.setCheckButton(buttonToCheck);
    }
    getCheckButton() {
        var _a;
        return (_a = this.checkButton) !== null && _a !== void 0 ? _a : -1;
    }
    fullReinit() {
        super.fullReinit();
        this.firstClickFSM.fullReinit();
        this.sndClickFSM.fullReinit();
    }
    reinit() {
        super.reinit();
        this.firstClickFSM.reinit();
        this.sndClickFSM.reinit();
        this.checkButton = undefined;
    }
}
DoubleClickFSM.timeGap = 300;
DoubleClickFSM.timeGapSupplier = () => DoubleClickFSM.getTimeGap();
class DoubleClick extends InteractionBase {
    constructor(fsm, data) {
        super(fsm !== null && fsm !== void 0 ? fsm : new DoubleClickFSM(), data !== null && data !== void 0 ? data : new PointDataImpl());
        new Click(this.fsm.firstClickFSM, this._data);
        this.fsm.buildFSM(this);
    }
}

class DragLockFSM extends FSMImpl {
    constructor() {
        super();
        this.firstDbleClick = new DoubleClickFSM();
        this.sndDbleClick = new DoubleClickFSM();
    }
    set log(log) {
        super.log = log;
        this.firstDbleClick.log = log;
        this.sndDbleClick.log = log;
    }
    reinit() {
        super.reinit();
        this.firstDbleClick.reinit();
        this.sndDbleClick.reinit();
        this.checkButton = undefined;
    }
    fullReinit() {
        super.fullReinit();
        this.firstDbleClick.fullReinit();
        this.sndDbleClick.fullReinit();
    }
    getDataHandler() {
        return this.dataHandler;
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const cancelDbleClick = new DoubleClickFSM();
        const errorHandler = {
            "fsmError": (err) => {
                this.notifyHandlerOnError(err);
            }
        };
        this.firstDbleClick.buildFSM();
        this.sndDbleClick.buildFSM();
        cancelDbleClick.buildFSM();
        this.firstDbleClick.addHandler(errorHandler);
        this.sndDbleClick.addHandler(errorHandler);
        cancelDbleClick.addHandler(errorHandler);
        const dropped = new TerminalState(this, "dropped");
        const cancelled = new CancellingState(this, "cancelled");
        const locked = new StdState(this, "locked");
        const moved = new StdState(this, "moved");
        this.addState(dropped);
        this.addState(cancelled);
        this.addState(locked);
        this.addState(moved);
        const subTr = new SubFSMTransition(this.initState, locked, this.firstDbleClick);
        subTr.action = () => {
            const checkButton = this.firstDbleClick.getCheckButton();
            this.sndDbleClick.setCheckButton(checkButton);
            cancelDbleClick.setCheckButton(checkButton);
            dataHandler.onFirstDbleClick();
        };
        new SubFSMTransition(locked, cancelled, cancelDbleClick);
        const moveAction = (event) => {
            var _a;
            (_a = this.getDataHandler()) === null || _a === void 0 ? void 0 : _a.onMove(event);
        };
        const movelock = new MouseMoveTransition(locked, moved);
        movelock.action = moveAction;
        const move = new MouseMoveTransition(moved, moved);
        move.action = moveAction;
        new EscapeKeyPressureTransition(locked, cancelled);
        new EscapeKeyPressureTransition(moved, cancelled);
        new SubFSMTransition(moved, dropped, this.sndDbleClick);
    }
}
class DragLock extends InteractionBase {
    constructor() {
        super(new DragLockFSM(), new SrcTgtPointsDataImpl());
        const handler = {
            "onMove": (evt) => {
                this.data.tgt.copy(evt);
            },
            "onFirstDbleClick": () => {
                this.data.tgt.copy(this.data.src);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        new DoubleClick(this.fsm.firstDbleClick, this.data.src);
        new DoubleClick(this.fsm.sndDbleClick, this.data.tgt);
        this.fsm.buildFSM(handler);
    }
}

class HyperLinkTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(event) {
        return event.currentTarget !== null && isHyperLink(event.currentTarget);
    }
    getAcceptedEvents() {
        return ["click", "auxclick"];
    }
}

class HyperLinkClickedFSM extends FSMImpl {
    constructor() {
        super();
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const clicked = new TerminalState(this, "clicked");
        this.addState(clicked);
        const tr = new HyperLinkTransition(this.initState, clicked);
        tr.action = (event) => {
            dataHandler.initToClickedHandler(event);
        };
    }
}
class HyperLinkClicked extends InteractionBase {
    constructor() {
        super(new HyperLinkClickedFSM(), new WidgetDataImpl());
        this.handler = {
            "initToClickedHandler": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
    onNewNodeRegistered(node) {
        if (isHyperLink(node)) {
            this.registerActionHandlerInput(node);
        }
    }
    onNodeUnregistered(node) {
        if (isHyperLink(node)) {
            this.unregisterActionHandlerInput(node);
        }
    }
}

class KeyDownFSM extends FSMImpl {
    constructor(modifierAccepted) {
        super();
        this.modifiersAccepted = modifierAccepted;
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const pressed = new TerminalState(this, "pressed");
        this.addState(pressed);
        const kp = new KeyDownTransition(this.initState, pressed);
        kp.action = (event) => {
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onKeyPressed(event);
        };
        kp.isGuardOK = (event) => this.modifiersAccepted ||
            (!event.altKey && !event.ctrlKey && !event.shiftKey && !event.metaKey);
    }
    reinit() {
        super.reinit();
    }
}
class KeyDown extends InteractionBase {
    constructor(modifierAccepted, fsm) {
        super(fsm !== null && fsm !== void 0 ? fsm : new KeyDownFSM(modifierAccepted), new KeyDataImpl());
        this.handler = {
            "onKeyPressed": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}

class KeyUpTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(event) {
        return isKeyUpEvent(event);
    }
    getAcceptedEvents() {
        return ["keyup"];
    }
}

class KeysDownFSM extends FSMImpl {
    constructor() {
        super();
        this.currentCodes = [];
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const pressed = new StdState(this, "pressed");
        const ended = new TerminalState(this, "ended");
        this.addState(pressed);
        this.addState(ended);
        const actionkp = (event) => {
            this.currentCodes.push(event.code);
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onKeyPressed(event);
        };
        const kpInit = new KeyDownTransition(this.initState, pressed);
        kpInit.action = actionkp;
        const kpPressed = new KeyDownTransition(pressed, pressed);
        kpPressed.action = actionkp;
        const kr = new KeyUpTransition(pressed, ended);
        kr.isGuardOK = (event) => this.currentCodes.find(value => value === event.code) !== undefined;
    }
    reinit() {
        this.currentCodes.length = 0;
        super.reinit();
    }
}
class KeysDown extends InteractionBase {
    constructor() {
        super(new KeysDownFSM(), new KeysDataImpl());
        this.handler = {
            "onKeyPressed": (event) => {
                this._data.addKey(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}

class KeysTypedFSM extends FSMImpl {
    constructor() {
        super();
    }
    static getTimeGap() {
        return KeysTypedFSM.timeGap;
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const keyup = new StdState(this, "keyup");
        const timeouted = new TerminalState(this, "timeouted");
        this.addState(keyup);
        this.addState(timeouted);
        const action = (event) => {
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onKeyTyped(event);
        };
        const keyupInit = new KeyUpTransition(this.initState, keyup);
        const keyupSeq = new KeyUpTransition(keyup, keyup);
        keyupInit.action = action;
        keyupSeq.action = action;
        new TimeoutTransition(keyup, timeouted, KeysTypedFSM.timeGapSupplier);
    }
}
KeysTypedFSM.timeGap = 1000;
KeysTypedFSM.timeGapSupplier = () => KeysTypedFSM.getTimeGap();
class KeysTyped extends InteractionBase {
    constructor(logger) {
        super(new KeysTypedFSM(), new KeysDataImpl(), logger);
        const handler = {
            "onKeyTyped": (event) => {
                this._data.addKey(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(handler);
    }
}

class KeyTypedFSM extends FSMImpl {
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const pressed = new StdState(this, "pressed");
        const typed = new TerminalState(this, "typed");
        this.startingState = typed;
        this.addState(pressed);
        this.addState(typed);
        const kp = new KeyDownTransition(this.initState, pressed);
        kp.action = (event) => {
            this.checkKey = event.code;
        };
        const kr = new KeyUpTransition(pressed, typed);
        kr.isGuardOK = (event) => this.checkKey === undefined || event.code === this.checkKey;
        kr.action = (event) => {
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onKeyTyped(event);
        };
    }
    reinit() {
        super.reinit();
        this.checkKey = undefined;
    }
}
class KeyTyped extends InteractionBase {
    constructor() {
        super(new KeyTypedFSM(), new KeyDataImpl());
        this.handler = {
            "onKeyTyped": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}

class ScrollTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(event) {
        return isScrollEvent(event);
    }
    getAcceptedEvents() {
        return ["scroll"];
    }
}

class ScrollDataImpl extends InteractionDataBase {
    constructor() {
        super(...arguments);
        this.scrollXData = 0;
        this.scrollYData = 0;
    }
    flush() {
        super.flush();
        this.scrollXData = 0;
        this.scrollYData = 0;
    }
    get scrollX() {
        return this.scrollXData;
    }
    get scrollY() {
        return this.scrollYData;
    }
    setScrollData(event) {
        super.copy(event);
        this.scrollXData = window.scrollX;
        this.scrollYData = window.scrollY;
    }
}

class ScrollFSM extends FSMImpl {
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const scrolled = new TerminalState(this, "scrolled");
        this.addState(scrolled);
        const scroll = new ScrollTransition(this.initState, scrolled);
        scroll.action = (event) => {
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.initToScroll(event);
        };
    }
}
class Scroll extends InteractionBase {
    constructor() {
        super(new ScrollFSM(), new ScrollDataImpl());
        this.handler = {
            "initToScroll": (event) => {
                this._data.setScrollData(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}

class LongMouseDownFSM extends FSMImpl {
    constructor(duration) {
        super();
        if (duration <= 0) {
            throw new Error("Incorrect duration");
        }
        this.duration = duration;
        this.currentButton = undefined;
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const down = new StdState(this, "down");
        const cancelled = new CancellingState(this, "cancelled");
        const timeouted = new TerminalState(this, "timeouted");
        this.addState(down);
        this.addState(cancelled);
        this.addState(timeouted);
        const press = new MouseDownTransition(this.initState, down);
        press.action = (event) => {
            this.currentButton = event.button;
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.press(event);
        };
        const guard = (event) => event.button === this.currentButton;
        const moved = new MouseMoveTransition(down, cancelled);
        moved.isGuardOK = guard;
        const release = new MouseUpTransition(down, cancelled);
        release.isGuardOK = guard;
        new TimeoutTransition(down, timeouted, () => this.duration);
    }
    reinit() {
        super.reinit();
        this.currentButton = undefined;
    }
}
class LongMouseDown extends InteractionBase {
    constructor(duration) {
        super(new LongMouseDownFSM(duration), new PointDataImpl());
        this.handler = {
            "press": (evt) => {
                this._data.copy(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}

class PointsDataImpl {
    constructor() {
        this.pointsData = [];
    }
    get points() {
        return [...this.pointsData];
    }
    get currentPosition() {
        return this.currentPositionData;
    }
    set currentPosition(position) {
        this.currentPositionData = position;
    }
    get lastButton() {
        var _a;
        return (_a = peek(this.pointsData)) === null || _a === void 0 ? void 0 : _a.button;
    }
    addPoint(ptData) {
        this.pointsData.push(ptData);
    }
    flush() {
        this.pointsData.length = 0;
        this.currentPositionData = undefined;
    }
}

class ClicksFSM extends FSMImpl {
    constructor(nbClicks) {
        super();
        if (nbClicks <= 0) {
            throw new Error("The number of clicks must be greater than 1");
        }
        if (nbClicks === 1) {
            throw new Error("For a number of clicks that equals 1, use the Click interaction");
        }
        this.countClicks = 0;
        this.nbClicks = nbClicks;
    }
    reinit() {
        super.reinit();
        this.countClicks = 0;
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const clicked = new StdState(this, "clicked");
        const ended = new TerminalState(this, "ended");
        const timeouted = new CancellingState(this, "timeouted");
        this.addState(clicked);
        this.addState(ended);
        this.addState(timeouted);
        const firstclick = new ClickTransition(this.initState, clicked);
        firstclick.action = (event) => {
            this.countClicks++;
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.click(event);
        };
        const newclick = new ClickTransition(clicked, clicked);
        newclick.action = (event) => {
            this.countClicks++;
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.click(event);
        };
        newclick.isGuardOK = (_event) => (this.countClicks + 1) < this.nbClicks;
        const finalclick = new ClickTransition(clicked, ended);
        finalclick.action = (event) => {
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.click(event);
        };
        finalclick.isGuardOK = (_event) => (this.countClicks + 1) === this.nbClicks;
        new TimeoutTransition(clicked, timeouted, () => 1000);
    }
}
class Clicks extends InteractionBase {
    constructor(numberClicks) {
        super(new ClicksFSM(numberClicks), new PointsDataImpl());
        this.handler = {
            "click": (evt) => {
                const pt = new PointDataImpl();
                pt.copy(evt);
                this._data.addPoint(pt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}

class MouseOutTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(event) {
        return event instanceof MouseEvent && isEventType(event.type) && this.getAcceptedEvents().includes(event.type);
    }
    getAcceptedEvents() {
        return ["mouseout"];
    }
}

class MouseLeaveTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(event) {
        return event instanceof MouseEvent && isEventType(event.type) && this.getAcceptedEvents().includes(event.type);
    }
    getAcceptedEvents() {
        return ["mouseleave"];
    }
}

class MouseLeaveFSM extends FSMImpl {
    constructor(withBubbling) {
        super();
        this.withBubbling = withBubbling;
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const exited = new TerminalState(this, "exited");
        this.addState(exited);
        let exit;
        if (this.withBubbling) {
            exit = new MouseOutTransition(this.initState, exited);
        }
        else {
            exit = new MouseLeaveTransition(this.initState, exited);
        }
        exit.action = (event) => {
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onExit(event);
        };
    }
}
class MouseLeave extends InteractionBase {
    constructor(withBubbling) {
        super(new MouseLeaveFSM(withBubbling), new PointDataImpl());
        this.handler = {
            "onExit": (evt) => {
                this._data.copy(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}

class MouseOverTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(event) {
        return event instanceof MouseEvent && isEventType(event.type) && this.getAcceptedEvents().includes(event.type);
    }
    getAcceptedEvents() {
        return ["mouseover"];
    }
}

class MouseEnterTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(event) {
        return event instanceof MouseEvent && isEventType(event.type) && this.getAcceptedEvents().includes(event.type);
    }
    getAcceptedEvents() {
        return ["mouseenter"];
    }
}

class MouseEnterFSM extends FSMImpl {
    constructor(withBubbling) {
        super();
        this.withBubbling = withBubbling;
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const entered = new TerminalState(this, "entered");
        this.addState(entered);
        let enter;
        if (this.withBubbling) {
            enter = new MouseOverTransition(this.initState, entered);
        }
        else {
            enter = new MouseEnterTransition(this.initState, entered);
        }
        enter.action = (event) => {
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onEnter(event);
        };
    }
}
class MouseEnter extends InteractionBase {
    constructor(withBubbling) {
        super(new MouseEnterFSM(withBubbling), new PointDataImpl());
        this.handler = {
            "onEnter": (evt) => {
                this._data.copy(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}

class MouseMoveFSM extends FSMImpl {
    constructor() {
        super();
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const moved = new TerminalState(this, "moved");
        this.addState(moved);
        const move = new MouseMoveTransition(this.initState, moved);
        move.action = (event) => {
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onMove(event);
        };
    }
}
class MouseMove extends InteractionBase {
    constructor() {
        super(new MouseMoveFSM(), new PointDataImpl());
        this.handler = {
            "onMove": (evt) => {
                this._data.copy(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}

class Undo extends CommandBase {
    constructor(undoHistory) {
        super();
        this.history = undoHistory;
    }
    canExecute() {
        return this.history.getLastUndo() !== undefined;
    }
    execution() {
        this.history.undo();
    }
}

class Redo extends CommandBase {
    constructor(undoHistory) {
        super();
        this.history = undoHistory;
    }
    canExecute() {
        return this.history.getLastRedo() !== undefined;
    }
    execution() {
        this.history.redo();
    }
}

class LoggingData {
    constructor(date, msg, level, name, type, sessionID, stack, frontVersion) {
        this.date = date;
        this.msg = msg;
        this.level = level;
        this.name = name;
        this.type = type;
        this.sessionID = sessionID;
        this.stack = stack;
        this.frontVersion = frontVersion;
    }
    toString() {
        const withstack = this.stack === undefined ? "" : `, ${this.stack}`;
        const withversion = this.frontVersion === undefined ? "" : ` ${this.frontVersion}`;
        return `${this.type}${withversion} [${this.sessionID}] [${this.level}:${this.name}] at ${this.date}: '${this.msg}'${withstack}`;
    }
}
class UsageLog {
    constructor(name, sessionID, date, frontVersion) {
        this.name = name;
        this.sessionID = sessionID;
        this.date = date;
        this.frontVersion = frontVersion;
        this.duration = 0;
        this.cancelled = false;
    }
    toString() {
        const withversion = this.frontVersion === undefined ? "" : ` v:${this.frontVersion}`;
        return `Usage.${withversion} id:${this.sessionID} binding:${this.name} ` +
            `date:${this.date} duration:${this.duration} cancelled:${String(this.cancelled)}`;
    }
}
class LoggerImpl {
    constructor(version) {
        this.frontVersion = version;
        this.ongoingBindings = [];
        this.serverAddress = undefined;
        this.writeConsole = true;
        this.sessionID = Date.now().toString(36) + Math.random().toString(36)
            .substr(2, 6);
    }
    processLoggingData(data) {
        if (this.writeConsole) {
            console.log(data.toString());
        }
        if (this.serverAddress !== undefined && data.type === "ERR") {
            const rq = new XMLHttpRequest();
            rq.open("POST", `${this.serverAddress}/api/err`, true);
            rq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            rq.send(JSON.stringify(data));
        }
    }
    formatError(ex) {
        var _a;
        if (ex instanceof Error) {
            return `${ex.message} ${(_a = ex.stack) !== null && _a !== void 0 ? _a : ""}`;
        }
        return String(ex);
    }
    logBindingErr(msg, ex, bindingName = "") {
        this.processLoggingData(new LoggingData(performance.now(), msg, "binding", bindingName, "ERR", this.sessionID, this.formatError(ex), this.frontVersion));
    }
    logBindingMsg(msg, bindingName = "") {
        this.processLoggingData(new LoggingData(performance.now(), msg, "binding", bindingName, "INFO", this.sessionID, undefined, this.frontVersion));
    }
    logCmdErr(msg, ex, cmdName = "") {
        this.processLoggingData(new LoggingData(performance.now(), msg, "command", cmdName, "ERR", this.sessionID, this.formatError(ex), this.frontVersion));
    }
    logCmdMsg(msg, cmdName = "") {
        this.processLoggingData(new LoggingData(performance.now(), msg, "command", cmdName, "INFO", this.sessionID, undefined, this.frontVersion));
    }
    logInteractionErr(msg, ex, interactionName = "") {
        this.processLoggingData(new LoggingData(performance.now(), msg, "interaction", interactionName, "ERR", this.sessionID, this.formatError(ex), this.frontVersion));
    }
    logInteractionMsg(msg, interactionName = "") {
        this.processLoggingData(new LoggingData(performance.now(), msg, "interaction", interactionName, "INFO", this.sessionID, undefined, this.frontVersion));
    }
    logBindingStart(bindingName) {
        this.ongoingBindings.push(new UsageLog(bindingName, this.sessionID, performance.now(), this.frontVersion));
    }
    logBindingEnd(bindingName, cancelled) {
        const logs = this.ongoingBindings.filter(d => bindingName.includes(d.name));
        this.ongoingBindings = this.ongoingBindings.filter(d => !logs.includes(d));
        if (logs.length === 1) {
            const log = logs[0];
            log.name = bindingName;
            log.duration = performance.now() - log.date;
            log.cancelled = cancelled;
            if (this.writeConsole) {
                console.log(log.toString());
            }
            if (this.serverAddress !== undefined) {
                const rq = new XMLHttpRequest();
                rq.open("POST", `${this.serverAddress}/api/usage`, true);
                rq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                rq.send(JSON.stringify(log));
            }
        }
    }
}

class WheelTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(event) {
        return event instanceof WheelEvent && isEventType(event.type) && this.getAcceptedEvents().includes(event.type);
    }
    getAcceptedEvents() {
        return ["wheel"];
    }
}

class WheelDataImpl extends PointDataImpl {
    constructor() {
        super(...arguments);
        this.deltaModeData = 0;
        this.deltaXData = 0;
        this.deltaYData = 0;
        this.deltaZData = 0;
    }
    flush() {
        super.flush();
        this.deltaModeData = 0;
        this.deltaXData = 0;
        this.deltaYData = 0;
        this.deltaZData = 0;
    }
    copy(data) {
        super.copy(data);
        this.deltaXData = data.deltaX;
        this.deltaYData = data.deltaY;
        this.deltaZData = data.deltaZ;
        this.deltaModeData = data.deltaMode;
    }
    get deltaMode() {
        return this.deltaModeData;
    }
    get deltaX() {
        return this.deltaXData;
    }
    get deltaY() {
        return this.deltaYData;
    }
    get deltaZ() {
        return this.deltaZData;
    }
}

class WheelFSM extends FSMImpl {
    constructor() {
        super();
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const moved = new TerminalState(this, "moved");
        this.addState(moved);
        const move = new WheelTransition(this.initState, moved);
        move.action = (event) => {
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.initToMoved(event);
        };
    }
}
class Wheel extends InteractionBase {
    constructor(fsm, data) {
        super(fsm !== null && fsm !== void 0 ? fsm : new WheelFSM(), data !== null && data !== void 0 ? data : new WheelDataImpl());
        this.handler = {
            "initToMoved": (evt) => {
                this._data.copy(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}

class KeyUpFSM extends FSMImpl {
    constructor(modifierAccepted) {
        super();
        this.modifiersAccepted = modifierAccepted;
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const released = new TerminalState(this, "released");
        this.addState(released);
        const release = new KeyUpTransition(this.initState, released);
        release.action = (event) => {
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onKeyUp(event);
        };
        release.isGuardOK = (event) => this.modifiersAccepted ||
            (!event.altKey && !event.ctrlKey && !event.shiftKey && !event.metaKey);
    }
    reinit() {
        super.reinit();
    }
}
class KeyUp extends InteractionBase {
    constructor(modifierAccepted, fsm) {
        super(fsm !== null && fsm !== void 0 ? fsm : new KeyUpFSM(modifierAccepted), new KeyDataImpl());
        this.handler = {
            "onKeyUp": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}

class MouseUpFSM extends FSMImpl {
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const released = new TerminalState(this, "released");
        this.addState(released);
        const release = new MouseUpTransition(this.initState, released);
        release.action = (event) => {
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.initToPress(event);
        };
    }
}
class MouseUp extends InteractionBase {
    constructor() {
        super(new MouseUpFSM(), new PointDataImpl());
        this.handler = {
            "initToPress": (evt) => {
                this._data.copy(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}

class BindingsImpl extends Bindings {
    constructor(history, logger) {
        super();
        this.undoHistoryData = history;
        this.logger = logger !== null && logger !== void 0 ? logger : new LoggerImpl();
    }
    get undoHistory() {
        return this.undoHistoryData;
    }
    nodeBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer);
    }
    buttonBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new ButtonPressed());
    }
    checkboxBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new BoxChecked());
    }
    colorPickerBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new ColorPicked());
    }
    comboBoxBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new ComboBoxSelected());
    }
    spinnerBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new SpinnerChanged());
    }
    dateBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new DatePicked());
    }
    hyperlinkBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new HyperLinkClicked());
    }
    textInputBinder(timeout) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new TextInputChanged(timeout));
    }
    touchDnDBinder(cancellable) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new TouchDnD(cancellable));
    }
    reciprocalTouchDnDBinder(handle, spring) {
        const anim = new DwellSpringAnimation(handle, spring);
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new TouchDnD(true))
            .on(handle)
            .then((_, i) => {
            anim.process(i);
        })
            .endOrCancel(() => {
            anim.end();
        });
    }
    multiTouchBinder(nbTouches) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new MultiTouch(nbTouches, false));
    }
    tapBinder(nbTap) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new Tap(nbTap));
    }
    longTouchBinder(duration) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new LongTouch(duration));
    }
    swipeBinder(horizontal, minVelocity, minLength, nbTouches, pxTolerance) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new MultiTouch(nbTouches, true))
            .when(i => (horizontal ? i.isHorizontal(pxTolerance) : i.isVertical(pxTolerance)))
            .when(i => (horizontal ? Math.abs(i.touches[0].diffScreenX) >= minLength : Math.abs(i.touches[0].diffScreenY) >= minLength))
            .when(i => i.touches[0].velocity * 1000 >= minVelocity);
    }
    panBinder(horizontal, minLength, nbTouches, pxTolerance) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new MultiTouch(nbTouches, true))
            .when(i => (horizontal ? i.isHorizontal(pxTolerance) : i.isVertical(pxTolerance)))
            .when(i => (horizontal ? Math.abs(i.touches[0].diffScreenX) >= minLength : Math.abs(i.touches[0].diffScreenY) >= minLength));
    }
    pinchBinder(pxTolerance) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new MultiTouch(2, false))
            .when(i => i.pinchFactor(pxTolerance) !== undefined);
    }
    clickBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new Click());
    }
    dbleClickBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new DoubleClick());
    }
    mouseUpBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new MouseUp());
    }
    mouseDownBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new MouseDown());
    }
    longMouseDownBinder(duration) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new LongMouseDown(duration));
    }
    clicksBinder(nbClicks) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new Clicks(nbClicks));
    }
    mouseLeaveBinder(withBubbling) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new MouseLeave(withBubbling));
    }
    mouseEnterBinder(withBubbling) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new MouseEnter(withBubbling));
    }
    mouseMoveBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new MouseMove());
    }
    wheelBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new Wheel());
    }
    scrollBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new Scroll());
    }
    dndBinder(cancellable) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new DnD(cancellable));
    }
    reciprocalDndBinder(handle, spring) {
        const anim = new DwellSpringAnimation(handle, spring);
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new DnD(true))
            .on(handle)
            .then((_, i) => {
            anim.process(i);
        })
            .endOrCancel(() => {
            anim.end();
        });
    }
    dragLockBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new DragLock());
    }
    keyUpBinder(modifierAccepted) {
        return new KeysBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new KeyUp(modifierAccepted));
    }
    keyDownBinder(modifierAccepted) {
        return new KeysBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new KeyDown(modifierAccepted));
    }
    keysDownBinder() {
        return new KeysBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new KeysDown());
    }
    keysTypeBinder() {
        return new KeysBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new KeysTyped());
    }
    keyTypeBinder() {
        return new KeysBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new KeyTyped());
    }
    undoRedoBinder(undo, redo, catchFn = (() => { })) {
        return [
            this.buttonBinder()
                .on(undo)
                .toProduce(() => new Undo(this.undoHistory))
                .catch(catchFn)
                .bind(),
            this.buttonBinder()
                .on(redo)
                .toProduce(() => new Redo(this.undoHistory))
                .catch(catchFn)
                .bind()
        ];
    }
    clear() {
        var _a;
        (_a = this.observer) === null || _a === void 0 ? void 0 : _a.clearObservedBindings();
        this.undoHistory.clear();
    }
    setBindingObserver(obs) {
        var _a;
        (_a = this.observer) === null || _a === void 0 ? void 0 : _a.clearObservedBindings();
        this.observer = obs;
    }
}

class UndoableCommand extends CommandBase {
    getUndoName() {
        return this.constructor.name;
    }
    getVisualSnapshot() {
        return undefined;
    }
}

class RedoNTimes extends CommandBase {
    constructor(undoHistory, numberOfRedos) {
        super();
        this.history = undoHistory;
        this.numberOfRedos = numberOfRedos;
    }
    canExecute() {
        return this.history.getRedo().length >= this.numberOfRedos;
    }
    execution() {
        for (let i = 0; i < this.numberOfRedos; i++) {
            this.history.redo();
        }
    }
}

class SetProperty extends UndoableCommand {
    constructor(obj, prop, newvalue) {
        super();
        this.obj = obj;
        this.prop = prop;
        this.newvalue = newvalue;
    }
    createMemento() {
        this.mementoValue = this.obj[this.prop];
    }
    execution() {
        this.obj[this.prop] = this.newvalue;
    }
    redo() {
        this.execution();
    }
    undo() {
        this.obj[this.prop] = this.mementoValue;
    }
    getUndoName() {
        return `Set ${String(this.prop)} value`;
    }
}

class SetProperties extends UndoableCommand {
    constructor(obj, newvalues) {
        super();
        this.obj = obj;
        this.compositeCmds = [];
        this.newvalues = newvalues;
    }
    get newvalues() {
        return this._newvalues;
    }
    set newvalues(v) {
        this._newvalues = v;
        for (const key in v) {
            this.compositeCmds.push(new SetProperty(this.obj, key, v[key]));
        }
    }
    execute() {
        this.compositeCmds.forEach(cmd => {
            void cmd.execute();
        });
        return super.execute();
    }
    execution() {
    }
    redo() {
        this.compositeCmds.forEach(cmd => {
            cmd.redo();
        });
    }
    undo() {
        this.compositeCmds.forEach(cmd => {
            cmd.undo();
        });
    }
}

class TransferArrayItem extends UndoableCommand {
    constructor(srcArray, tgtArray, srcIndex, tgtIndex, cmdName) {
        super();
        this._srcArray = srcArray;
        this._tgtArray = tgtArray;
        this._srcIndex = srcIndex;
        this._tgtIndex = tgtIndex;
        this.cmdName = cmdName;
    }
    execution() {
        this.redo();
    }
    canExecute() {
        return (this._srcIndex >= 0 && this._srcIndex < this._srcArray.length) &&
            (this._tgtIndex >= 0 && this._tgtIndex <= this._tgtArray.length);
    }
    getUndoName() {
        return this.cmdName;
    }
    redo() {
        const elt = this._srcArray[this._srcIndex];
        this._srcArray.splice(this._srcIndex, 1);
        this._tgtArray.splice(this._tgtIndex, 0, elt);
    }
    undo() {
        const elt = this._tgtArray[this._tgtIndex];
        this._tgtArray.splice(this._tgtIndex, 1);
        this._srcArray.splice(this._srcIndex, 0, elt);
    }
    get srcArray() {
        return this._srcArray;
    }
    set srcArray(value) {
        this._srcArray = value;
    }
    get tgtArray() {
        return this._tgtArray;
    }
    set tgtArray(value) {
        this._tgtArray = value;
    }
    get srcIndex() {
        return this._srcIndex;
    }
    set srcIndex(value) {
        this._srcIndex = value;
    }
    get tgtIndex() {
        return this._tgtIndex;
    }
    set tgtIndex(value) {
        this._tgtIndex = value;
    }
}

class UndoNTimes extends CommandBase {
    constructor(undoHistory, numberOfUndos) {
        super();
        this.history = undoHistory;
        this.numberOfUndos = numberOfUndos;
    }
    canExecute() {
        return this.history.getUndo().length >= this.numberOfUndos;
    }
    execution() {
        for (let i = 0; i < this.numberOfUndos; i++) {
            this.history.undo();
        }
    }
}

class WidgetTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    getWidget() {
        return this.widget;
    }
    setWidget(widget) {
        this.widget = widget;
    }
}

class FittsLawDataImpl {
    constructor(t, w, h, d) {
        this.t = t;
        this.w = w;
        this.h = h;
        this.d = d;
    }
    getID(we) {
        return Math.log2((this.d / (we !== null && we !== void 0 ? we : this.w)) + 1);
    }
}
class FittsLaw {
    constructor(bSrc, bTgt, target) {
        this.data = [];
        this.providedTarget = target;
        this.handler = (evt) => {
            var _a;
            if (this._startX === undefined) {
                this._startX = evt.screenX;
                this._startY = evt.screenY;
            }
            this._target = (_a = this.providedTarget) !== null && _a !== void 0 ? _a : (evt.target instanceof Element ? evt.target : undefined);
        };
        this.obsSrc = bSrc.produces.subscribe(() => {
            this.reinit();
            document.body.addEventListener("mousemove", this.handler);
            const t0 = performance.now();
            const obsTgt = bTgt.produces.subscribe(() => {
                var _a, _b, _c, _d;
                const t1 = performance.now();
                this.data.push(new FittsLawDataImpl(t1 - t0, (_b = (_a = this._target) === null || _a === void 0 ? void 0 : _a.clientWidth) !== null && _b !== void 0 ? _b : NaN, (_d = (_c = this._target) === null || _c === void 0 ? void 0 : _c.clientHeight) !== null && _d !== void 0 ? _d : NaN, this.computeD()));
                obsTgt.unsubscribe();
                document.body.removeEventListener("mousemove", this.handler);
            });
        });
    }
    computeD() {
        if (this._startX === undefined || this.providedTarget === undefined) {
            return NaN;
        }
        const a = this.providedTarget.clientLeft + this.providedTarget.clientWidth / 2 + this._startX;
        const b = this.providedTarget.clientTop + this.providedTarget.clientHeight / 2 + this._startY;
        return Math.sqrt(a ** 2 + b ** 2);
    }
    get we() {
        const ds = this.data.map(d => d.d);
        const mean = ds.reduce((a, b) => a + b) / ds.length;
        return Math.sqrt(ds.map(x => (x - mean) ** 2).reduce((a, b) => a + b) / ds.length);
    }
    getAB(effectiveTargetW = false) {
        const w = effectiveTargetW ? this.we : undefined;
        const xs = this.data.map(d => d.getID(w));
        const ys = this.data.map(d => d.t);
        let sumx = 0;
        let sumy = 0;
        let sumxy = 0;
        let sumxx = 0;
        let sumyy = 0;
        for (let i = 0; i < ys.length; i++) {
            sumx += xs[i];
            sumy += ys[i];
            sumxy += xs[i] * ys[i];
            sumxx += xs[i] ** 2;
            sumyy += ys[i] * ys[i];
        }
        const tmp = (ys.length * sumxy) - (sumx * sumy);
        const tmp2 = (ys.length * sumxx) - (sumx ** 2);
        const a = tmp / tmp2;
        const b = (sumy - a * sumx) / ys.length;
        const r = (tmp / Math.sqrt(tmp2 * (ys.length * sumyy - sumy ** 2))) ** 2;
        return [a, b, r];
    }
    uninstall() {
        this.obsSrc.unsubscribe();
        this.data.length = 0;
    }
    reinit() {
        this._startX = undefined;
        this._startY = undefined;
        this._target = undefined;
    }
}

class UndoableTreeNodeImpl {
    constructor(undoable, id, parent) {
        this.undoable = undoable;
        this.id = id;
        this.children = new Array();
        this.parent = parent;
        this.cacheVisualSnap = undoable.getVisualSnapshot();
    }
    undo() {
        if (this.parent !== undefined) {
            this.parent.lastChildUndone = this;
        }
        this.undoable.undo();
    }
    redo() {
        this.undoable.redo();
    }
    get visualSnapshot() {
        return this.cacheVisualSnap;
    }
}
class TreeUndoHistoryImpl extends TreeUndoHistory {
    constructor() {
        super();
        this.undoableNodes = [];
        this.roots = new Set();
        this.idCounter = 0;
        this.undoPublisher = new Subject();
        this.redoPublisher = new Subject();
    }
    add(undoable) {
        const node = new UndoableTreeNodeImpl(undoable, this.idCounter, this.currentNode);
        this.undoableNodes[this.idCounter] = node;
        if (this.currentNode === undefined) {
            this.roots.add(node.id);
        }
        else {
            this.currentNode.children.push(node);
        }
        this._currentNode = node;
        this.idCounter++;
        this.undoPublisher.next(undoable);
    }
    get currentNode() {
        return this._currentNode;
    }
    clear() {
        this.roots.clear();
        this._currentNode = undefined;
        this.undoableNodes.length = 0;
        this.idCounter = 0;
        this.undoPublisher.next(undefined);
        this.redoPublisher.next(undefined);
    }
    delete(id) {
        const node = this.undoableNodes[id];
        if (node === undefined) {
            return;
        }
        let nodeBranch = this.currentNode;
        while (nodeBranch !== undefined) {
            if (nodeBranch.id === id) {
                return;
            }
            nodeBranch = nodeBranch.parent;
        }
        this.undoableNodes[id] = undefined;
        this.roots.delete(id);
        if (node.parent !== undefined) {
            remove(node.parent.children, node);
            if (node.parent.lastChildUndone === node) {
                node.parent.lastChildUndone = undefined;
            }
        }
        [...node.children].forEach(child => {
            this.delete(child.id);
        });
        if (this.currentNode === node) {
            this._currentNode = undefined;
        }
    }
    goTo(id) {
        var _a;
        if (((_a = this.currentNode) === null || _a === void 0 ? void 0 : _a.id) === id || this.undoableNodes.length === 0 || id >= this.undoableNodes.length || id < -1) {
            return;
        }
        if (this.currentNode === undefined) {
            this.goToFromRoot(id);
        }
        else {
            this.goFromOneNodeToAnotherOne(id);
        }
        this._currentNode = this.undoableNodes[id];
    }
    goToFromRoot(id) {
        const undoables = this.gatherToRoot(this.undoableNodes[id]);
        for (let i = undoables.length - 1; i >= 0; i--) {
            undoables[i].redo();
        }
    }
    gatherToRoot(node) {
        const path = new Array();
        let n = node;
        while (n !== undefined) {
            path.push(n);
            n = n.parent;
        }
        return path.reverse();
    }
    goFromOneNodeToAnotherOne(id) {
        const pathSrc = this.gatherToRoot(this.currentNode);
        const pathTo = id === -1 ? [] : this.gatherToRoot(this.undoableNodes[id]);
        let i = 0;
        while (pathSrc[i] === pathTo[i]) {
            i++;
        }
        for (let j = pathSrc.length - 1; j > i; j--) {
            pathSrc[j].undo();
        }
        if (i < pathSrc.length) {
            pathSrc[i].undo();
        }
        for (let j = i; j < pathTo.length; j++) {
            pathTo[j].redo();
        }
    }
    redo() {
        const node = this.currentNode === undefined ? this.undoableNodes[0] : this.currentNode.lastChildUndone;
        if (node !== undefined) {
            node.undoable.redo();
            this._currentNode = node;
            this.undoPublisher.next(node.undoable);
            this.redoPublisher.next(this.getLastRedo());
        }
    }
    undo() {
        if (this.currentNode !== undefined) {
            const u = this.currentNode.undoable;
            this.currentNode.undo();
            this._currentNode = this.currentNode.parent;
            this.undoPublisher.next(this.getLastUndo());
            this.redoPublisher.next(u);
        }
    }
    getPositions() {
        const positions = new Map();
        let counter = 0;
        this.roots.forEach(root => {
            counter = this.getPositionNode(this.undoableNodes[root], positions, counter);
        });
        return positions;
    }
    getPositionNode(node, positions, counter) {
        var _a, _b;
        if (node.children.length === 0) {
            positions.set(node.id, counter);
            return counter + 1;
        }
        if (node.children.length === 1) {
            const newCounter = this.getPositionNode(node.children[0], positions, counter);
            positions.set(node.id, (_a = positions.get(node.children[0].id)) !== null && _a !== void 0 ? _a : -1);
            return newCounter;
        }
        let newCounter = counter;
        for (let i = 0; i < Math.floor(node.children.length / 2); i++) {
            newCounter = this.getPositionNode(node.children[i], positions, newCounter);
        }
        if (node.children.length % 2 === 0) {
            positions.set(node.id, newCounter);
            newCounter++;
        }
        else {
            newCounter = this.getPositionNode(node.children[Math.floor(node.children.length / 2)], positions, newCounter);
            positions.set(node.id, (_b = positions.get(node.children[Math.floor(node.children.length / 2)].id)) !== null && _b !== void 0 ? _b : -1);
        }
        for (let i = Math.ceil(node.children.length / 2); i < node.children.length; i++) {
            newCounter = this.getPositionNode(node.children[i], positions, newCounter);
        }
        return newCounter;
    }
    getLastOrEmptyRedoMessage() {
        var _a;
        return (_a = this.getLastRedoMessage()) !== null && _a !== void 0 ? _a : "";
    }
    getLastOrEmptyUndoMessage() {
        var _a;
        return (_a = this.getLastUndoMessage()) !== null && _a !== void 0 ? _a : "";
    }
    getLastRedo() {
        var _a, _b;
        if (this.currentNode === undefined) {
            return (_a = this.undoableNodes[0]) === null || _a === void 0 ? void 0 : _a.undoable;
        }
        if (this.currentNode.lastChildUndone !== undefined) {
            return this.currentNode.lastChildUndone.undoable;
        }
        return (_b = this.currentNode.children[0]) === null || _b === void 0 ? void 0 : _b.undoable;
    }
    getLastRedoMessage() {
        var _a;
        return (_a = this.getLastRedo()) === null || _a === void 0 ? void 0 : _a.getUndoName();
    }
    getLastUndo() {
        var _a;
        return (_a = this.currentNode) === null || _a === void 0 ? void 0 : _a.undoable;
    }
    getLastUndoMessage() {
        var _a;
        return (_a = this.getLastUndo()) === null || _a === void 0 ? void 0 : _a.getUndoName();
    }
    undosObservable() {
        return this.undoPublisher;
    }
    redosObservable() {
        return this.redoPublisher;
    }
}

class UndoHistoryImpl extends UndoHistory {
    constructor() {
        super();
        this.sizeMax = 0;
        this.undos = [];
        this.redos = [];
        this.sizeMax = 20;
        this.undoPublisher = new Subject();
        this.redoPublisher = new Subject();
    }
    undosObservable() {
        return this.undoPublisher;
    }
    redosObservable() {
        return this.redoPublisher;
    }
    clear() {
        if (this.undos.length > 0) {
            this.undos.length = 0;
            this.undoPublisher.next(undefined);
        }
        this.clearRedo();
    }
    clearRedo() {
        if (this.redos.length > 0) {
            this.redos.length = 0;
            this.redoPublisher.next(undefined);
        }
    }
    add(undoable) {
        if (this.sizeMax > 0) {
            if (this.undos.length === this.sizeMax) {
                this.undos.shift();
            }
            this.undos.push(undoable);
            this.undoPublisher.next(undoable);
            this.clearRedo();
        }
    }
    undo() {
        const undoable = this.undos.pop();
        if (undoable !== undefined) {
            try {
                undoable.undo();
            }
            finally {
                this.redos.push(undoable);
                this.undoPublisher.next(this.getLastUndo());
                this.redoPublisher.next(undoable);
            }
        }
    }
    redo() {
        const undoable = this.redos.pop();
        if (undoable !== undefined) {
            try {
                undoable.redo();
            }
            finally {
                this.undos.push(undoable);
                this.undoPublisher.next(undoable);
                this.redoPublisher.next(this.getLastRedo());
            }
        }
    }
    getLastUndoMessage() {
        var _a;
        return (_a = peek(this.undos)) === null || _a === void 0 ? void 0 : _a.getUndoName();
    }
    getLastRedoMessage() {
        var _a;
        return (_a = peek(this.redos)) === null || _a === void 0 ? void 0 : _a.getUndoName();
    }
    getLastOrEmptyUndoMessage() {
        var _a;
        return (_a = this.getLastUndoMessage()) !== null && _a !== void 0 ? _a : "";
    }
    getLastOrEmptyRedoMessage() {
        var _a;
        return (_a = this.getLastRedoMessage()) !== null && _a !== void 0 ? _a : "";
    }
    getLastUndo() {
        return peek(this.undos);
    }
    getLastRedo() {
        return peek(this.redos);
    }
    getSizeMax() {
        return this.sizeMax;
    }
    setSizeMax(max) {
        if (max >= 0) {
            const removed = this.undos.splice(0, this.undos.length - max);
            if (this.undos.length === 0 && removed.length > 0) {
                this.undoPublisher.next(undefined);
            }
            this.sizeMax = max;
        }
    }
    getUndo() {
        return this.undos;
    }
    getRedo() {
        return this.redos;
    }
}

export { AnonBinding, AnonCmd, Binder, BindingImpl, Bindings, BindingsContext, BindingsImpl, BoxCheckPressedTransition, BoxChecked, ButtonPressed, ButtonPressedTransition, CancelFSMException, CancellingState, Click, ClickFSM, ClickTransition, Clicks, ClicksFSM, CmdStatus, ColorPicked, ColorPickedTransition, ComboBoxSelected, ComboBoxTransition, CommandBase, ConcurrentFSM, ConcurrentInteraction, DatePicked, DatePickedTransition, DnD, DoubleClick, DoubleClickFSM, DragLock, DwellSpringAnimation, EscapeKeyPressureTransition, FSMImpl, FittsLaw, FittsLawDataImpl, HyperLinkClicked, HyperLinkTransition, InitState, InteractionBase, InteractionDataBase, KeyCode, KeyDataImpl, KeyDown, KeyDownFSM, KeyDownTransition, KeyTyped, KeyTypedFSM, KeyUp, KeyUpFSM, KeyUpTransition, KeysBinder, KeysDataImpl, KeysDown, KeysDownFSM, KeysTyped, KeysTypedFSM, LogLevel, LoggerImpl, LoggingData, LongMouseDown, LongMouseDownFSM, LongTouch, MouseDown, MouseDownFSM, MouseDownTransition, MouseEnter, MouseEnterFSM, MouseEnterTransition, MouseLeave, MouseLeaveFSM, MouseLeaveTransition, MouseMove, MouseMoveFSM, MouseMoveTransition, MouseOutTransition, MouseOverTransition, MouseUp, MouseUpFSM, MouseUpTransition, MultiTouch, MultiTouchDataImpl, MustBeUndoableCmdError, OutputStateBase, PointDataImpl, PointingDataBase, PointsDataImpl, Redo, RedoNTimes, Scroll, ScrollDataImpl, ScrollFSM, ScrollTransition, SetProperties, SetProperty, SpinnerChanged, SpinnerChangedFSM, SpinnerChangedTransition, SrcTgtPointsDataImpl, SrcTgtTouchDataImpl, StateBase, StdState, SubFSMTransition, Tap, TapDataImpl, TerminalState, TextInputChanged, TextInputChangedTransition, TimeoutTransition, TouchDataImpl, TouchDnD, TouchDnDFSM, TouchMoveTransition, TouchPressureTransition, TouchReleaseTransition, TransferArrayItem, TransitionBase, TreeUndoHistory, TreeUndoHistoryImpl, Undo, UndoHistory, UndoHistoryImpl, UndoNTimes, UndoableCommand, UpdateBinder, UsageLog, Wheel, WheelDataImpl, WheelFSM, WheelTransition, WhenType, WidgetDataImpl, WidgetTransition, eventTypes, getTouch, isButton, isCheckBox, isColorChoice, isComboBox, isDatePicker, isEltRef, isEventType, isHyperLink, isKeyDownEvent, isKeyEvent, isKeyUpEvent, isMouseDownEvent, isMouseEvent, isOutputStateType, isScrollEvent, isSpinner, isTextInput, isTouchEvent, isUndoableType, isWhenAtEnd, isWhenAtStart, isWhenAtThen, isWhenStrict, peek, remove, removeAt };
//# sourceMappingURL=interacto.es5.js.map
