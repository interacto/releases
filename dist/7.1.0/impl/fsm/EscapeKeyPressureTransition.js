import { KeyCode } from "./Events";
import { KeyDownTransition } from "./KeyDownTransition";
export class EscapeKeyPressureTransition extends KeyDownTransition {
    constructor(srcState, tgtState) {
        super(srcState, tgtState);
    }
    isGuardOK(event) {
        return event.code === "Escape" || event.code === String(KeyCode.escape);
    }
}
