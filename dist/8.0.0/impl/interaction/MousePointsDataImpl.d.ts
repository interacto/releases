import { PointsDataImpl } from "./PointsDataImpl";
import type { PointData } from "../../api/interaction/PointData";
export declare class MousePointsDataImpl extends PointsDataImpl<PointData> {
    private currentPositionData;
    constructor();
    get currentPosition(): PointData | undefined;
    set currentPosition(position: PointData | undefined);
    get lastButton(): number | undefined;
    flush(): void;
}
