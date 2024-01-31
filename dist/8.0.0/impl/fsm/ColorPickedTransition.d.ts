import { TransitionBase } from "./TransitionBase";
import type { EventType } from "../../api/fsm/EventType";
import type { InputState } from "../../api/fsm/InputState";
import type { OutputState } from "../../api/fsm/OutputState";
export declare class ColorPickedTransition extends TransitionBase<Event> {
    private static readonly acceptedEvents;
    constructor(srcState: OutputState, tgtState: InputState, action?: (evt: Event) => void, guard?: (evt: Event) => boolean);
    accept(event: Event): event is Event;
    getAcceptedEvents(): ReadonlySet<EventType>;
}
