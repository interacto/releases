import type { State } from "./State";
import type { Transition } from "./Transition";
export interface OutputState extends State {
    exit(): void;
    process(event: Event): boolean;
    getTransitions(): ReadonlyArray<Transition<Event>>;
    addTransition(tr: Transition<Event>): void;
}
export declare function isOutputStateType(obj: State | undefined): obj is OutputState;
