import { TransitionBase } from "./TransitionBase";
export class MouseTransition extends TransitionBase {
    constructor(srcState, tgtState, types, action, guard) {
        super(srcState, tgtState, action, guard);
        this.mouseType = typeof types === "string" ? [types] : types;
    }
    accept(event) {
        return event instanceof MouseEvent && this.getAcceptedEvents().includes(event.type);
    }
    getAcceptedEvents() {
        return this.mouseType;
    }
}
