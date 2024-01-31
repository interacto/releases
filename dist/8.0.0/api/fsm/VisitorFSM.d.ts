import type { ConcurrentFSM } from "./ConcurrentFSM";
import type { FSM } from "./FSM";
import type { InputState } from "./InputState";
import type { OutputState } from "./OutputState";
import type { State } from "./State";
import type { Transition } from "./Transition";
export interface VisitorFSM {
    visitFSM(fsm: FSM): void;
    visitAndConcurrentFSM(fsm: ConcurrentFSM<FSM>): void;
    visitXOrConcurrentFSM(fsm: ConcurrentFSM<FSM>): void;
    visitState(state: OutputState & State): void;
    visitInitState(state: OutputState & State): void;
    visitCancellingState(state: InputState & State): void;
    visitTerminalState(state: InputState & State): void;
    visitTransition(transition: Transition<Event>): void;
    visitTimeoutTransition(transition: Transition<Event>): void;
}
