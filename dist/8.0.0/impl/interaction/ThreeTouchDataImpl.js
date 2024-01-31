import { GeneralTwoTouchDataImpl } from "./GeneralTwoTouchDataImpl";
import { SrcTgtTouchDataImpl } from "./SrcTgtTouchDataImpl";
export class ThreeTouchDataImpl extends GeneralTwoTouchDataImpl {
    t3;
    constructor() {
        super();
        this.t3 = new SrcTgtTouchDataImpl();
    }
    get touch3() {
        return this.t3;
    }
    flush() {
        super.flush();
        this.t3.flush();
    }
    initTouch(data, evt, allTouches) {
        if (this.t3.src.identifier === -1 && this.t2.src.identifier !== -1) {
            this.t3.copySrc(data, evt, allTouches);
            this.t3.copyTgt(data, evt, allTouches);
        }
        else {
            super.initTouch(data, evt, allTouches);
        }
    }
    copyTouch(data, evt, allTouches) {
        if (this.t3.src.identifier === data.identifier) {
            this.t3.copyTgt(data, evt, allTouches);
        }
        else {
            super.copyTouch(data, evt, allTouches);
        }
    }
    isLeft(pxTolerance) {
        return super.isLeft(pxTolerance) && this.t3.isLeft(pxTolerance);
    }
    isRight(pxTolerance) {
        return super.isRight(pxTolerance) && this.t3.isRight(pxTolerance);
    }
    isTop(pxTolerance) {
        return super.isTop(pxTolerance) && this.t3.isTop(pxTolerance);
    }
    isBottom(pxTolerance) {
        return super.isBottom(pxTolerance) && this.t3.isBottom(pxTolerance);
    }
}
