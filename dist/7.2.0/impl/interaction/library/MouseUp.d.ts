import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import type { PointData } from "../../../api/interaction/PointData";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
import type { Logger } from "../../../api/logging/Logger";
export declare class MouseUpFSM extends FSMImpl<MouseUpFSMHandler> {
    constructor(logger: Logger, dataHandler: MouseUpFSMHandler);
}
interface MouseUpFSMHandler extends FSMDataHandler {
    initToPress(event: MouseEvent): void;
}
export declare class MouseUp extends InteractionBase<PointData, PointDataImpl, MouseUpFSM> {
    constructor(logger: Logger);
}
export {};
