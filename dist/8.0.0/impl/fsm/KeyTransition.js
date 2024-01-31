import { TransitionBase } from "./TransitionBase";
export class KeyTransition extends TransitionBase {
    acceptedEvents = new Set(["wheel"]);
    constructor(srcState, tgtState, keyType, action, guard) {
        super(srcState, tgtState, action, guard);
        this.acceptedEvents = new Set([keyType]);
    }
    accept(event) {
        return event instanceof KeyboardEvent && this.getAcceptedEvents().has(event.type);
    }
    getAcceptedEvents() {
        return this.acceptedEvents;
    }
}
