import type { LineTouchData } from "./LineTouchData";
import type { MultiTouchData } from "./MultiTouchData";
import type { RotationTouchData } from "./RotationTouchData";
import type { ScaleTouchData } from "./ScaleTouchData";
import type { SrcTgtPointsData } from "./SrcTgtPointsData";
import type { TouchData } from "./TouchData";
export interface TwoTouchData extends MultiTouchData {
    readonly touch1: SrcTgtPointsData<TouchData>;
    readonly touch2: SrcTgtPointsData<TouchData>;
    readonly diffClientX: number;
    readonly diffClientY: number;
    readonly diffPageX: number;
    readonly diffPageY: number;
    readonly diffScreenX: number;
    readonly diffScreenY: number;
}
export type GeneralTwoTouchData = LineTouchData & RotationTouchData & ScaleTouchData;
