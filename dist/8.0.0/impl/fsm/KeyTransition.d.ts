import { TransitionBase } from "./TransitionBase";
import type { EventType, KeyEventType } from "../../api/fsm/EventType";
import type { InputState } from "../../api/fsm/InputState";
import type { OutputState } from "../../api/fsm/OutputState";
export declare class KeyTransition extends TransitionBase<KeyboardEvent> {
    private readonly acceptedEvents;
    constructor(srcState: OutputState, tgtState: InputState, keyType: KeyEventType, action?: (evt: KeyboardEvent) => void, guard?: (evt: KeyboardEvent) => boolean);
    accept(event: Event): event is KeyboardEvent;
    getAcceptedEvents(): ReadonlySet<EventType>;
}
