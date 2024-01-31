import { TransitionBase } from "./TransitionBase";
export class WheelTransition extends TransitionBase {
    static acceptedEvents = new Set(["wheel"]);
    constructor(srcState, tgtState, action, guard) {
        super(srcState, tgtState, action, guard);
    }
    accept(event) {
        return event instanceof WheelEvent && this.getAcceptedEvents().has(event.type);
    }
    getAcceptedEvents() {
        return WheelTransition.acceptedEvents;
    }
}
