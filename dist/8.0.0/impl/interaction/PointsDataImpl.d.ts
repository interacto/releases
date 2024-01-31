import type { PointBaseData } from "../../api/interaction/PointBaseData";
import type { PointsData } from "../../api/interaction/PointsData";
export declare abstract class PointsDataImpl<D extends PointBaseData> implements PointsData<D> {
    protected readonly pointsData: Array<D>;
    constructor();
    get points(): ReadonlyArray<D>;
    addPoint(ptData: D): void;
    flush(): void;
}
