import { SrcTgtDataBase } from "./SrcTgtDataBase";
import { TouchDataImpl } from "./TouchDataImpl";
export class SrcTgtTouchDataImpl extends SrcTgtDataBase {
    constructor() {
        super(new TouchDataImpl(), new TouchDataImpl());
    }
    copySrc(data, evt, allTouches) {
        this.srcData.copy(TouchDataImpl.mergeTouchEventData(data, evt, allTouches));
    }
    copyTgt(data, evt, allTouches) {
        this.tgtData.copy(TouchDataImpl.mergeTouchEventData(data, evt, allTouches));
    }
}
