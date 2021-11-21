import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import type { PointData } from "../../../api/interaction/PointData";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
export declare class MouseUpFSM extends FSMImpl {
    buildFSM(dataHandler?: MouseUpFSMHandler): void;
}
interface MouseUpFSMHandler extends FSMDataHandler {
    initToPress(event: MouseEvent): void;
}
export declare class MouseUp extends InteractionBase<PointData, PointDataImpl, MouseUpFSM> {
    private readonly handler;
    constructor();
}
export {};
