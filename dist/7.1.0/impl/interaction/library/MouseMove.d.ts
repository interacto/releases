import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import type { PointData } from "../../../api/interaction/PointData";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
export declare class MouseMoveFSM extends FSMImpl {
    constructor();
    buildFSM(dataHandler?: MouseMoveFSMHandler): void;
}
interface MouseMoveFSMHandler extends FSMDataHandler {
    onMove(event: MouseEvent): void;
}
export declare class MouseMove extends InteractionBase<PointData, PointDataImpl, MouseMoveFSM> {
    private readonly handler;
    constructor();
}
export {};
