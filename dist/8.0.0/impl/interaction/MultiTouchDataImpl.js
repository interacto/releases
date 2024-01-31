export class MultiTouchDataBase {
    velocity(direction) {
        return this.touches.reduce((sum, touch) => sum + touch.velocity(direction), 0) / this.touches.length;
    }
}
export class MultiTouchDataImpl extends MultiTouchDataBase {
    touchesData;
    constructor() {
        super();
        this.touchesData = new Map();
    }
    get touches() {
        return Array.from(this.touchesData.values());
    }
    addTouchData(data) {
        this.touchesData.set(data.src.identifier, data);
    }
    removeTouchData(id) {
        const tdata = this.touchesData.get(id);
        if (tdata !== undefined) {
            this.touchesData.delete(id);
            tdata.flush();
        }
    }
    flush() {
        for (const data of this.touchesData.values()) {
            data.flush();
        }
        this.touchesData.clear();
    }
    setTouch(tp, evt) {
        const tdata = this.touchesData.get(tp.identifier);
        if (tdata !== undefined) {
            tdata.copyTgt(tp, evt, Array.from(evt.touches));
        }
    }
    isHorizontal(pxTolerance) {
        let direction = 0;
        for (const touch of this.touchesData) {
            if (direction === 0) {
                direction = touch[1].diffScreenX / Math.abs(touch[1].diffScreenX);
            }
            if (!touch[1].isHorizontal(pxTolerance) || (touch[1].diffScreenX / Math.abs(touch[1].diffScreenX) !== direction)) {
                return false;
            }
        }
        return true;
    }
    isVertical(pxTolerance) {
        let direction = 0;
        for (const touch of this.touchesData) {
            if (direction === 0) {
                direction = touch[1].diffScreenY / Math.abs(touch[1].diffScreenY);
            }
            if (!touch[1].isVertical(pxTolerance) || (touch[1].diffScreenY / Math.abs(touch[1].diffScreenY) !== direction)) {
                return false;
            }
        }
        return true;
    }
}
