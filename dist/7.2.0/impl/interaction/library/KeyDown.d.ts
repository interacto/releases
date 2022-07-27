import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import type { KeyData } from "../../../api/interaction/KeyData";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { KeyDataImpl } from "../KeyDataImpl";
import type { Logger } from "../../../api/logging/Logger";
export declare class KeyDownFSM extends FSMImpl<KeyDownFSMHandler> {
    private readonly modifiersAccepted;
    constructor(modifierAccepted: boolean, logger: Logger, dataHandler: KeyDownFSMHandler);
    reinit(): void;
}
interface KeyDownFSMHandler extends FSMDataHandler {
    onKeyPressed(event: KeyboardEvent): void;
}
export declare class KeyDown extends InteractionBase<KeyData, KeyDataImpl, KeyDownFSM> {
    constructor(logger: Logger, modifierAccepted: boolean, fsm?: KeyDownFSM);
}
export {};
