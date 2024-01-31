import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { KeyDataImpl } from "../KeyDataImpl";
import type { KeyData } from "../../../api/interaction/KeyData";
import type { Logger } from "../../../api/logging/Logger";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
interface KeyTypedFSMHandler extends FSMDataHandler {
    onKeyTyped(event: KeyboardEvent): void;
}
export declare class KeyTypedFSM extends FSMImpl<KeyTypedFSMHandler> {
    private checkKey;
    constructor(logger: Logger, dataHandler: KeyTypedFSMHandler, key?: string);
    reinit(): void;
}
export declare class KeyTyped extends InteractionBase<KeyData, KeyDataImpl, KeyTypedFSM> {
    constructor(logger: Logger, key?: string, name?: string);
}
export {};
