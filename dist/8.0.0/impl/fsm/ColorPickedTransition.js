import { isColorChoice } from "./Events";
import { TransitionBase } from "./TransitionBase";
export class ColorPickedTransition extends TransitionBase {
    static acceptedEvents = new Set(["input"]);
    constructor(srcState, tgtState, action, guard) {
        super(srcState, tgtState, action, guard);
    }
    accept(event) {
        return event.currentTarget !== null && isColorChoice(event.currentTarget);
    }
    getAcceptedEvents() {
        return ColorPickedTransition.acceptedEvents;
    }
}
