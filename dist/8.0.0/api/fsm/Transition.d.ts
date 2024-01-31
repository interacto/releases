import type { EventType } from "./EventType";
import type { InputState } from "./InputState";
import type { VisitorFSM } from "./VisitorFSM";
export interface Transition<E extends Event> {
    readonly target: InputState;
    execute(event: Event): InputState | undefined;
    guard(event: E): boolean;
    accept(event: Event): event is E;
    acceptVisitor(visitor: VisitorFSM): void;
    getAcceptedEvents(): ReadonlySet<EventType>;
    uninstall(): void;
}
