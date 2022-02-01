import { isColorChoice } from "./Events";
import { TransitionBase } from "./TransitionBase";
export class ColorPickedTransition extends TransitionBase {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    accept(event) {
        return event.currentTarget !== null && isColorChoice(event.currentTarget);
    }
    getAcceptedEvents() {
        return ["input"];
    }
}
