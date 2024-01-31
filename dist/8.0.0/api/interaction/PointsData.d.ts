import type { InteractionData } from "./InteractionData";
import type { PointBaseData } from "./PointBaseData";
export interface PointsData<D extends PointBaseData> extends InteractionData {
    readonly points: ReadonlyArray<D>;
}
