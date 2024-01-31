import { isSpinner } from "./Events";
import { TransitionBase } from "./TransitionBase";
export class SpinnerChangedTransition extends TransitionBase {
    static acceptedEvents = new Set(["input"]);
    constructor(srcState, tgtState, action, guard) {
        super(srcState, tgtState, action, guard);
    }
    accept(event) {
        return event.currentTarget !== null && isSpinner(event.currentTarget);
    }
    getAcceptedEvents() {
        return SpinnerChangedTransition.acceptedEvents;
    }
}
