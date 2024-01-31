import { SrcTgtTouchDataImpl } from "./SrcTgtTouchDataImpl";
import { ThreeTouchDataImpl } from "./ThreeTouchDataImpl";
export class FourTouchDataImpl extends ThreeTouchDataImpl {
    t4;
    constructor() {
        super();
        this.t4 = new SrcTgtTouchDataImpl();
    }
    get touch4() {
        return this.t4;
    }
    initTouch(data, evt, allTouches) {
        if (this.t4.src.identifier === -1 && this.t3.src.identifier !== -1) {
            this.t4.copySrc(data, evt, allTouches);
            this.t4.copyTgt(data, evt, allTouches);
        }
        else {
            super.initTouch(data, evt, allTouches);
        }
    }
    copyTouch(data, evt, allTouches) {
        if (this.t4.src.identifier === data.identifier) {
            this.t4.copyTgt(data, evt, allTouches);
        }
        else {
            super.copyTouch(data, evt, allTouches);
        }
    }
    flush() {
        super.flush();
        this.t4.flush();
    }
    isLeft(pxTolerance) {
        return super.isLeft(pxTolerance) && this.t4.isLeft(pxTolerance);
    }
    isRight(pxTolerance) {
        return super.isRight(pxTolerance) && this.t4.isRight(pxTolerance);
    }
    isTop(pxTolerance) {
        return super.isTop(pxTolerance) && this.t4.isTop(pxTolerance);
    }
    isBottom(pxTolerance) {
        return super.isBottom(pxTolerance) && this.t4.isBottom(pxTolerance);
    }
}
