import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { KeyDataImpl } from "../KeyDataImpl";
import type { KeyData } from "../../../api/interaction/KeyData";
import type { Logger } from "../../../api/logging/Logger";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
interface KeyDownFSMHandler extends FSMDataHandler {
    onKeyPressed(event: KeyboardEvent): void;
}
export declare class KeyDownFSM extends FSMImpl<KeyDownFSMHandler> {
    private readonly modifiersAccepted;
    constructor(modifierAccepted: boolean, logger: Logger, dataHandler: KeyDownFSMHandler, key?: string);
    reinit(): void;
}
export declare class KeyDown extends InteractionBase<KeyData, KeyDataImpl, KeyDownFSM> {
    constructor(logger: Logger, modifierAccepted: boolean, key?: string, fsm?: KeyDownFSM, name?: string);
}
export {};
