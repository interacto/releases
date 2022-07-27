import { TransitionBase } from "./TransitionBase";
export class KeyTransition extends TransitionBase {
    constructor(srcState, tgtState, keyType, action, guard) {
        super(srcState, tgtState, action, guard);
        this.keyType = keyType;
    }
    accept(event) {
        return event instanceof KeyboardEvent && this.getAcceptedEvents().includes(event.type);
    }
    getAcceptedEvents() {
        return [this.keyType];
    }
}
