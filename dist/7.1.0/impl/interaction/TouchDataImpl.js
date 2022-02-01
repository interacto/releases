import { PointingDataBase } from "./PointingDataBase";
export class TouchDataImpl extends PointingDataBase {
    constructor() {
        super(...arguments);
        this._allTouches = [];
        this.forceData = 0;
        this.identifierData = 0;
        this.radiusXData = 0;
        this.radiusYData = 0;
        this.rotationAngleData = 0;
    }
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
        this._allTouches = data.allTouches.map(t => {
            const newT = new TouchDataImpl();
            newT.copy(t);
            return newT;
        });
    }
    flush() {
        super.flush();
        this.forceData = 0;
        this.identifierData = 0;
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
            "allTouches": allTouches.map(t => TouchDataImpl.mergeTouchEventData(t, evt, [])),
            "timeStamp": evt.timeStamp,
            "altKey": evt.altKey,
            "shiftKey": evt.shiftKey,
            "ctrlKey": evt.ctrlKey,
            "metaKey": evt.metaKey,
            "currentTarget": evt.currentTarget
        });
        return data;
    }
}
