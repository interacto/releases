import type { State } from "../../api/fsm/State";
import type { FSM } from "../../api/fsm/FSM";
export declare abstract class StateBase implements State {
    protected readonly fsm: FSM;
    protected readonly name: string;
    protected constructor(stateMachine: FSM, stateName: string);
    checkStartingState(): void;
    getName(): string;
    getFSM(): FSM;
    uninstall(): void;
}
