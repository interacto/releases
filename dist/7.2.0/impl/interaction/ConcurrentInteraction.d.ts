import type { ConcurrentFSM } from "../fsm/ConcurrentFSM";
import type { FSM } from "../../api/fsm/FSM";
import type { OutputState } from "../../api/fsm/OutputState";
import type { InteractionData } from "../../api/interaction/InteractionData";
import { InteractionBase } from "./InteractionBase";
import type { EventType } from "../../api/fsm/EventType";
import type { Flushable } from "./Flushable";
import type { FSMDataHandler } from "../fsm/FSMDataHandler";
import type { Logger } from "../../api/logging/Logger";
export declare abstract class ConcurrentInteraction<D extends InteractionData, DImpl extends D & Flushable, F extends ConcurrentFSM<FSM, FSMDataHandler>> extends InteractionBase<D, DImpl, F> {
    private readonly subscriptions;
    protected constructor(fsm: F, data: DImpl, logger: Logger);
    isRunning(): boolean;
    onNodeUnregistered(node: EventTarget): void;
    onNewNodeRegistered(node: EventTarget): void;
    getCurrentAcceptedEvents(_state?: OutputState): ReadonlyArray<EventType>;
    uninstall(): void;
}
