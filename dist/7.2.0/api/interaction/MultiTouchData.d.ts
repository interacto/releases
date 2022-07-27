import type { InteractionData } from "./InteractionData";
import type { SrcTgtPointsData } from "./SrcTgtPointsData";
import type { TouchData } from "./TouchData";
export interface MultiTouchData extends InteractionData {
    readonly touches: ReadonlyArray<SrcTgtPointsData<TouchData>>;
    isVertical(pxTolerance: number): boolean;
    isHorizontal(pxTolerance: number): boolean;
    pinchFactor(pxTolerance: number): number | undefined;
}
