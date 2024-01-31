import { SrcTgtDataBase } from "./SrcTgtDataBase";
import { TouchDataImpl } from "./TouchDataImpl";
import type { EventModifierData } from "../../api/interaction/EventModifierData";
import type { TouchData } from "../../api/interaction/TouchData";
import type { UnitInteractionData } from "../../api/interaction/UnitInteractionData";
export declare class SrcTgtTouchDataImpl extends SrcTgtDataBase<TouchData, TouchDataImpl> {
    constructor();
    copySrc(data: Touch, evt: EventModifierData & UnitInteractionData, allTouches: Array<Touch>): void;
    copyTgt(data: Touch, evt: EventModifierData & UnitInteractionData, allTouches: Array<Touch>): void;
}
