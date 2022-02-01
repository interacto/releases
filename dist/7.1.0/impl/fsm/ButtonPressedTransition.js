import { isButton } from "./Events";
import { TransitionBase } from "./TransitionBase";
export class ButtonPressedTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(e) {
        return e.currentTarget !== null && isButton(e.currentTarget);
    }
    getAcceptedEvents() {
        return ["click", "auxclick"];
    }
}
