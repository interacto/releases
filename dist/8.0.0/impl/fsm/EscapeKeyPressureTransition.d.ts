import { KeyTransition } from "./KeyTransition";
import type { InputState } from "../../api/fsm/InputState";
import type { OutputState } from "../../api/fsm/OutputState";
export declare class EscapeKeyPressureTransition extends KeyTransition {
    constructor(srcState: OutputState, tgtState: InputState, action?: (evt: KeyboardEvent) => void);
}
