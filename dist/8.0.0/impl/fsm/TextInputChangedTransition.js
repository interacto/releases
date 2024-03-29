import { isTextInput } from "./Events";
import { TransitionBase } from "./TransitionBase";
export class TextInputChangedTransition extends TransitionBase {
    static acceptedEvents = new Set(["input"]);
    constructor(srcState, tgtState, action, guard) {
        super(srcState, tgtState, action, guard);
    }
    accept(event) {
        return event.currentTarget !== null && isTextInput(event.currentTarget);
    }
    getAcceptedEvents() {
        return TextInputChangedTransition.acceptedEvents;
    }
}
