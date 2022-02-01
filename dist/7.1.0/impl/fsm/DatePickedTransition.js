import { isDatePicker } from "./Events";
import { TransitionBase } from "./TransitionBase";
export class DatePickedTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(event) {
        return event.currentTarget !== null && isDatePicker(event.currentTarget);
    }
    getAcceptedEvents() {
        return ["input"];
    }
}
