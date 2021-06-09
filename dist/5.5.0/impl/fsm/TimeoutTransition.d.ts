import { TransitionBase } from "./TransitionBase";
import type { OutputState } from "../../api/fsm/OutputState";
import type { InputState } from "../../api/fsm/InputState";
import type { EventType } from "../../api/fsm/EventType";
export declare class TimeoutTransition extends TransitionBase<Event> {
    private readonly timeoutDuration;
    private timeoutThread?;
    private timeouted;
    constructor(srcState: OutputState, tgtState: InputState, timeout: () => number);
    startTimeout(): void;
    stopTimeout(): void;
    accept(event?: Event): event is Event;
    isGuardOK(_event?: Event): boolean;
    execute(event?: Event): InputState | undefined;
    getAcceptedEvents(): ReadonlyArray<EventType>;
}
