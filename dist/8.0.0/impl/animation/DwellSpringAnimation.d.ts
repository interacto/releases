import type { EltRef } from "../../api/binder/BaseBinderBuilder";
import type { PointData } from "../../api/interaction/PointData";
import type { SrcTgtPointsData } from "../../api/interaction/SrcTgtPointsData";
import type { TouchData } from "../../api/interaction/TouchData";
export declare class DwellSpringAnimation {
    private displaySpring;
    private interval;
    private positionSpring;
    private readonly radius;
    private readonly handle;
    private readonly spring;
    constructor(handle: Readonly<EltRef<SVGCircleElement>>, spring: Readonly<EltRef<SVGLineElement>>);
    process(i: SrcTgtPointsData<PointData | TouchData>): void;
    end(): void;
}
