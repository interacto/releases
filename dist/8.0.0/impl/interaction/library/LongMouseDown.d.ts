import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
import type { PointData } from "../../../api/interaction/PointData";
import type { Logger } from "../../../api/logging/Logger";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
interface LongMouseDownFSMHandler extends FSMDataHandler {
    press(evt: MouseEvent): void;
}
export declare class LongMouseDownFSM extends FSMImpl<LongMouseDownFSMHandler> {
    private readonly duration;
    private currentButton;
    constructor(duration: number, logger: Logger, dataHandler: LongMouseDownFSMHandler);
    reinit(): void;
}
export declare class LongMouseDown extends InteractionBase<PointData, PointDataImpl, LongMouseDownFSM> {
    constructor(duration: number, logger: Logger, name?: string);
}
export {};
