import type { InputState } from "./InputState";
import type { EventType } from "./EventType";
export interface Transition<E extends Event> {
    execute(event: Event): InputState | undefined;
    isGuardOK(event: E): boolean;
    accept(event: Event): event is E;
    getAcceptedEvents(): ReadonlyArray<EventType>;
    getTarget(): InputState;
    uninstall(): void;
}
