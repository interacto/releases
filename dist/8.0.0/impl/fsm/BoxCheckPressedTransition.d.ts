import { TransitionBase } from "./TransitionBase";
import type { EventType } from "../../api/fsm/EventType";
import type { InputState } from "../../api/fsm/InputState";
import type { OutputState } from "../../api/fsm/OutputState";
export declare class BoxCheckPressedTransition extends TransitionBase<InputEvent> {
    private static readonly acceptedEvents;
    constructor(srcState: OutputState, tgtState: InputState, action?: (evt: InputEvent) => void, guard?: (evt: InputEvent) => boolean);
    accept(event: Event): event is InputEvent;
    getAcceptedEvents(): ReadonlySet<EventType>;
}
