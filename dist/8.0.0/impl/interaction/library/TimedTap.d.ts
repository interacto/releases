import { TapFSM } from "./Tap";
import { InteractionBase } from "../InteractionBase";
import type { PointsData } from "../../../api/interaction/PointsData";
import type { TouchData } from "../../../api/interaction/TouchData";
import type { Logger } from "../../../api/logging/Logger";
import type { PointsDataImpl } from "../PointsDataImpl";
export declare class TimedTap extends InteractionBase<PointsData<TouchData>, PointsDataImpl<TouchData>, TapFSM> {
    constructor(duration: number, numberTaps: number, logger: Logger, name?: string);
}
