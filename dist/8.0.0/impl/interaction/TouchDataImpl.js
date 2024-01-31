import { PointDataImpl } from "./PointDataImpl";
import { PointingDataBase } from "./PointingDataBase";
export class TouchDataImpl extends PointingDataBase {
    _allTouches = [];
    forceData = 0;
    identifierData = -1;
    radiusXData = 0;
    radiusYData = 0;
    rotationAngleData = 0;
    get allTouches() {
        return this._allTouches;
    }
    get force() {
        return this.forceData;
    }
    get identifier() {
        return this.identifierData;
    }
    get radiusX() {
        return this.radiusXData;
    }
    get radiusY() {
        return this.radiusYData;
    }
    get rotationAngle() {
        return this.rotationAngleData;
    }
    copy(data) {
        super.copy(data);
        this.forceData = data.force;
        this.identifierData = data.identifier;
        this.radiusXData = data.radiusX;
        this.radiusYData = data.radiusY;
        this.rotationAngleData = data.rotationAngle;
        this._allTouches = data.allTouches.map(touch => {
            const newT = new TouchDataImpl();
            newT.copy(touch);
            return newT;
        });
    }
    flush() {
        super.flush();
        this.forceData = 0;
        this.identifierData = -1;
        this.radiusXData = 0;
        this.radiusYData = 0;
        this.rotationAngleData = 0;
        this._allTouches = [];
    }
    static mergeTouchEventData(touch, evt, allTouches) {
        const data = new TouchDataImpl();
        data.copy({
            "clientX": touch.clientX,
            "clientY": touch.clientY,
            "force": touch.force,
            "identifier": touch.identifier,
            "pageX": touch.pageX,
            "pageY": touch.pageY,
            "radiusX": touch.radiusX,
            "radiusY": touch.radiusY,
            "rotationAngle": touch.rotationAngle,
            "screenX": touch.screenX,
            "screenY": touch.screenY,
            "target": touch.target,
            "allTouches": allTouches.map(currTouch => TouchDataImpl.mergeTouchEventData(currTouch, evt, [])),
            "timeStamp": evt.timeStamp,
            "altKey": evt.altKey,
            "shiftKey": evt.shiftKey,
            "ctrlKey": evt.ctrlKey,
            "metaKey": evt.metaKey,
            "currentTarget": evt.currentTarget
        });
        return data;
    }
    toPointData() {
        const point = new PointDataImpl();
        point.copy({
            "button": this.identifier,
            "buttons": 0,
            "movementX": 0,
            "movementY": 0,
            "offsetX": 0,
            "offsetY": 0,
            "relatedTarget": this.target,
            "clientX": this.clientX,
            "clientY": this.clientY,
            "pageX": this.pageX,
            "pageY": this.pageY,
            "screenX": this.screenX,
            "screenY": this.screenY,
            "altKey": this.altKey,
            "ctrlKey": this.ctrlKey,
            "metaKey": this.metaKey,
            "shiftKey": this.shiftKey,
            "timeStamp": this.timeStamp,
            "target": this.target,
            "currentTarget": this.currentTarget
        });
        return point;
    }
}
