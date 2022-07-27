import type { InputState } from "../../api/fsm/InputState";
import type { OutputState } from "../../api/fsm/OutputState";
import { KeyTransition } from "./KeyTransition";
export declare class EscapeKeyPressureTransition extends KeyTransition {
    constructor(srcState: OutputState, tgtState: InputState, action?: (evt: Event) => void);
}
