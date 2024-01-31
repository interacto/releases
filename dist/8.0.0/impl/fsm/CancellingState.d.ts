import { StateBase } from "./StateBase";
import type { FSM } from "../../api/fsm/FSM";
import type { InputState } from "../../api/fsm/InputState";
import type { VisitorFSM } from "../../api/fsm/VisitorFSM";
export declare class CancellingState extends StateBase implements InputState {
    constructor(stateMachine: FSM, stateName: string);
    enter(): void;
    uninstall(): void;
    acceptVisitor(visitor: VisitorFSM): void;
}
