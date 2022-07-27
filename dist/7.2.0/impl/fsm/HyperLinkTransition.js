import { isHyperLink } from "./Events";
import { TransitionBase } from "./TransitionBase";
export class HyperLinkTransition extends TransitionBase {
    constructor(srcState, tgtState, action, guard) {
        super(srcState, tgtState, action, guard);
    }
    accept(event) {
        return event.currentTarget !== null && isHyperLink(event.currentTarget);
    }
    getAcceptedEvents() {
        return ["click", "auxclick"];
    }
}
