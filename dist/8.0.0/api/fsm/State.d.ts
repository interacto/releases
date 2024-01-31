import type { FSM } from "./FSM";
import type { VisitorFSM } from "./VisitorFSM";
export interface State {
    readonly name: string;
    readonly fsm: FSM;
    checkStartingState(): void;
    uninstall(): void;
    acceptVisitor(visitor: VisitorFSM): void;
}
