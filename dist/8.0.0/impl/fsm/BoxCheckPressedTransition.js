import { isCheckBox } from "./Events";
import { TransitionBase } from "./TransitionBase";
export class BoxCheckPressedTransition extends TransitionBase {
    static acceptedEvents = new Set(["input"]);
    constructor(srcState, tgtState, action, guard) {
        super(srcState, tgtState, action, guard);
    }
    accept(event) {
        return event.currentTarget !== null && isCheckBox(event.currentTarget);
    }
    getAcceptedEvents() {
        return BoxCheckPressedTransition.acceptedEvents;
    }
}
