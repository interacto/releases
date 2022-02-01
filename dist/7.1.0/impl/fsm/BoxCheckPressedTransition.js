import { TransitionBase } from "./TransitionBase";
import { isCheckBox } from "./Events";
export class BoxCheckPressedTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(event) {
        return event.currentTarget !== null && isCheckBox(event.currentTarget);
    }
    getAcceptedEvents() {
        return ["input"];
    }
}
