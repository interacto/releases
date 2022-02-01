import type { InputState } from "../../api/fsm/InputState";
import type { OutputState } from "../../api/fsm/OutputState";
import { KeyDownTransition } from "./KeyDownTransition";
export declare class EscapeKeyPressureTransition extends KeyDownTransition {
    constructor(srcState: OutputState, tgtState: InputState);
    isGuardOK(event: KeyboardEvent): boolean;
}
