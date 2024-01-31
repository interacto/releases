export class SrcTgtDataBase {
    srcData;
    tgtData;
    constructor(src, tgt) {
        this.srcData = src;
        this.tgtData = tgt;
    }
    get src() {
        return this.srcData;
    }
    get tgt() {
        return this.tgtData;
    }
    get diffClientX() {
        return this.tgt.clientX - this.src.clientX;
    }
    get diffClientY() {
        return this.tgt.clientY - this.src.clientY;
    }
    get diffPageX() {
        return this.tgt.pageX - this.src.pageX;
    }
    get diffPageY() {
        return this.tgt.pageY - this.src.pageY;
    }
    get diffScreenX() {
        return this.tgt.screenX - this.src.screenX;
    }
    get diffScreenY() {
        return this.tgt.screenY - this.src.screenY;
    }
    get duration() {
        return this.tgtData.timeStamp - this.srcData.timeStamp;
    }
    velocity(direction) {
        switch (direction) {
            case "all":
                return (Math.hypot(this.diffScreenX, this.diffScreenY) / this.duration) * 1000;
            case "horiz":
                return (Math.abs(this.diffScreenX) / this.duration) * 1000;
            case "vert":
                return (Math.abs(this.diffScreenY) / this.duration) * 1000;
            default:
                return 0;
        }
    }
    isHorizontal(pxTolerance) {
        return Math.abs(this.diffScreenY) <= pxTolerance && this.diffScreenX !== 0;
    }
    isVertical(pxTolerance) {
        return Math.abs(this.diffScreenX) <= pxTolerance && this.diffScreenY !== 0;
    }
    isLeft(pxTolerance) {
        return this.isHorizontal(pxTolerance) && this.tgt.screenX < this.src.screenX;
    }
    isRight(pxTolerance) {
        return this.isHorizontal(pxTolerance) && this.tgt.screenX > this.src.screenX;
    }
    isTop(pxTolerance) {
        return this.isVertical(pxTolerance) && this.tgt.screenY < this.src.screenY;
    }
    isBottom(pxTolerance) {
        return this.isVertical(pxTolerance) && this.tgt.screenY > this.src.screenY;
    }
    flush() {
        this.srcData.flush();
        this.tgtData.flush();
    }
}
