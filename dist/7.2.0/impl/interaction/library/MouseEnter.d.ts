import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import type { PointData } from "../../../api/interaction/PointData";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
import type { Logger } from "../../../api/logging/Logger";
export declare class MouseEnterFSM extends FSMImpl<MouseEnterFSMHandler> {
    private readonly withBubbling;
    constructor(withBubbling: boolean, logger: Logger, dataHandler: MouseEnterFSMHandler);
}
interface MouseEnterFSMHandler extends FSMDataHandler {
    onEnter(event: MouseEvent): void;
}
export declare class MouseEnter extends InteractionBase<PointData, PointDataImpl, MouseEnterFSM> {
    constructor(withBubbling: boolean, logger: Logger);
}
export {};
