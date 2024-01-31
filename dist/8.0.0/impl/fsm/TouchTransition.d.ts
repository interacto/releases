import { TransitionBase } from "./TransitionBase";
import type { EventType, TouchEventType } from "../../api/fsm/EventType";
import type { InputState } from "../../api/fsm/InputState";
import type { OutputState } from "../../api/fsm/OutputState";
export declare class TouchTransition extends TransitionBase<TouchEvent> {
    private readonly acceptedEvents;
    constructor(srcState: OutputState, tgtState: InputState, eventType: TouchEventType, action?: (evt: TouchEvent) => void, guard?: (evt: TouchEvent) => boolean);
    accept(evt: Event): evt is TouchEvent;
    getAcceptedEvents(): ReadonlySet<EventType>;
}
