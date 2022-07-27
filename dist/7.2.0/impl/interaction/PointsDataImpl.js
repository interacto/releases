import { peek } from "../util/ArrayUtil";
export class PointsDataImpl {
    constructor() {
        this.pointsData = [];
    }
    get points() {
        return [...this.pointsData];
    }
    get currentPosition() {
        return this.currentPositionData;
    }
    set currentPosition(position) {
        this.currentPositionData = position;
    }
    get lastButton() {
        return peek(this.pointsData)?.button;
    }
    addPoint(ptData) {
        this.pointsData.push(ptData);
    }
    flush() {
        this.pointsData.length = 0;
        this.currentPositionData = undefined;
    }
}
