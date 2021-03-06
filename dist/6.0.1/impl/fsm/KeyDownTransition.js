import { isKeyDownEvent } from "./Events";
import { TransitionBase } from "./TransitionBase";
export class KeyDownTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(event) {
        return isKeyDownEvent(event);
    }
    getAcceptedEvents() {
        return ["keydown"];
    }
}
