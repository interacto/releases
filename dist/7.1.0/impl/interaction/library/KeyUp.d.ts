import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import type { KeyData } from "../../../api/interaction/KeyData";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { KeyDataImpl } from "../KeyDataImpl";
export declare class KeyUpFSM extends FSMImpl {
    private readonly modifiersAccepted;
    constructor(modifierAccepted: boolean);
    buildFSM(dataHandler?: KeyUpFSMHandler): void;
    reinit(): void;
}
interface KeyUpFSMHandler extends FSMDataHandler {
    onKeyUp(event: KeyboardEvent): void;
}
export declare class KeyUp extends InteractionBase<KeyData, KeyDataImpl, KeyUpFSM> {
    private readonly handler;
    constructor(modifierAccepted: boolean, fsm?: KeyUpFSM);
}
export {};
