import { TwoTouchDataImpl } from "./TwoTouchDataImpl";
import type { GeneralTwoTouchData } from "../../api/interaction/TwoTouchData";
export declare class GeneralTwoTouchDataImpl extends TwoTouchDataImpl implements GeneralTwoTouchData {
    private readonly rotateData;
    private readonly panData;
    private readonly scaleData;
    constructor();
    isVertical(pxTolerance: number): boolean;
    isHorizontal(pxTolerance: number): boolean;
    isLeft(pxTolerance: number): boolean;
    isRight(pxTolerance: number): boolean;
    isTop(pxTolerance: number): boolean;
    isBottom(pxTolerance: number): boolean;
    get rotationAngle(): number;
    scalingRatio(pxTolerance: number): number;
}
