import type { SrcTgtPointsData } from "./SrcTgtPointsData";
import type { ThreeTouchData } from "./ThreeTouchData";
import type { TouchData } from "./TouchData";
export interface FourTouchData extends ThreeTouchData {
    readonly touch4: SrcTgtPointsData<TouchData>;
}
