import type { InputState } from "../../api/fsm/InputState";
import type { OutputState } from "../../api/fsm/OutputState";
import { MouseTransition } from "./MouseTransition";
export declare class ClickTransition extends MouseTransition {
    constructor(srcState: OutputState, tgtState: InputState, action?: (evt?: Event) => void, guard?: (evt: Event) => boolean);
}
