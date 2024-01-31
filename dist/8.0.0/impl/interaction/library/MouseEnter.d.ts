import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
import type { PointData } from "../../../api/interaction/PointData";
import type { Logger } from "../../../api/logging/Logger";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
interface MouseEnterFSMHandler extends FSMDataHandler {
    onEnter(event: MouseEvent): void;
}
export declare class MouseEnterFSM extends FSMImpl<MouseEnterFSMHandler> {
    private readonly withBubbling;
    constructor(withBubbling: boolean, logger: Logger, dataHandler: MouseEnterFSMHandler);
}
export declare class MouseEnter extends InteractionBase<PointData, PointDataImpl, MouseEnterFSM> {
    constructor(withBubbling: boolean, logger: Logger, name?: string);
}
export {};
