import { isDatePicker } from "./Events";
import { TransitionBase } from "./TransitionBase";
export class DatePickedTransition extends TransitionBase {
    static acceptedEvents = new Set(["input"]);
    constructor(srcState, tgtState, action, guard) {
        super(srcState, tgtState, action, guard);
    }
    accept(event) {
        return event.currentTarget !== null && isDatePicker(event.currentTarget);
    }
    getAcceptedEvents() {
        return DatePickedTransition.acceptedEvents;
    }
}
