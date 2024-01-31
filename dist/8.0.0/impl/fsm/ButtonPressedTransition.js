import { isButton } from "./Events";
import { TransitionBase } from "./TransitionBase";
export class ButtonPressedTransition extends TransitionBase {
    static acceptedEvents = new Set(["click", "auxclick"]);
    constructor(srcState, tgtState, action, guard) {
        super(srcState, tgtState, action, guard);
    }
    accept(evt) {
        return evt.currentTarget !== null && isButton(evt.currentTarget);
    }
    getAcceptedEvents() {
        return ButtonPressedTransition.acceptedEvents;
    }
}
