import { PointDataImpl } from "./PointDataImpl";
export class WheelDataImpl extends PointDataImpl {
    constructor() {
        super(...arguments);
        this.deltaModeData = 0;
        this.deltaXData = 0;
        this.deltaYData = 0;
        this.deltaZData = 0;
    }
    flush() {
        super.flush();
        this.deltaModeData = 0;
        this.deltaXData = 0;
        this.deltaYData = 0;
        this.deltaZData = 0;
    }
    copy(data) {
        super.copy(data);
        this.deltaXData = data.deltaX;
        this.deltaYData = data.deltaY;
        this.deltaZData = data.deltaZ;
        this.deltaModeData = data.deltaMode;
    }
    get deltaMode() {
        return this.deltaModeData;
    }
    get deltaX() {
        return this.deltaXData;
    }
    get deltaY() {
        return this.deltaYData;
    }
    get deltaZ() {
        return this.deltaZData;
    }
}
