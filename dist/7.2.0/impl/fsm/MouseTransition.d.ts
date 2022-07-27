import type { OutputState } from "../../api/fsm/OutputState";
import type { InputState } from "../../api/fsm/InputState";
import { TransitionBase } from "./TransitionBase";
import type { EventType, MouseEventType } from "../../api/fsm/EventType";
export declare class MouseTransition extends TransitionBase<MouseEvent> {
    private readonly mouseType;
    constructor(srcState: OutputState, tgtState: InputState, types: MouseEventType | ReadonlyArray<MouseEventType>, action?: (evt: Event) => void, guard?: (evt: Event) => boolean);
    accept(event: Event): event is MouseEvent;
    getAcceptedEvents(): ReadonlyArray<EventType>;
}
