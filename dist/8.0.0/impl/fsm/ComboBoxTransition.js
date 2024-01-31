import { isComboBox } from "./Events";
import { TransitionBase } from "./TransitionBase";
export class ComboBoxTransition extends TransitionBase {
    static acceptedEvents = new Set(["input"]);
    constructor(srcState, tgtState, action, guard) {
        super(srcState, tgtState, action, guard);
    }
    accept(event) {
        return event.currentTarget !== null && isComboBox(event.currentTarget);
    }
    getAcceptedEvents() {
        return ComboBoxTransition.acceptedEvents;
    }
}
