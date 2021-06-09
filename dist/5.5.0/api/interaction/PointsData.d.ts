import type { InteractionData } from "./InteractionData";
import type { PointData } from "./PointData";
export interface PointsData extends InteractionData {
    readonly points: ReadonlyArray<PointData>;
    readonly currentPosition: readonly [number, number] | undefined;
    readonly lastButton: number | undefined;
}
