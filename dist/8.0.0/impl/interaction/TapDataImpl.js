import { PointsDataImpl } from "./PointsDataImpl";
export class TapDataImpl extends PointsDataImpl {
    constructor() {
        super();
    }
    get lastId() {
        return this.pointsData.at(-1)?.identifier;
    }
}
