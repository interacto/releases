import { isComboBox } from "./Events";
import { TransitionBase } from "./TransitionBase";
export class ComboBoxTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(event) {
        return event.currentTarget !== null && isComboBox(event.currentTarget);
    }
    getAcceptedEvents() {
        return ["input"];
    }
}
