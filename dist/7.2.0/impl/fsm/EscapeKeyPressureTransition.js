import { KeyCode } from "./Events";
import { KeyTransition } from "./KeyTransition";
export class EscapeKeyPressureTransition extends KeyTransition {
    constructor(srcState, tgtState, action) {
        super(srcState, tgtState, "keydown", action, (evt) => evt.code === "Escape" || evt.code === String(KeyCode.escape));
    }
}
