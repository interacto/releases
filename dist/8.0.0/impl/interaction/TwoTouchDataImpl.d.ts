import { MultiTouchDataBase } from "./MultiTouchDataImpl";
import { SrcTgtTouchDataImpl } from "./SrcTgtTouchDataImpl";
import type { EventModifierData } from "../../api/interaction/EventModifierData";
import type { SrcTgtPointsData } from "../../api/interaction/SrcTgtPointsData";
import type { TouchData } from "../../api/interaction/TouchData";
import type { TwoTouchData } from "../../api/interaction/TwoTouchData";
import type { UnitInteractionData } from "../../api/interaction/UnitInteractionData";
export declare abstract class TwoTouchDataImpl extends MultiTouchDataBase implements TwoTouchData {
    protected readonly t1: SrcTgtTouchDataImpl;
    protected readonly t2: SrcTgtTouchDataImpl;
    protected constructor();
    get touch1(): SrcTgtPointsData<TouchData>;
    get touch2(): SrcTgtPointsData<TouchData>;
    get touches(): ReadonlyArray<SrcTgtPointsData<TouchData>>;
    flush(): void;
    initTouch(data: Touch, evt: EventModifierData & UnitInteractionData, allTouches: Array<Touch>): void;
    copyTouch(data: Touch, evt: EventModifierData & UnitInteractionData, allTouches: Array<Touch>): void;
    get diffClientX(): number;
    get diffClientY(): number;
    get diffPageX(): number;
    get diffPageY(): number;
    get diffScreenX(): number;
    get diffScreenY(): number;
}
