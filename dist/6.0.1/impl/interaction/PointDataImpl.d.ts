import type { PointData } from "../../api/interaction/PointData";
import { PointingDataBase } from "./PointingDataBase";
export declare class PointDataImpl extends PointingDataBase implements PointData {
    protected buttonData: number;
    protected buttonsData: number;
    protected movementXData: number;
    protected movementYData: number;
    protected offsetXData: number;
    protected offsetYData: number;
    protected relatedTargetData: EventTarget | null;
    flush(): void;
    copy(data: PointData): void;
    get button(): number;
    get buttons(): number;
    get movementX(): number;
    get movementY(): number;
    get offsetX(): number;
    get offsetY(): number;
    get relatedTarget(): EventTarget | null;
}
