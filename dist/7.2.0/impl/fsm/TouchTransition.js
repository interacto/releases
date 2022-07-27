import { TransitionBase } from "./TransitionBase";
export class TouchTransition extends TransitionBase {
    constructor(srcState, tgtState, eventType, action, guard) {
        super(srcState, tgtState, action, guard);
        this.eventType = eventType;
    }
    accept(evt) {
        return evt instanceof TouchEvent && this.getAcceptedEvents().includes(evt.type);
    }
    getAcceptedEvents() {
        return [this.eventType];
    }
}
