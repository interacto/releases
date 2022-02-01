import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import type { KeysData } from "../../../api/interaction/KeysData";
import { FSMImpl } from "../../fsm/FSMImpl";
import { KeysDataImpl } from "../KeysDataImpl";
import { InteractionBase } from "../InteractionBase";
export declare class KeysDownFSM extends FSMImpl {
    private readonly currentCodes;
    constructor();
    buildFSM(dataHandler?: KeysDownFSMHandler): void;
    reinit(): void;
}
interface KeysDownFSMHandler extends FSMDataHandler {
    onKeyPressed(event: KeyboardEvent): void;
}
export declare class KeysDown extends InteractionBase<KeysData, KeysDataImpl, KeysDownFSM> {
    private readonly handler;
    constructor();
}
export {};
