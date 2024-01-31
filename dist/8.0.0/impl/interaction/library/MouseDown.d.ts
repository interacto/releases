import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
import type { PointData } from "../../../api/interaction/PointData";
import type { Logger } from "../../../api/logging/Logger";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
declare class MouseDownFSM extends FSMImpl<MouseDownFSMHandler> {
    constructor(logger: Logger, dataHandler: MouseDownFSMHandler);
}
interface MouseDownFSMHandler extends FSMDataHandler {
    initToPress(event: MouseEvent): void;
}
export declare class MouseDown extends InteractionBase<PointData, PointDataImpl, MouseDownFSM> {
    constructor(logger: Logger, name?: string);
}
export {};
