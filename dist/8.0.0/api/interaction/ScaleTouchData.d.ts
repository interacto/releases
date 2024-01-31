import type { TwoTouchData } from "./TwoTouchData";
export interface ScaleTouchData extends TwoTouchData {
    scalingRatio(pxTolerance: number): number;
}
