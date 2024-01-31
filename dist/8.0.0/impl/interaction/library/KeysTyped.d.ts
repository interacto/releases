import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { KeysDataImpl } from "../KeysDataImpl";
import type { KeysData } from "../../../api/interaction/KeysData";
import type { Logger } from "../../../api/logging/Logger";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
interface KeyTypedFSMHandler extends FSMDataHandler {
    onKeyTyped(event: Event): void;
}
export declare class KeysTypedFSM extends FSMImpl<KeyTypedFSMHandler> {
    private static readonly timeGap;
    private static readonly timeGapSupplier;
    private static getTimeGap;
    constructor(logger: Logger, dataHandler: KeyTypedFSMHandler);
}
export declare class KeysTyped extends InteractionBase<KeysData, KeysDataImpl, KeysTypedFSM> {
    constructor(logger: Logger, name?: string);
}
export {};
