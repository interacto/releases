import { isEventType } from "./Events";
import { TransitionBase } from "./TransitionBase";
export class MouseEnterTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(event) {
        return event instanceof MouseEvent && isEventType(event.type) && this.getAcceptedEvents().includes(event.type);
    }
    getAcceptedEvents() {
        return ["mouseenter"];
    }
}
