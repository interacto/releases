import { TwoTouchDataImpl } from "./TwoTouchDataImpl";
export class ScaleTouchDataImpl extends TwoTouchDataImpl {
    constructor() {
        super();
    }
    scalingRatio(pxTolerance) {
        const t0 = this.t1;
        const t1 = this.t2;
        if (t0.src.identifier === -1 || t1.src.identifier === -1) {
            return 0;
        }
        const tgt1 = [t0.tgt.screenX, t0.tgt.screenY];
        const tgt2 = [t1.tgt.screenX, t1.tgt.screenY];
        const src1 = [t0.src.screenX, t0.src.screenY];
        const src2 = [t1.src.screenX, t1.src.screenY];
        const vector1 = [t0.diffScreenX, t0.diffScreenY];
        const vector2 = [t1.diffScreenX, t1.diffScreenY];
        const lineVector = [tgt2[0] - tgt1[0], tgt2[1] - tgt1[1]];
        const projection1 = ScaleTouchDataImpl.project(vector1, lineVector);
        const projectionVector1 = [projection1 * lineVector[0], projection1 * lineVector[1]];
        const projection2 = ScaleTouchDataImpl.project(vector2, lineVector);
        const projectionVector2 = [projection2 * lineVector[0], projection2 * lineVector[1]];
        if (projection1 / Math.abs(projection1) === projection2 / Math.abs(projection2)) {
            return 0;
        }
        const distance1 = ScaleTouchDataImpl.distance(projectionVector1, vector1);
        const distance2 = ScaleTouchDataImpl.distance(projectionVector2, vector2);
        if (distance1 > pxTolerance || distance2 > pxTolerance || Number.isNaN(distance1) || Number.isNaN(distance2)) {
            return 0;
        }
        return ScaleTouchDataImpl.distance(tgt1, tgt2) / ScaleTouchDataImpl.distance(src1, src2);
    }
    static project(vector1, vector2) {
        return (vector1[0] * vector2[0] + vector1[1] * vector2[1]) / (vector2[0] ** 2 + vector2[1] ** 2);
    }
    static distance(point1, point2) {
        return Math.hypot((point2[0] - point1[0]), (point2[1] - point1[1]));
    }
}
