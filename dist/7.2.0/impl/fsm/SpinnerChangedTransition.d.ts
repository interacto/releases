import type { OutputState } from "../../api/fsm/OutputState";
import type { InputState } from "../../api/fsm/InputState";
import { TransitionBase } from "./TransitionBase";
import type { EventType } from "../../api/fsm/EventType";
export declare class SpinnerChangedTransition extends TransitionBase<Event> {
    constructor(srcState: OutputState, tgtState: InputState, action?: (evt: Event) => void, guard?: (evt: Event) => boolean);
    accept(event: Event): event is Event;
    getAcceptedEvents(): ReadonlyArray<EventType>;
}
