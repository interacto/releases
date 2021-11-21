import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import type { PointData } from "../../../api/interaction/PointData";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
export declare class MouseEnterFSM extends FSMImpl {
    private readonly withBubbling;
    constructor(withBubbling: boolean);
    buildFSM(dataHandler?: MouseEnterFSMHandler): void;
}
interface MouseEnterFSMHandler extends FSMDataHandler {
    onEnter(event: MouseEvent): void;
}
export declare class MouseEnter extends InteractionBase<PointData, PointDataImpl, MouseEnterFSM> {
    private readonly handler;
    constructor(withBubbling: boolean);
}
export {};
