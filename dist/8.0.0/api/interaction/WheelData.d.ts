import type { PointData } from "./PointData";
export interface WheelData extends PointData {
    readonly deltaX: number;
    readonly deltaY: number;
    readonly deltaZ: number;
    readonly deltaMode: number;
}
