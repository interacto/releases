import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { WheelDataImpl } from "../WheelDataImpl";
import type { WheelData } from "../../../api/interaction/WheelData";
export declare class WheelFSM extends FSMImpl {
    constructor();
    buildFSM(dataHandler?: WheelFSMHandler): void;
}
interface WheelFSMHandler extends FSMDataHandler {
    initToMoved(event: WheelEvent): void;
}
export declare class Wheel extends InteractionBase<WheelData, WheelDataImpl, WheelFSM> {
    private readonly handler;
    constructor(fsm?: WheelFSM, data?: WheelDataImpl);
}
export {};
