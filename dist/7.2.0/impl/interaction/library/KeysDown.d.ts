import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import type { KeysData } from "../../../api/interaction/KeysData";
import { FSMImpl } from "../../fsm/FSMImpl";
import { KeysDataImpl } from "../KeysDataImpl";
import { InteractionBase } from "../InteractionBase";
import type { Logger } from "../../../api/logging/Logger";
export declare class KeysDownFSM extends FSMImpl<KeysDownFSMHandler> {
    private readonly currentCodes;
    constructor(logger: Logger, dataHandler: KeysDownFSMHandler);
    reinit(): void;
}
interface KeysDownFSMHandler extends FSMDataHandler {
    onKeyPressed(event: KeyboardEvent): void;
}
export declare class KeysDown extends InteractionBase<KeysData, KeysDataImpl, KeysDownFSM> {
    constructor(logger: Logger);
}
export {};
