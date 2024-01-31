import { InteractionBase } from "./InteractionBase";
import type { Flushable } from "./Flushable";
import type { ConcurrentFSM } from "../../api/fsm/ConcurrentFSM";
import type { EventType } from "../../api/fsm/EventType";
import type { FSM } from "../../api/fsm/FSM";
import type { OutputState } from "../../api/fsm/OutputState";
import type { InteractionData } from "../../api/interaction/InteractionData";
import type { Logger } from "../../api/logging/Logger";
export declare abstract class ConcurrentInteraction<D extends InteractionData, DImpl extends D & Flushable, F extends ConcurrentFSM<FSM>> extends InteractionBase<D, DImpl, F> {
    private readonly subscriptions;
    protected constructor(fsm: F, data: DImpl, logger: Logger, name: string);
    isRunning(): boolean;
    onNodeUnregistered(node: EventTarget): void;
    onNewNodeRegistered(node: EventTarget): void;
    getCurrentAcceptedEvents(_state?: OutputState): ReadonlyArray<EventType>;
    uninstall(): void;
}
