import { PointsDataImpl } from "./PointsDataImpl";
export class MousePointsDataImpl extends PointsDataImpl {
    currentPositionData;
    constructor() {
        super();
    }
    get currentPosition() {
        return this.currentPositionData;
    }
    set currentPosition(position) {
        this.currentPositionData = position;
    }
    get lastButton() {
        return this.pointsData.at(-1)?.button;
    }
    flush() {
        super.flush();
        this.currentPositionData = undefined;
    }
}
