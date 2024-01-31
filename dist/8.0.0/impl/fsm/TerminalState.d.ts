import { StateBase } from "./StateBase";
import type { FSM } from "../../api/fsm/FSM";
import type { InputState } from "../../api/fsm/InputState";
import type { VisitorFSM } from "../../api/fsm/VisitorFSM";
export declare class TerminalState extends StateBase implements InputState {
    constructor(stateMachine: FSM, stateName: string);
    enter(): void;
    acceptVisitor(visitor: VisitorFSM): void;
}
