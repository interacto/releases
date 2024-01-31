import { PointsDataImpl } from "./PointsDataImpl";
import type { TouchData } from "../../api/interaction/TouchData";
export declare class TapDataImpl extends PointsDataImpl<TouchData> {
    constructor();
    get lastId(): number | undefined;
}
