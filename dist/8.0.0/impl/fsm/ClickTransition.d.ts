import { MouseTransition } from "./MouseTransition";
import type { InputState } from "../../api/fsm/InputState";
import type { OutputState } from "../../api/fsm/OutputState";
export declare class ClickTransition extends MouseTransition {
    constructor(srcState: OutputState, tgtState: InputState, action?: (evt: MouseEvent) => void, guard?: (evt: MouseEvent) => boolean);
}
