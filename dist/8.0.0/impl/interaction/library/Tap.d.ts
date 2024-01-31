import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import type { PointsData } from "../../../api/interaction/PointsData";
import type { TouchData } from "../../../api/interaction/TouchData";
import type { Logger } from "../../../api/logging/Logger";
import type { CancellingState } from "../../fsm/CancellingState";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import type { StdState } from "../../fsm/StdState";
import type { PointsDataImpl } from "../PointsDataImpl";
interface TapFSMHandler extends FSMDataHandler {
    tap(evt: TouchEvent): void;
}
export declare class TapFSM extends FSMImpl<TapFSMHandler> {
    private countTaps;
    private readonly nbTaps;
    private touchID?;
    protected readonly downState: StdState;
    protected readonly cancelState: CancellingState;
    constructor(nbTaps: number, logger: Logger, dataHandler: TapFSMHandler);
    reinit(): void;
}
export declare class Tap extends InteractionBase<PointsData<TouchData>, PointsDataImpl<TouchData>, TapFSM> {
    constructor(numberTaps: number, logger: Logger, name?: string);
}
export {};
