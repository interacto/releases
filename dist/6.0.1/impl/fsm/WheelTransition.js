import { TransitionBase } from "./TransitionBase";
import { isEventType } from "./Events";
export class WheelTransition extends TransitionBase {
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
