import { InitState } from "./InitState";
import { isOutputStateType } from "../../api/fsm/OutputState";
import { TimeoutTransition } from "./TimeoutTransition";
import { isKeyDownEvent, isKeyUpEvent } from "./Events";
import { Subject } from "rxjs";
import { remove, removeAt } from "../util/ArrayUtil";
import { CancelFSMException } from "./CancelFSMException";
import { StdState } from "./StdState";
import { TerminalState } from "./TerminalState";
import { CancellingState } from "./CancellingState";
import { MustBeUndoableCmdError } from "../binding/MustBeUndoableCmdError";
export class FSMImpl {
    constructor(logger, dataHandler) {
        this._dataHandler = dataHandler;
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
        if (this.currentSubFSM !== undefined) {
            if (this.log) {
                this.logger.logInteractionMsg(`processing event ${String(event.type)} in a sub-FSM`, this.constructor.name);
            }
            return this.currentSubFSM.process(event);
        }
        if (this.log) {
            this.logger.logInteractionMsg(`processing event ${String(event.type)} at state 
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
    get dataHandler() {
        return this._dataHandler;
    }
    set dataHandler(dataHandler) {
        this._dataHandler = dataHandler;
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
            removeAt(this.eventsToProcess, 0);
            if (this.log) {
                this.logger.logInteractionMsg("Recycling event", this.constructor.name);
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
        if (this.log) {
            this.logger.logInteractionMsg("FSM ended", this.constructor.name);
        }
        if (this.started) {
            this.notifyHandlerOnStop();
        }
        this.reinit();
        this.processRemainingEvents();
    }
    onCancelling() {
        if (this.log) {
            this.logger.logInteractionMsg("FSM cancelled", this.constructor.name);
        }
        if (this.started) {
            this.notifyHandlerOnCancel();
        }
        this.fullReinit();
    }
    onStarting() {
        if (this.log) {
            this.logger.logInteractionMsg("FSM started", this.constructor.name);
        }
        this._started = true;
        this.notifyHandlerOnStart();
    }
    onUpdating() {
        if (this.started) {
            if (this.log) {
                this.logger.logInteractionMsg("FSM updated", this.constructor.name);
            }
            this.notifyHandlerOnUpdate();
        }
    }
    addStdState(name, startingState = false) {
        const state = new StdState(this, name);
        this.addState(state, startingState);
        return state;
    }
    addTerminalState(name, startingState = false) {
        const state = new TerminalState(this, name);
        this.addState(state, startingState);
        return state;
    }
    addCancellingState(name) {
        const state = new CancellingState(this, name);
        this.addState(state);
        return state;
    }
    addState(state, startingState = false) {
        this._states.push(state);
        if (startingState) {
            this.startingState = state;
        }
    }
    reinit() {
        if (this.log) {
            this.logger.logInteractionMsg("FSM reinitialised", this.constructor.name);
        }
        this.currentTimeout?.stopTimeout();
        this._started = false;
        this.currentState = this.initState;
        this.currentTimeout = undefined;
        this.currentSubFSM?.reinit();
        if (this.dataHandler !== undefined && !this.inner) {
            this.dataHandler.reinitData();
        }
    }
    fullReinit() {
        this.eventsToProcess.length = 0;
        this.reinit();
        this.currentSubFSM?.fullReinit();
    }
    onTimeout() {
        if (this.currentTimeout !== undefined) {
            if (this.log) {
                this.logger.logInteractionMsg("Timeout", this.constructor.name);
            }
            const state = this.currentTimeout.execute();
            if (isOutputStateType(state)) {
                this.currentState = state;
                this.checkTimeoutTransition();
            }
        }
    }
    stopCurrentTimeout() {
        if (this.currentTimeout !== undefined) {
            if (this.log) {
                this.logger.logInteractionMsg("Timeout stopped", this.constructor.name);
            }
            this.currentTimeout.stopTimeout();
            this.currentTimeout = undefined;
        }
    }
    checkTimeoutTransition() {
        const tr = this.currentState.transitions
            .find(t => t instanceof TimeoutTransition);
        if (tr !== undefined) {
            if (this.log) {
                this.logger.logInteractionMsg("Timeout starting", this.constructor.name);
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
                handler.fsmStarts?.();
            });
        }
        catch (ex) {
            if (!(ex instanceof CancelFSMException || ex instanceof MustBeUndoableCmdError)) {
                this.logger.logInteractionErr("An 'fsmStarts' produced an error", ex, this.constructor.name);
            }
            this.onCancelling();
            throw ex;
        }
    }
    notifyHandlerOnUpdate() {
        try {
            this.handlers.forEach(handler => {
                handler.fsmUpdates?.();
            });
        }
        catch (ex) {
            if (!(ex instanceof CancelFSMException || ex instanceof MustBeUndoableCmdError)) {
                this.logger.logInteractionErr("An 'fsmUpdates' produced an error", ex, this.constructor.name);
            }
            this.onCancelling();
            throw ex;
        }
    }
    notifyHandlerOnStop() {
        try {
            [...this.handlers].forEach(handler => {
                handler.fsmStops?.();
            });
        }
        catch (ex) {
            if (!(ex instanceof CancelFSMException || ex instanceof MustBeUndoableCmdError)) {
                this.logger.logInteractionErr("An 'fsmStops' produced an error", ex, this.constructor.name);
            }
            this.onCancelling();
            throw ex;
        }
    }
    notifyHandlerOnCancel() {
        try {
            [...this.handlers].forEach(handler => {
                handler.fsmCancels?.();
            });
        }
        catch (ex) {
            if (!(ex instanceof MustBeUndoableCmdError)) {
                this.logger.logInteractionErr("An 'fsmCancels' produced an error", ex, this.constructor.name);
            }
            throw ex;
        }
    }
    notifyHandlerOnError(err) {
        try {
            [...this.handlers].forEach(handler => {
                handler.fsmError?.(err);
            });
        }
        catch (ex) {
            this.logger.logInteractionErr("An 'fsmError' produced an error", ex, this.constructor.name);
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
