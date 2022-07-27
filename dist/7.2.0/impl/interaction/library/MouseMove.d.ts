import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import type { PointData } from "../../../api/interaction/PointData";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
import type { Logger } from "../../../api/logging/Logger";
export declare class MouseMoveFSM extends FSMImpl<MouseMoveFSMHandler> {
    constructor(logger: Logger, dataHandler: MouseMoveFSMHandler);
}
interface MouseMoveFSMHandler extends FSMDataHandler {
    onMove(event: MouseEvent): void;
}
export declare class MouseMove extends InteractionBase<PointData, PointDataImpl, MouseMoveFSM> {
    constructor(logger: Logger);
}
export {};
