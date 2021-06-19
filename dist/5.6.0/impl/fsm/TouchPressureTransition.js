import { isEventType } from "./Events";
import { TransitionBase } from "./TransitionBase";
export class TouchPressureTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(evt) {
        return evt instanceof TouchEvent && isEventType(evt.type) && this.getAcceptedEvents().includes(evt.type);
    }
    getAcceptedEvents() {
        return ["touchstart"];
    }
}
