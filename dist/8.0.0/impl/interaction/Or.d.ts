import { ConcurrentInteraction } from "./ConcurrentInteraction";
import { ConcurrentXOrFSM } from "../fsm/ConcurrentXOrFSM";
import type { Flushable } from "./Flushable";
import type { InteractionBase, InteractionDataImplType } from "./InteractionBase";
import type { FSM } from "../../api/fsm/FSM";
import type { InteractionDataType } from "../../api/interaction/Interaction";
import type { InteractionData } from "../../api/interaction/InteractionData";
import type { Logger } from "../../api/logging/Logger";
import type { FSMDataHandler } from "../fsm/FSMDataHandler";
export declare class Or<I1 extends InteractionBase<D1, D1Impl, FSM>, I2 extends InteractionBase<D2, D2Impl, FSM>, D1 extends InteractionData = InteractionDataType<I1>, D2 extends InteractionData = InteractionDataType<I2>, D1Impl extends D1 & Flushable = InteractionDataImplType<I1>, D2Impl extends D2 & Flushable = InteractionDataImplType<I2>> extends ConcurrentInteraction<D1 | D2, D1Impl | D2Impl, ConcurrentXOrFSM<FSM, FSMDataHandler>> {
    private readonly i1;
    private readonly i2;
    constructor(i1: I1, i2: I2, logger: Logger);
    get data(): D1 | D2;
    uninstall(): void;
    reinit(): void;
    fullReinit(): void;
    reinitData(): void;
}
