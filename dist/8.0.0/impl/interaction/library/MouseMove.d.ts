import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
import type { PointData } from "../../../api/interaction/PointData";
import type { Logger } from "../../../api/logging/Logger";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
interface MouseMoveFSMHandler extends FSMDataHandler {
    onMove(event: MouseEvent): void;
}
export declare class MouseMoveFSM extends FSMImpl<MouseMoveFSMHandler> {
    constructor(logger: Logger, dataHandler: MouseMoveFSMHandler);
}
export declare class MouseMove extends InteractionBase<PointData, PointDataImpl, MouseMoveFSM> {
    constructor(logger: Logger, name?: string);
}
export {};
