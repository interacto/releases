import { TwoTouchDataImpl } from "./TwoTouchDataImpl";
import type { ScaleTouchData } from "../../api/interaction/ScaleTouchData";
export declare class ScaleTouchDataImpl extends TwoTouchDataImpl implements ScaleTouchData {
    constructor();
    scalingRatio(pxTolerance: number): number;
    static project(vector1: [number, number], vector2: [number, number]): number;
    static distance(point1: [number, number], point2: [number, number]): number;
}
