import { ThreeTouchDataImpl } from "./ThreeTouchDataImpl";
import type { EventModifierData } from "../../api/interaction/EventModifierData";
import type { FourTouchData } from "../../api/interaction/FourTouchData";
import type { SrcTgtPointsData } from "../../api/interaction/SrcTgtPointsData";
import type { TouchData } from "../../api/interaction/TouchData";
import type { UnitInteractionData } from "../../api/interaction/UnitInteractionData";
export declare class FourTouchDataImpl extends ThreeTouchDataImpl implements FourTouchData {
    private readonly t4;
    constructor();
    get touch4(): SrcTgtPointsData<TouchData>;
    initTouch(data: Touch, evt: EventModifierData & UnitInteractionData, allTouches: Array<Touch>): void;
    copyTouch(data: Touch, evt: EventModifierData & UnitInteractionData, allTouches: Array<Touch>): void;
    flush(): void;
    isLeft(pxTolerance: number): boolean;
    isRight(pxTolerance: number): boolean;
    isTop(pxTolerance: number): boolean;
    isBottom(pxTolerance: number): boolean;
}
