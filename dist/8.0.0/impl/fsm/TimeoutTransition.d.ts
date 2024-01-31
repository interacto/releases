import { TransitionBase } from "./TransitionBase";
import type { EventType } from "../../api/fsm/EventType";
import type { InputState } from "../../api/fsm/InputState";
import type { OutputState } from "../../api/fsm/OutputState";
import type { VisitorFSM } from "../../api/fsm/VisitorFSM";
import type { Logger } from "../../api/logging/Logger";
export declare class TimeoutTransition extends TransitionBase<Event> {
    private readonly timeoutDuration;
    private readonly logger;
    private timeoutThread;
    private timeouted;
    constructor(srcState: OutputState, tgtState: InputState, timeout: () => number, logger?: Logger, action?: (evt: Event) => void);
    startTimeout(): void;
    stopTimeout(): void;
    accept(_event?: Event): _event is Event;
    execute(event?: Event): InputState | undefined;
    getAcceptedEvents(): ReadonlySet<EventType>;
    acceptVisitor(visitor: VisitorFSM): void;
}
