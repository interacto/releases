import type { InteractionData } from "./InteractionData";
import type { PointBaseData } from "./PointBaseData";
export interface SrcTgtPointsData<T extends PointBaseData> extends InteractionData {
    readonly src: T;
    readonly tgt: T;
}
