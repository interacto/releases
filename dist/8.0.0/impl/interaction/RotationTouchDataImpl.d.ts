import { TwoTouchDataImpl } from "./TwoTouchDataImpl";
import type { RotationTouchData } from "../../api/interaction/RotationTouchData";
export declare class RotationTouchDataImpl extends TwoTouchDataImpl implements RotationTouchData {
    constructor();
    get rotationAngle(): number;
    private computeAngle;
}
