import { TransitionBase } from "./TransitionBase";
import { isCheckBox } from "./Events";
export class BoxCheckPressedTransition extends TransitionBase {
    constructor(srcState, tgtState, action, guard) {
        super(srcState, tgtState, action, guard);
    }
    accept(event) {
        return event.currentTarget !== null && isCheckBox(event.currentTarget);
    }
    getAcceptedEvents() {
        return ["input"];
    }
}
