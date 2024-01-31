import { RotationTouchDataImpl } from "./RotationTouchDataImpl";
import { ScaleTouchDataImpl } from "./ScaleTouchDataImpl";
import { TwoPanDataImpl } from "./TwoPanDataImpl";
import { TwoTouchDataImpl } from "./TwoTouchDataImpl";
export class GeneralTwoTouchDataImpl extends TwoTouchDataImpl {
    rotateData;
    panData;
    scaleData;
    constructor() {
        super();
        this.rotateData = new RotationTouchDataImpl();
        this.panData = new TwoPanDataImpl();
        this.scaleData = new ScaleTouchDataImpl();
    }
    isVertical(pxTolerance) {
        return this.panData.isVertical(pxTolerance);
    }
    isHorizontal(pxTolerance) {
        return this.panData.isHorizontal(pxTolerance);
    }
    isLeft(pxTolerance) {
        return this.panData.isLeft(pxTolerance);
    }
    isRight(pxTolerance) {
        return this.panData.isRight(pxTolerance);
    }
    isTop(pxTolerance) {
        return this.panData.isTop(pxTolerance);
    }
    isBottom(pxTolerance) {
        return this.panData.isBottom(pxTolerance);
    }
    get rotationAngle() {
        return this.rotateData.rotationAngle;
    }
    scalingRatio(pxTolerance) {
        return this.scaleData.scalingRatio(pxTolerance);
    }
}
