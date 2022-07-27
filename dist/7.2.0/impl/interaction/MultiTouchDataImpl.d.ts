import type { MultiTouchData } from "../../api/interaction/MultiTouchData";
import type { SrcTgtTouchDataImpl } from "./SrcTgtTouchDataImpl";
import type { Flushable } from "./Flushable";
import type { SrcTgtPointsData } from "../../api/interaction/SrcTgtPointsData";
import type { TouchData } from "../../api/interaction/TouchData";
export declare class MultiTouchDataImpl implements MultiTouchData, Flushable {
    private readonly touchesData;
    constructor();
    get touches(): ReadonlyArray<SrcTgtPointsData<TouchData>>;
    addTouchData(data: SrcTgtTouchDataImpl): void;
    removeTouchData(id: number): void;
    flush(): void;
    setTouch(tp: Touch, evt: TouchEvent): void;
    isHorizontal(pxTolerance: number): boolean;
    isVertical(pxTolerance: number): boolean;
    pinchFactor(pxTolerance: number): number | undefined;
    static project(vector1: Array<number>, vector2: Array<number>): number;
    static distance(point1: Array<number>, point2: Array<number>): number;
}
