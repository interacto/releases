import { TwoTouchDataImpl } from "./TwoTouchDataImpl";
export class TwoPanDataImpl extends TwoTouchDataImpl {
    constructor() {
        super();
    }
    isVertical(pxTolerance) {
        return this.isTop(pxTolerance) || this.isBottom(pxTolerance);
    }
    isHorizontal(pxTolerance) {
        return this.isLeft(pxTolerance) || this.isRight(pxTolerance);
    }
    isLeft(pxTolerance) {
        return this.t1.isLeft(pxTolerance) && this.t2.isLeft(pxTolerance);
    }
    isRight(pxTolerance) {
        return this.t1.isRight(pxTolerance) && this.t2.isRight(pxTolerance);
    }
    isTop(pxTolerance) {
        return this.t1.isTop(pxTolerance) && this.t2.isTop(pxTolerance);
    }
    isBottom(pxTolerance) {
        return this.t1.isBottom(pxTolerance) && this.t2.isBottom(pxTolerance);
    }
}
