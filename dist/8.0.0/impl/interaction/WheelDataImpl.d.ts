import { PointDataImpl } from "./PointDataImpl";
import type { WheelData } from "../../api/interaction/WheelData";
export declare class WheelDataImpl extends PointDataImpl implements WheelData {
    private deltaModeData;
    private deltaXData;
    private deltaYData;
    private deltaZData;
    flush(): void;
    copy(data: WheelData): void;
    get deltaMode(): number;
    get deltaX(): number;
    get deltaY(): number;
    get deltaZ(): number;
}
