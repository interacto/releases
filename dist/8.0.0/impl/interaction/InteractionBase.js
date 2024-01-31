import { keyEventTypes, mouseEventTypes, touchEventTypes } from "../../api/fsm/EventType";
import { InitState } from "../fsm/InitState";
export class InteractionBase {
    _registeredNodes;
    _dynamicRegisteredNodes;
    _fsm;
    _name;
    _log;
    mutationObservers;
    _data;
    logger;
    mouseHandler;
    touchHandler;
    keyHandler;
    uiHandler;
    actionHandler;
    disposable;
    stopImmediatePropag;
    preventDef;
    activated;
    throttleTimeout;
    currentThrottling;
    latestThrottledEvent;
    constructor(fsm, data, logger, name) {
        this._name = name;
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
        this._log = false;
        this._registeredNodes = new Set();
        this._dynamicRegisteredNodes = new Set();
        this.mutationObservers = [];
        this.throttleTimeout = 0;
    }
    reinitData() {
        this._data.flush();
    }
    get data() {
        return this._data;
    }
    get name() {
        return this._name;
    }
    setThrottleTimeout(timeout) {
        this.throttleTimeout = timeout;
    }
    createThrottleTimeout() {
        this.currentThrottling?.cancel();
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
                catch (error) {
                    rejection(error);
                }
            }, currTimeout);
        }).catch((error) => {
            this.logger.logInteractionErr("Error during the throttling process", error, this.constructor.name);
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
        const events = Array.from(this.getEventTypesOf(oldState));
        const eventsToRemove = events.filter(evt => !currEvents.includes(evt));
        const eventsToAdd = currEvents.filter(evt => !events.includes(evt));
        for (const node of this._registeredNodes) {
            for (const type of eventsToRemove) {
                this.unregisterEventToNode(type, node);
            }
            for (const type of eventsToAdd) {
                this.registerEventToNode(type, node);
            }
        }
    }
    getCurrentAcceptedEvents(state) {
        return Array.from(this.getEventTypesOf(state));
    }
    callBackMutationObserver(mutationList) {
        for (const mutation of mutationList) {
            for (const node of mutation.addedNodes) {
                this.registerToNodes([node]);
            }
            for (const node of mutation.removedNodes) {
                this.unregisterFromNodes([node]);
            }
        }
    }
    getEventTypesOf(state) {
        const result = new Set();
        for (const trans of state.transitions) {
            for (const evt of trans.getAcceptedEvents()) {
                result.add(evt);
            }
        }
        return result;
    }
    registerToNodes(widgets) {
        for (const widget of widgets) {
            this._registeredNodes.add(widget);
            this.onNewNodeRegistered(widget);
        }
    }
    unregisterFromNodes(widgets) {
        for (const widget of widgets) {
            this._registeredNodes.delete(widget);
            this.onNodeUnregistered(widget);
        }
    }
    onNodeUnregistered(node) {
        for (const type of this.getEventTypesOf(this._fsm.currentState)) {
            this.unregisterEventToNode(type, node);
        }
    }
    onNewNodeRegistered(node) {
        for (const type of this.getEventTypesOf(this._fsm.currentState)) {
            this.registerEventToNode(type, node);
        }
    }
    registerToNodeChildren(elementToObserve) {
        this._dynamicRegisteredNodes.add(elementToObserve);
        for (const node of elementToObserve.childNodes) {
            this.registerToNodes([node]);
        }
        const newMutationObserver = new MutationObserver(mutations => {
            this.callBackMutationObserver(mutations);
        });
        newMutationObserver.observe(elementToObserve, { "childList": true });
        this.mutationObservers.push(newMutationObserver);
    }
    registerEventToNode(eventType, node) {
        if (!(node instanceof EventTarget)) {
            return;
        }
        if (mouseEventTypes.includes(eventType) || eventType === "wheel") {
            node.addEventListener(eventType, this.getMouseHandler());
            return;
        }
        if (touchEventTypes.includes(eventType)) {
            node.addEventListener(eventType, this.getTouchHandler());
            return;
        }
        if (keyEventTypes.includes(eventType)) {
            node.addEventListener(eventType, this.getKeyHandler());
            return;
        }
        if (eventType === "scroll") {
            node.addEventListener(eventType, this.getUIHandler());
        }
    }
    unregisterEventToNode(eventType, node) {
        if (!(node instanceof EventTarget)) {
            return;
        }
        if (mouseEventTypes.includes(eventType) || eventType === "wheel") {
            node.removeEventListener(eventType, this.getMouseHandler());
            return;
        }
        if (touchEventTypes.includes(eventType)) {
            node.removeEventListener(eventType, this.getTouchHandler());
            return;
        }
        if (keyEventTypes.includes(eventType)) {
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
        this._log = log;
        this._fsm.log = log;
    }
    isActivated() {
        return this.activated;
    }
    setActivated(activated) {
        if (this._log) {
            this.logger.logInteractionMsg(`Interaction activation: ${String(activated)}`, this.constructor.name);
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
        for (const node of this._registeredNodes) {
            this.onNodeUnregistered(node);
        }
        this._registeredNodes.clear();
        for (const obs of this.mutationObservers) {
            obs.disconnect();
        }
        this.mutationObservers.length = 0;
        this.setActivated(false);
    }
    acceptVisitor(visitor) {
        visitor.visitInteraction(this);
    }
    get registeredNodes() {
        return this._registeredNodes;
    }
    get dynamicRegisteredNodes() {
        return this._dynamicRegisteredNodes;
    }
}
