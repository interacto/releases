import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import type { KeyData } from "../../../api/interaction/KeyData";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { KeyDataImpl } from "../KeyDataImpl";
export declare class KeyDownFSM extends FSMImpl {
    private readonly modifiersAccepted;
    constructor(modifierAccepted: boolean);
    buildFSM(dataHandler?: KeyDownFSMHandler): void;
    reinit(): void;
}
interface KeyDownFSMHandler extends FSMDataHandler {
    onKeyPressed(event: KeyboardEvent): void;
}
export declare class KeyDown extends InteractionBase<KeyData, KeyDataImpl, KeyDownFSM> {
    private readonly handler;
    constructor(modifierAccepted: boolean, fsm?: KeyDownFSM);
}
export {};
