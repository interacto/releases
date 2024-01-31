import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { KeysDataImpl } from "../KeysDataImpl";
import type { KeysData } from "../../../api/interaction/KeysData";
import type { Logger } from "../../../api/logging/Logger";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
interface KeysDownFSMHandler extends FSMDataHandler {
    onKeyPressed(event: KeyboardEvent): void;
}
export declare class KeysDownFSM extends FSMImpl<KeysDownFSMHandler> {
    private readonly currentCodes;
    constructor(logger: Logger, dataHandler: KeysDownFSMHandler);
    reinit(): void;
}
export declare class KeysDown extends InteractionBase<KeysData, KeysDataImpl, KeysDownFSM> {
    constructor(logger: Logger, name?: string);
}
export {};
