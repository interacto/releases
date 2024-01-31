import { isHyperLink } from "./Events";
import { TransitionBase } from "./TransitionBase";
export class HyperLinkTransition extends TransitionBase {
    static acceptedEvents = new Set(["click", "auxclick"]);
    constructor(srcState, tgtState, action, guard) {
        super(srcState, tgtState, action, guard);
    }
    accept(event) {
        return event.currentTarget !== null && isHyperLink(event.currentTarget);
    }
    getAcceptedEvents() {
        return HyperLinkTransition.acceptedEvents;
    }
}
