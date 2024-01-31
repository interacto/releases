import { PointDataImpl } from "./PointDataImpl";
import { SrcTgtDataBase } from "./SrcTgtDataBase";
import type { PointData } from "../../api/interaction/PointData";
export declare class SrcTgtPointsDataImpl extends SrcTgtDataBase<PointData, PointDataImpl> {
    constructor();
    copySrc(data: PointData): void;
    copyTgt(data: PointData): void;
}
