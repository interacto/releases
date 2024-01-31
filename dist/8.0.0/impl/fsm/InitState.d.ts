import { OutputStateBase } from "./OutputStateBase";
import type { FSM } from "../../api/fsm/FSM";
import type { VisitorFSM } from "../../api/fsm/VisitorFSM";
export declare class InitState extends OutputStateBase {
    constructor(stateMachine: FSM, stateName: string);
    exit(): void;
    acceptVisitor(visitor: VisitorFSM): void;
}
