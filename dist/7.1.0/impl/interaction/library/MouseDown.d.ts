import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import type { PointData } from "../../../api/interaction/PointData";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
export declare class MouseDownFSM extends FSMImpl {
    buildFSM(dataHandler?: MouseDownFSMHandler): void;
}
interface MouseDownFSMHandler extends FSMDataHandler {
    initToPress(event: MouseEvent): void;
}
export declare class MouseDown extends InteractionBase<PointData, PointDataImpl, MouseDownFSM> {
    private readonly handler;
    constructor();
}
export {};
