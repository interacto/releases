import { TwoTouchDataImpl } from "./TwoTouchDataImpl";
import type { LineTouchData } from "../../api/interaction/LineTouchData";
export declare class TwoPanDataImpl extends TwoTouchDataImpl implements LineTouchData {
    constructor();
    isVertical(pxTolerance: number): boolean;
    isHorizontal(pxTolerance: number): boolean;
    isLeft(pxTolerance: number): boolean;
    isRight(pxTolerance: number): boolean;
    isTop(pxTolerance: number): boolean;
    isBottom(pxTolerance: number): boolean;
}
