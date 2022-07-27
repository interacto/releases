import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import type { KeyData } from "../../../api/interaction/KeyData";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { KeyDataImpl } from "../KeyDataImpl";
import type { Logger } from "../../../api/logging/Logger";
export declare class KeyUpFSM extends FSMImpl<KeyUpFSMHandler> {
    private readonly modifiersAccepted;
    constructor(modifierAccepted: boolean, logger: Logger, dataHandler: KeyUpFSMHandler);
}
interface KeyUpFSMHandler extends FSMDataHandler {
    onKeyUp(event: KeyboardEvent): void;
}
export declare class KeyUp extends InteractionBase<KeyData, KeyDataImpl, KeyUpFSM> {
    constructor(logger: Logger, modifierAccepted: boolean, fsm?: KeyUpFSM);
}
export {};
