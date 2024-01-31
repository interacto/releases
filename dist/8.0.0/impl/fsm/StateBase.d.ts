import type { FSM } from "../../api/fsm/FSM";
import type { State } from "../../api/fsm/State";
import type { VisitorFSM } from "../../api/fsm/VisitorFSM";
export declare abstract class StateBase implements State {
    readonly fsm: FSM;
    readonly name: string;
    protected constructor(stateMachine: FSM, stateName: string);
    checkStartingState(): void;
    uninstall(): void;
    abstract acceptVisitor(visitor: VisitorFSM): void;
}
