import type { OutputState } from "../../api/fsm/OutputState";
import type { InputState } from "../../api/fsm/InputState";
import { TransitionBase } from "./TransitionBase";
import type { EventType } from "../../api/fsm/EventType";
export declare class MouseMoveTransition extends TransitionBase<MouseEvent> {
    constructor(srcState: OutputState, tgtState: InputState);
    accept(event: Event): event is MouseEvent;
    getAcceptedEvents(): ReadonlyArray<EventType>;
}
