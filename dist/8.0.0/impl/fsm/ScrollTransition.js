import { TransitionBase } from "./TransitionBase";
export class ScrollTransition extends TransitionBase {
    static acceptedEvents = new Set(["scroll"]);
    constructor(srcState, tgtState, action, guard) {
        super(srcState, tgtState, action, guard);
    }
    accept(event) {
        return event.type === "scroll";
    }
    getAcceptedEvents() {
        return ScrollTransition.acceptedEvents;
    }
}
