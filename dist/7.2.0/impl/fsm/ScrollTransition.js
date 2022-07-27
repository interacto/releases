import { TransitionBase } from "./TransitionBase";
export class ScrollTransition extends TransitionBase {
    constructor(srcState, tgtState, action, guard) {
        super(srcState, tgtState, action, guard);
    }
    accept(event) {
        return event.type === "scroll";
    }
    getAcceptedEvents() {
        return ["scroll"];
    }
}
