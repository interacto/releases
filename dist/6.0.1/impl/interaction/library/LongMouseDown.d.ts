import { FSMImpl } from "../../fsm/FSMImpl";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import { InteractionBase } from "../InteractionBase";
import type { PointData } from "../../../api/interaction/PointData";
import { PointDataImpl } from "../PointDataImpl";
export declare class LongMouseDownFSM extends FSMImpl {
    private readonly duration;
    private currentButton?;
    constructor(duration: number);
    buildFSM(dataHandler?: LongMouseDownFSMHandler): void;
    reinit(): void;
}
interface LongMouseDownFSMHandler extends FSMDataHandler {
    press(evt: MouseEvent): void;
}
export declare class LongMouseDown extends InteractionBase<PointData, PointDataImpl, LongMouseDownFSM> {
    private readonly handler;
    constructor(duration: number);
}
export {};
