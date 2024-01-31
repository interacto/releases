import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { WheelDataImpl } from "../WheelDataImpl";
import type { WheelData } from "../../../api/interaction/WheelData";
import type { Logger } from "../../../api/logging/Logger";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
interface WheelFSMHandler extends FSMDataHandler {
    initToMoved(event: WheelEvent): void;
}
export declare class WheelFSM extends FSMImpl<WheelFSMHandler> {
    constructor(logger: Logger, dataHandler: WheelFSMHandler);
}
export declare class Wheel extends InteractionBase<WheelData, WheelDataImpl, WheelFSM> {
    constructor(logger: Logger, fsm?: WheelFSM, data?: WheelDataImpl, name?: string);
}
export {};
