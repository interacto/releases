import type { Flushable } from "./Flushable";
import type { SrcTgtTouchDataImpl } from "./SrcTgtTouchDataImpl";
import type { MultiTouchData } from "../../api/interaction/MultiTouchData";
import type { SrcTgtPointsData } from "../../api/interaction/SrcTgtPointsData";
import type { TouchData } from "../../api/interaction/TouchData";
export declare abstract class MultiTouchDataBase implements MultiTouchData {
    abstract readonly touches: ReadonlyArray<SrcTgtPointsData<TouchData>>;
    velocity(direction: "all" | "horiz" | "vert"): number;
}
export declare class MultiTouchDataImpl extends MultiTouchDataBase implements Flushable {
    protected readonly touchesData: Map<number, SrcTgtTouchDataImpl>;
    constructor();
    get touches(): ReadonlyArray<SrcTgtPointsData<TouchData>>;
    addTouchData(data: SrcTgtTouchDataImpl): void;
    removeTouchData(id: number): void;
    flush(): void;
    setTouch(tp: Touch, evt: TouchEvent): void;
    isHorizontal(pxTolerance: number): boolean;
    isVertical(pxTolerance: number): boolean;
}
