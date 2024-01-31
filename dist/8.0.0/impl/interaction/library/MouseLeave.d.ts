import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
import type { PointData } from "../../../api/interaction/PointData";
import type { Logger } from "../../../api/logging/Logger";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
interface MouseLeaveFSMHandler extends FSMDataHandler {
    onExit(event: MouseEvent): void;
}
export declare class MouseLeaveFSM extends FSMImpl<MouseLeaveFSMHandler> {
    private readonly withBubbling;
    constructor(withBubbling: boolean, logger: Logger, dataHandler: MouseLeaveFSMHandler);
}
export declare class MouseLeave extends InteractionBase<PointData, PointDataImpl, MouseLeaveFSM> {
    constructor(withBubbling: boolean, logger: Logger, name?: string);
}
export {};
