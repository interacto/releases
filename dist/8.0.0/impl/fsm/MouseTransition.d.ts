import { TransitionBase } from "./TransitionBase";
import type { EventType, MouseEventType } from "../../api/fsm/EventType";
import type { InputState } from "../../api/fsm/InputState";
import type { OutputState } from "../../api/fsm/OutputState";
export declare class MouseTransition extends TransitionBase<MouseEvent> {
    private readonly acceptedEvents;
    constructor(srcState: OutputState, tgtState: InputState, types: MouseEventType | ReadonlyArray<MouseEventType>, action?: (evt: MouseEvent) => void, guard?: (evt: MouseEvent) => boolean);
    accept(event: Event): event is MouseEvent;
    getAcceptedEvents(): ReadonlySet<EventType>;
}
