import { InteractionBase } from "./InteractionBase";
import { ThenDataImpl } from "./ThenDataImpl";
import type { Flushable } from "./Flushable";
import type { FSM } from "../../api/fsm/FSM";
import type { Interaction, InteractionsDataTypes } from "../../api/interaction/Interaction";
import type { InteractionData } from "../../api/interaction/InteractionData";
import type { ThenData } from "../../api/interaction/ThenData";
import type { Logger } from "../../api/logging/Logger";
export declare class Then<IX extends Array<Interaction<InteractionData>>, DX extends Array<InteractionData> = InteractionsDataTypes<IX>> extends InteractionBase<ThenData<DX>, ThenDataImpl<Array<Flushable> & DX>, FSM> {
    private readonly ix;
    constructor(ix: IX, logger: Logger);
    uninstall(): void;
    reinit(): void;
    fullReinit(): void;
    reinitData(): void;
}
