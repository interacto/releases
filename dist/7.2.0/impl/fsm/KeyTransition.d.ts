import type { InputState } from "../../api/fsm/InputState";
import type { OutputState } from "../../api/fsm/OutputState";
import { TransitionBase } from "./TransitionBase";
import type { EventType, KeyEventType } from "../../api/fsm/EventType";
export declare class KeyTransition extends TransitionBase<KeyboardEvent> {
    private readonly keyType;
    constructor(srcState: OutputState, tgtState: InputState, keyType: KeyEventType, action?: (evt: Event) => void, guard?: (evt: Event) => boolean);
    accept(event: Event): event is KeyboardEvent;
    getAcceptedEvents(): ReadonlyArray<EventType>;
}
