import { InitState } from "./InitState";
import { isOutputStateType } from "../../api/fsm/OutputState";
import { TimeoutTransition } from "./TimeoutTransition";
import { catFSM } from "../logging/ConfigLog";
import { isKeyDownEvent, isKeyUpEvent } from "./Events";
import { Subject } from "rxjs";
import { remove, removeAt } from "../util/ArrayUtil";
import { CancelFSMException } from "./CancelFSMException";
export class FSMImpl {
    constructor() {
        this._inner = false;
        this.started = false;
        this.initState = new InitState(this, "init");
        this.states = [this.initState];
        this._startingState = this.initState;
        this._currentState = this.initState;
        this.currentStatePublisher = new Subject();
        this.handlers = [];
        this.eventsToProcess = [];
        this.asLogFSM = false;
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        this.dataHandler = dataHandler;
    }
    setCurrentSubFSM(subFSM) {
        this.currentSubFSM = subFSM;
    }
    getCurrentState() {
        return this._currentState;
    }
    currentStateObservable() {
        return this.currentStatePublisher;
    }
    setInner(inner) {
        this._inner = inner;
    }
    getInner() {
        return this._inner;
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
        if (this.currentSubFSM !== undefined) {
            if (this.asLogFSM) {
                catFSM.info(`processing event ${String(event.type)} in a sub-FSM`);
            }
            return this.currentSubFSM.process(event);
        }
        if (this.asLogFSM) {
            catFSM.info(`processing event ${String(event.type)} at state ${this.getCurrentState().getName()}: ${this.constructor.name}`);
        }
        return this.getCurrentState().process(event);
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
        this.setCurrentState(state);
        this.checkTimeoutTransition();
        if (this.started) {
            this.onUpdating();
        }
    }
    isStarted() {
        return this.started;
    }
    setCurrentState(state) {
        const old = this.getCurrentState();
        this._currentState = state;
        this.currentStatePublisher.next([old, this._currentState]);
    }
    processRemainingEvents() {
        const list = [...this.eventsToProcess];
        list.forEach(event => {
            removeAt(this.eventsToProcess, 0);
            if (this.asLogFSM) {
                catFSM.info(`Recycling event: ${event.constructor.name}`);
            }
            this.process(event);
        });
    }
    addRemaningEventsToProcess(event) {
        this.eventsToProcess.push(event);
    }
    onTerminating() {
        if (this.asLogFSM) {
            catFSM.info(`FSM ended: ${this.constructor.name}`);
        }
        if (this.started) {
            this.notifyHandlerOnStop();
        }
        this.reinit();
        this.processRemainingEvents();
    }
    onCancelling() {
        if (this.asLogFSM) {
            catFSM.info(`FSM cancelled: ${this.constructor.name}`);
        }
        if (this.started) {
            this.notifyHandlerOnCancel();
        }
        this.fullReinit();
    }
    onStarting() {
        if (this.asLogFSM) {
            catFSM.info(`FSM started: ${this.constructor.name}`);
        }
        this.started = true;
        this.notifyHandlerOnStart();
    }
    onUpdating() {
        if (this.started) {
            if (this.asLogFSM) {
                catFSM.info(`FSM updated: ${this.constructor.name}`);
            }
            this.notifyHandlerOnUpdate();
        }
    }
    addState(state) {
        this.states.push(state);
    }
    log(log) {
        this.asLogFSM = log;
    }
    reinit() {
        var _a, _b;
        if (this.asLogFSM) {
            catFSM.info(`FSM reinitialised: ${this.constructor.name}`);
        }
        (_a = this.currentTimeout) === null || _a === void 0 ? void 0 : _a.stopTimeout();
        this.started = false;
        this.setCurrentState(this.initState);
        this.currentTimeout = undefined;
        (_b = this.currentSubFSM) === null || _b === void 0 ? void 0 : _b.reinit();
        if (this.dataHandler !== undefined && !this._inner) {
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
        if (this.currentTimeout !== undefined) {
            if (this.asLogFSM) {
                catFSM.info(`Timeout: ${this.constructor.name}`);
            }
            const state = this.currentTimeout.execute();
            if (isOutputStateType(state)) {
                this.setCurrentState(state);
                this.checkTimeoutTransition();
            }
        }
    }
    stopCurrentTimeout() {
        if (this.currentTimeout !== undefined) {
            if (this.asLogFSM) {
                catFSM.info(`Timeout stopped: ${this.constructor.name}`);
            }
            this.currentTimeout.stopTimeout();
            this.currentTimeout = undefined;
        }
    }
    checkTimeoutTransition() {
        const tr = this.getCurrentState().getTransitions()
            .find(t => t instanceof TimeoutTransition);
        if (tr !== undefined) {
            if (this.asLogFSM) {
                catFSM.info(`Timeout starting: ${this.constructor.name}`);
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
        try {
            this.handlers.forEach(handler => {
                handler.fsmStarts();
            });
        }
        catch (ex) {
            if (ex instanceof CancelFSMException) {
                this.onCancelling();
                throw ex;
            }
            if (ex instanceof Error) {
                catFSM.error("An 'fsmStarts' produced an error", ex);
            }
            else {
                catFSM.warn(`crash in an 'fsmStarts': ${String(ex)}`);
            }
            this.onCancelling();
        }
    }
    notifyHandlerOnUpdate() {
        try {
            this.handlers.forEach(handler => {
                handler.fsmUpdates();
            });
        }
        catch (ex) {
            if (ex instanceof CancelFSMException) {
                this.onCancelling();
                throw ex;
            }
            if (ex instanceof Error) {
                catFSM.error("An 'fsmUpdates' produced an error", ex);
            }
            else {
                catFSM.warn(`crash in an 'fsmUpdates': ${String(ex)}`);
            }
            this.onCancelling();
        }
    }
    notifyHandlerOnStop() {
        try {
            [...this.handlers].forEach(handler => {
                handler.fsmStops();
            });
        }
        catch (ex) {
            if (ex instanceof CancelFSMException) {
                this.onCancelling();
                throw ex;
            }
            if (ex instanceof Error) {
                catFSM.error("An 'fsmStops' produced an error", ex);
            }
            else {
                catFSM.warn(`crash in an 'fsmStops': ${String(ex)}`);
            }
            this.onCancelling();
        }
    }
    notifyHandlerOnCancel() {
        try {
            [...this.handlers].forEach(handler => {
                handler.fsmCancels();
            });
        }
        catch (ex) {
            if (ex instanceof Error) {
                catFSM.error("An 'fsmCancels' produced an error", ex);
            }
            else {
                catFSM.warn(`crash in an 'fsmCancels': ${String(ex)}`);
            }
        }
    }
    getStates() {
        return [...this.states];
    }
    getStartingState() {
        return this._startingState;
    }
    setStartingState(state) {
        this._startingState = state;
    }
    getEventsToProcess() {
        return [...this.eventsToProcess];
    }
    getInitState() {
        return this.initState;
    }
    uninstall() {
        this.fullReinit();
        this.asLogFSM = false;
        this.currentStatePublisher.complete();
        this.currentSubFSM = undefined;
        this.states.forEach(state => {
            state.uninstall();
        });
        this.states.length = 0;
        this.dataHandler = undefined;
    }
}
