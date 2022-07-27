import type { OutputState } from "../../api/fsm/OutputState";
import type { InputState } from "../../api/fsm/InputState";
import { TransitionBase } from "./TransitionBase";
import type { EventType, TouchEventType } from "../../api/fsm/EventType";
export declare class TouchTransition extends TransitionBase<TouchEvent> {
    private readonly eventType;
    constructor(srcState: OutputState, tgtState: InputState, eventType: TouchEventType, action?: (evt: Event) => void, guard?: (evt: Event) => boolean);
    accept(evt: Event): evt is TouchEvent;
    getAcceptedEvents(): ReadonlyArray<EventType>;
}
