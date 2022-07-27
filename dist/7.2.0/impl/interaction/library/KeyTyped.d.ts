import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import type { KeyData } from "../../../api/interaction/KeyData";
import { FSMImpl } from "../../fsm/FSMImpl";
import { KeyDataImpl } from "../KeyDataImpl";
import { InteractionBase } from "../InteractionBase";
import type { Logger } from "../../../api/logging/Logger";
export declare class KeyTypedFSM extends FSMImpl<KeyTypedFSMHandler> {
    private checkKey?;
    constructor(logger: Logger, dataHandler: KeyTypedFSMHandler);
    reinit(): void;
}
interface KeyTypedFSMHandler extends FSMDataHandler {
    onKeyTyped(event: KeyboardEvent): void;
}
export declare class KeyTyped extends InteractionBase<KeyData, KeyDataImpl, KeyTypedFSM> {
    constructor(logger: Logger);
}
export {};
