import type { SrcTgtPointsData } from "../../api/interaction/SrcTgtPointsData";
import type { PointData } from "../../api/interaction/PointData";
export declare class SrcTgtPointsDataImpl implements SrcTgtPointsData<PointData> {
    private readonly srcData;
    private readonly tgtData;
    constructor();
    get src(): PointData;
    get tgt(): PointData;
    flush(): void;
    copySrc(data: PointData): void;
    copyTgt(data: PointData): void;
}
