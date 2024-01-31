import type { PointData } from "./PointData";
import type { PointsData } from "./PointsData";
export interface MousePointsData extends PointsData<PointData> {
    readonly currentPosition: PointData | undefined;
}
