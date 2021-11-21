import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import type { PointData } from "../../../api/interaction/PointData";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
export declare class MouseLeaveFSM extends FSMImpl {
    private readonly withBubbling;
    constructor(withBubbling: boolean);
    buildFSM(dataHandler?: MouseLeaveFSMHandler): void;
}
interface MouseLeaveFSMHandler extends FSMDataHandler {
    onExit(event: MouseEvent): void;
}
export declare class MouseLeave extends InteractionBase<PointData, PointDataImpl, MouseLeaveFSM> {
    private readonly handler;
    constructor(withBubbling: boolean);
}
export {};
