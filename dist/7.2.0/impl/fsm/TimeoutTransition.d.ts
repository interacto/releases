import { TransitionBase } from "./TransitionBase";
import type { OutputState } from "../../api/fsm/OutputState";
import type { InputState } from "../../api/fsm/InputState";
import type { EventType } from "../../api/fsm/EventType";
import type { Logger } from "../../api/logging/Logger";
export declare class TimeoutTransition extends TransitionBase<Event> {
    private readonly timeoutDuration;
    private readonly logger?;
    private timeoutThread?;
    private timeouted;
    constructor(srcState: OutputState, tgtState: InputState, timeout: () => number, logger?: Logger, action?: (evt: Event) => void);
    startTimeout(): void;
    stopTimeout(): void;
    accept(event?: Event): event is Event;
    execute(event?: Event): InputState | undefined;
    getAcceptedEvents(): ReadonlyArray<EventType>;
}
