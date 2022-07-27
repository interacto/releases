import { TransitionBase } from "./TransitionBase";
export class WheelTransition extends TransitionBase {
    constructor(srcState, tgtState, action, guard) {
        super(srcState, tgtState, action, guard);
    }
    accept(event) {
        return event instanceof WheelEvent && this.getAcceptedEvents().includes(event.type);
    }
    getAcceptedEvents() {
        return ["wheel"];
    }
}
