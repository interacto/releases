export class MultiTouchDataImpl {
    constructor() {
        this.touchesData = new Map();
    }
    get touches() {
        return [...this.touchesData.values()];
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
        this.touchesData.forEach(data => {
            data.flush();
        });
        this.touchesData.clear();
    }
    setTouch(tp, evt) {
        const tdata = this.touchesData.get(tp.identifier);
        if (tdata !== undefined) {
            tdata.copyTgt(tp, evt, [...evt.touches]);
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
    pinchFactor(pxTolerance) {
        if (this.touches.length !== 2) {
            return undefined;
        }
        const tgt1 = [this.touches[0].tgt.screenX, this.touches[0].tgt.screenY];
        const tgt2 = [this.touches[1].tgt.screenX, this.touches[1].tgt.screenY];
        const src1 = [this.touches[0].src.screenX, this.touches[0].src.screenY];
        const src2 = [this.touches[1].src.screenX, this.touches[1].src.screenY];
        const vector1 = [this.touches[0].diffScreenX, this.touches[0].diffScreenY];
        const vector2 = [this.touches[1].diffScreenX, this.touches[1].diffScreenY];
        const lineVector = [tgt2[0] - tgt1[0], tgt2[1] - tgt1[1]];
        const projection1 = MultiTouchDataImpl.project(vector1, lineVector);
        const projectionVector1 = [projection1 * lineVector[0], projection1 * lineVector[1]];
        const projection2 = MultiTouchDataImpl.project(vector2, lineVector);
        const projectionVector2 = [projection2 * lineVector[0], projection2 * lineVector[1]];
        if (projection1 / Math.abs(projection1) === projection2 / Math.abs(projection2)) {
            return undefined;
        }
        const distance1 = MultiTouchDataImpl.distance(projectionVector1, vector1);
        const distance2 = MultiTouchDataImpl.distance(projectionVector2, vector2);
        if (distance1 > pxTolerance || distance2 > pxTolerance) {
            return undefined;
        }
        return MultiTouchDataImpl.distance(tgt1, tgt2) / MultiTouchDataImpl.distance(src1, src2);
    }
    static project(vector1, vector2) {
        return (vector1[0] * vector2[0] + vector1[1] * vector2[1]) / (vector2[0] ** 2 + vector2[1] ** 2);
    }
    static distance(point1, point2) {
        return Math.sqrt((point2[0] - point1[0]) ** 2 + (point2[1] - point1[1]) ** 2);
    }
}
