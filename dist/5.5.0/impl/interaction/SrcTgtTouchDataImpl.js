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
    copySrc(data, evt) {
        this.srcData.copy(TouchDataImpl.mergeTouchEventData(data, evt));
    }
    copyTgt(data, evt) {
        this.tgtData.copy(TouchDataImpl.mergeTouchEventData(data, evt));
    }
}
