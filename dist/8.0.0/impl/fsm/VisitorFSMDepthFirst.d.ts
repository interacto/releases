import type { ConcurrentFSM } from "../../api/fsm/ConcurrentFSM";
import type { FSM } from "../../api/fsm/FSM";
import type { InputState } from "../../api/fsm/InputState";
import type { OutputState } from "../../api/fsm/OutputState";
import type { State } from "../../api/fsm/State";
import type { Transition } from "../../api/fsm/Transition";
import type { VisitorFSM } from "../../api/fsm/VisitorFSM";
export declare class VisitorFSMDepthFirst implements VisitorFSM {
    private readonly visited;
    constructor();
    visitAndConcurrentFSM(fsm: ConcurrentFSM<FSM>): void;
    visitXOrConcurrentFSM(fsm: ConcurrentFSM<FSM>): void;
    visitInitState(state: OutputState & State): void;
    visitState(state: OutputState & State): void;
    visitCancellingState(_state: InputState & State): void;
    visitTerminalState(_state: InputState & State): void;
    visitFSM(fsm: FSM): void;
    visitTransition(transition: Transition<Event>): void;
    visitTimeoutTransition(transition: Transition<Event>): void;
    clear(): void;
    protected alreadyVisited(state: State): boolean;
}
