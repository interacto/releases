import { PointingDataBase } from "./PointingDataBase";
import type { EventModifierData } from "../../api/interaction/EventModifierData";
import type { PointData } from "../../api/interaction/PointData";
import type { TouchData } from "../../api/interaction/TouchData";
import type { UnitInteractionData } from "../../api/interaction/UnitInteractionData";
export declare class TouchDataImpl extends PointingDataBase implements TouchData {
    private _allTouches;
    private forceData;
    private identifierData;
    private radiusXData;
    private radiusYData;
    private rotationAngleData;
    get allTouches(): ReadonlyArray<TouchData>;
    get force(): number;
    get identifier(): number;
    get radiusX(): number;
    get radiusY(): number;
    get rotationAngle(): number;
    copy(data: TouchData): void;
    flush(): void;
    static mergeTouchEventData(touch: Touch, evt: EventModifierData & UnitInteractionData, allTouches: Array<Touch>): TouchData;
    toPointData(): PointData;
}
