import { TwoTouchDataImpl } from "./TwoTouchDataImpl";
export class RotationTouchDataImpl extends TwoTouchDataImpl {
    constructor() {
        super();
    }
    get rotationAngle() {
        return this.computeAngle(this.t1.src, this.t2.src) - this.computeAngle(this.t1.src, this.t2.tgt);
    }
    computeAngle(t1, t2) {
        return Math.atan2(t2.clientX - t1.clientX, t1.clientY - t2.clientY);
    }
}
