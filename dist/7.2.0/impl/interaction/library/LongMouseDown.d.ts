import { FSMImpl } from "../../fsm/FSMImpl";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import { InteractionBase } from "../InteractionBase";
import type { PointData } from "../../../api/interaction/PointData";
import { PointDataImpl } from "../PointDataImpl";
import type { Logger } from "../../../api/logging/Logger";
export declare class LongMouseDownFSM extends FSMImpl<LongMouseDownFSMHandler> {
    private readonly duration;
    private currentButton?;
    constructor(duration: number, logger: Logger, dataHandler: LongMouseDownFSMHandler);
    reinit(): void;
}
interface LongMouseDownFSMHandler extends FSMDataHandler {
    press(evt: MouseEvent): void;
}
export declare class LongMouseDown extends InteractionBase<PointData, PointDataImpl, LongMouseDownFSM> {
    constructor(duration: number, logger: Logger);
}
export {};
