import { TouchDataImpl } from "./TouchDataImpl";
export class SrcTgtTouchDataImpl {
    constructor() {
        this.srcData = new TouchDataImpl();
        this.tgtData = new TouchDataImpl();
    }
    get src() {
        return this.srcData;
    }
    get tgt() {
        return this.tgtData;
    }
    flush() {
        this.srcData.flush();
        this.tgtData.flush();
    }
    copySrc(data, evt, allTouches) {
        this.srcData.copy(TouchDataImpl.mergeTouchEventData(data, evt, allTouches));
    }
    copyTgt(data, evt, allTouches) {
        this.tgtData.copy(TouchDataImpl.mergeTouchEventData(data, evt, allTouches));
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
    get velocity() {
        return Math.sqrt(this.diffScreenX ** 2 + this.diffScreenY ** 2) / this.duration;
    }
    isHorizontal(pxTolerance) {
        return Math.abs(this.diffScreenY) <= pxTolerance;
    }
    isVertical(pxTolerance) {
        return Math.abs(this.diffScreenX) <= pxTolerance;
    }
}
