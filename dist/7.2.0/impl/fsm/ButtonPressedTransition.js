import { isButton } from "./Events";
import { TransitionBase } from "./TransitionBase";
export class ButtonPressedTransition extends TransitionBase {
    constructor(srcState, tgtState, action, guard) {
        super(srcState, tgtState, action, guard);
    }
    accept(e) {
        return e.currentTarget !== null && isButton(e.currentTarget);
    }
    getAcceptedEvents() {
        return ["click", "auxclick"];
    }
}
