import { InitState } from "../fsm/InitState";
import { catInteraction } from "../logging/ConfigLog";
import { isKeyEvent, isMouseEvent, isTouchEvent } from "../fsm/Events";
export class InteractionBase {
    constructor(fsm, data) {
        this.activated = false;
        this.stopImmediatePropag = false;
        this.preventDef = false;
        this.data = data;
        this.fsm = fsm;
        this.disposable = this.fsm.currentStateObservable().subscribe(current => {
            this.updateEventsRegistered(current[1], current[0]);
        });
        this.activated = true;
        this.asLog = false;
        this.registeredNodes = new Set();
        this.mutationObservers = [];
        this.throttleTimeout = 0;
    }
    reinitData() {
        this.data.flush();
    }
    getData() {
        return this.data;
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
            if (ex instanceof Error) {
                if (ex.message !== "cancellation") {
                    catInteraction.error("Error during the throttling process", ex);
                }
            }
            else {
                catInteraction.warn(`Error during the throttling process: ${String(ex)}`);
            }
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
        if (newState === oldState || this.fsm.getStates().length === 2) {
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
        if (state.getTransitions().length === 0) {
            return [];
        }
        return state.getTransitions().map(t => t.getAcceptedEvents())
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
        this.getEventTypesOf(this.fsm.getCurrentState()).forEach(type => {
            this.unregisterEventToNode(type, node);
        });
    }
    onNewNodeRegistered(node) {
        this.getEventTypesOf(this.fsm.getCurrentState()).forEach(type => {
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
        return this.activated && !(this.fsm.getCurrentState() instanceof InitState);
    }
    fullReinit() {
        this.fsm.fullReinit();
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
        this.fsm.process(event);
        if (this.preventDef) {
            event.preventDefault();
        }
        if (this.stopImmediatePropag) {
            event.stopImmediatePropagation();
        }
    }
    log(log) {
        this.asLog = log;
        this.fsm.log(log);
    }
    isActivated() {
        return this.activated;
    }
    setActivated(activated) {
        if (this.asLog) {
            catInteraction.info(`Interaction activation: ${String(activated)}`);
        }
        this.activated = activated;
        if (!activated) {
            this.fsm.fullReinit();
        }
    }
    getFsm() {
        return this.fsm;
    }
    reinit() {
        this.fsm.reinit();
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
