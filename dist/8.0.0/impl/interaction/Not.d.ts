import { ConcurrentInteraction } from "./ConcurrentInteraction";
import { NotFSM } from "../fsm/NotFSM";
import type { Flushable } from "./Flushable";
import type { InteractionBase, InteractionDataImplType } from "./InteractionBase";
import type { FSM } from "../../api/fsm/FSM";
import type { Interaction, InteractionDataType } from "../../api/interaction/Interaction";
import type { InteractionData } from "../../api/interaction/InteractionData";
import type { Logger } from "../../api/logging/Logger";
import type { FSMDataHandler } from "../fsm/FSMDataHandler";
export declare class Not<I extends InteractionBase<DI & InteractionData, DI & DImpl & Flushable, FSM>, N extends Interaction<InteractionData>, DI = InteractionDataType<I>, DImpl = InteractionDataImplType<I>> extends ConcurrentInteraction<DI & InteractionData, DI & DImpl & Flushable, NotFSM<FSMDataHandler>> {
    private readonly mainInteraction;
    private readonly negInteraction;
    constructor(i1: I, not: N, logger: Logger, name: string);
    uninstall(): void;
    reinit(): void;
    fullReinit(): void;
    reinitData(): void;
}
