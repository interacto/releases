import { MultiTouchDataBase } from "./MultiTouchDataImpl";
import { SrcTgtTouchDataImpl } from "./SrcTgtTouchDataImpl";
export class TwoTouchDataImpl extends MultiTouchDataBase {
    t1;
    t2;
    constructor() {
        super();
        this.t1 = new SrcTgtTouchDataImpl();
        this.t2 = new SrcTgtTouchDataImpl();
    }
    get touch1() {
        return this.t1;
    }
    get touch2() {
        return this.t2;
    }
    get touches() {
        return [this.t1, this.t2];
    }
    flush() {
        this.t1.flush();
        this.t2.flush();
    }
    initTouch(data, evt, allTouches) {
        if (this.t1.src.identifier === -1) {
            this.t1.copySrc(data, evt, allTouches);
            this.t1.copyTgt(data, evt, allTouches);
        }
        else {
            if (this.t2.src.identifier === -1) {
                this.t2.copySrc(data, evt, allTouches);
                this.t2.copyTgt(data, evt, allTouches);
            }
        }
    }
    copyTouch(data, evt, allTouches) {
        if (this.t1.src.identifier === data.identifier) {
            this.t1.copyTgt(data, evt, allTouches);
        }
        else {
            if (this.t2.src.identifier === data.identifier) {
                this.t2.copyTgt(data, evt, allTouches);
            }
        }
    }
    get diffClientX() {
        return (this.t1.diffClientX + this.t2.diffClientX) / 2;
    }
    get diffClientY() {
        return (this.t1.diffClientY + this.t2.diffClientY) / 2;
    }
    get diffPageX() {
        return (this.t1.diffPageX + this.t2.diffPageX) / 2;
    }
    get diffPageY() {
        return (this.t1.diffPageY + this.t2.diffPageY) / 2;
    }
    get diffScreenX() {
        return (this.t1.diffScreenX + this.t2.diffScreenX) / 2;
    }
    get diffScreenY() {
        return (this.t1.diffScreenY + this.t2.diffScreenY) / 2;
    }
}
