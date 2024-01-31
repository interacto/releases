import { TransitionBase } from "./TransitionBase";
export class TouchTransition extends TransitionBase {
    acceptedEvents;
    constructor(srcState, tgtState, eventType, action, guard) {
        super(srcState, tgtState, action, guard);
        this.acceptedEvents = new Set([eventType]);
    }
    accept(evt) {
        return evt instanceof TouchEvent && this.getAcceptedEvents().has(evt.type);
    }
    getAcceptedEvents() {
        return this.acceptedEvents;
    }
}
