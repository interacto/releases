import { OutputStateBase } from "./OutputStateBase";
import type { FSM } from "../../api/fsm/FSM";
import type { InputState } from "../../api/fsm/InputState";
import type { VisitorFSM } from "../../api/fsm/VisitorFSM";
export declare class StdState extends OutputStateBase implements InputState {
    constructor(stateMachine: FSM, stateName: string);
    enter(): void;
    exit(): void;
    acceptVisitor(visitor: VisitorFSM): void;
}
