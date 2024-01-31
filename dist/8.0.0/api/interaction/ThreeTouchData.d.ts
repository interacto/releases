import type { SrcTgtPointsData } from "./SrcTgtPointsData";
import type { TouchData } from "./TouchData";
import type { TwoTouchData } from "./TwoTouchData";
export interface ThreeTouchData extends TwoTouchData {
    readonly touch3: SrcTgtPointsData<TouchData>;
}
