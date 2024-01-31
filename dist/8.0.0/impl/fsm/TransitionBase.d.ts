import type { EventType } from "../../api/fsm/EventType";
import type { InputState } from "../../api/fsm/InputState";
import type { OutputState } from "../../api/fsm/OutputState";
import type { Transition } from "../../api/fsm/Transition";
import type { VisitorFSM } from "../../api/fsm/VisitorFSM";
export declare abstract class TransitionBase<E extends Event> implements Transition<E> {
    readonly src: OutputState;
    readonly tgt: InputState;
    readonly action: (evt: E) => void;
    readonly guard: (evt: E) => boolean;
    protected constructor(srcState: OutputState, tgtState: InputState, action?: (evt: E) => void, guard?: (evt: E) => boolean);
    execute(event: Event): InputState | undefined;
    abstract accept(event: Event): event is E;
    acceptVisitor(visitor: VisitorFSM): void;
    abstract getAcceptedEvents(): ReadonlySet<EventType>;
    get target(): InputState;
    uninstall(): void;
}
