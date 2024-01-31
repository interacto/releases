export interface LineTouchData {
    isVertical(pxTolerance: number): boolean;
    isHorizontal(pxTolerance: number): boolean;
    isLeft(pxTolerance: number): boolean;
    isRight(pxTolerance: number): boolean;
    isTop(pxTolerance: number): boolean;
    isBottom(pxTolerance: number): boolean;
}
