import { TransitionBase } from "./TransitionBase";
export class MouseTransition extends TransitionBase {
    acceptedEvents;
    constructor(srcState, tgtState, types, action, guard) {
        super(srcState, tgtState, action, guard);
        this.acceptedEvents = new Set(typeof types === "string" ? [types] : types);
    }
    accept(event) {
        return event instanceof MouseEvent && this.getAcceptedEvents().has(event.type);
    }
    getAcceptedEvents() {
        return this.acceptedEvents;
    }
}
