import { GeneralTwoTouchDataImpl } from "./GeneralTwoTouchDataImpl";
import { SrcTgtTouchDataImpl } from "./SrcTgtTouchDataImpl";
import type { EventModifierData } from "../../api/interaction/EventModifierData";
import type { SrcTgtPointsData } from "../../api/interaction/SrcTgtPointsData";
import type { ThreeTouchData } from "../../api/interaction/ThreeTouchData";
import type { TouchData } from "../../api/interaction/TouchData";
import type { UnitInteractionData } from "../../api/interaction/UnitInteractionData";
export declare class ThreeTouchDataImpl extends GeneralTwoTouchDataImpl implements ThreeTouchData {
    protected readonly t3: SrcTgtTouchDataImpl;
    constructor();
    get touch3(): SrcTgtPointsData<TouchData>;
    flush(): void;
    initTouch(data: Touch, evt: EventModifierData & UnitInteractionData, allTouches: Array<Touch>): void;
    copyTouch(data: Touch, evt: EventModifierData & UnitInteractionData, allTouches: Array<Touch>): void;
    isLeft(pxTolerance: number): boolean;
    isRight(pxTolerance: number): boolean;
    isTop(pxTolerance: number): boolean;
    isBottom(pxTolerance: number): boolean;
}
