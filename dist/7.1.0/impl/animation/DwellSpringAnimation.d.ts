import type { EltRef } from "../../api/binder/BaseBinderBuilder";
import type { SrcTgtPointsData } from "../../api/interaction/SrcTgtPointsData";
import type { TouchData } from "../../api/interaction/TouchData";
import type { PointData } from "../../api/interaction/PointData";
export declare class DwellSpringAnimation {
    private displaySpring;
    private interval;
    private positionSpring;
    private readonly radius;
    private readonly handle;
    private readonly spring;
    constructor(handle: EltRef<SVGCircleElement>, spring: EltRef<SVGLineElement>);
    process(i: SrcTgtPointsData<PointData | TouchData>): void;
    end(): void;
}
