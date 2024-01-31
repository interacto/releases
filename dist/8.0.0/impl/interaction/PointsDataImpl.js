export class PointsDataImpl {
    pointsData;
    constructor() {
        this.pointsData = [];
    }
    get points() {
        return Array.from(this.pointsData);
    }
    addPoint(ptData) {
        this.pointsData.push(ptData);
    }
    flush() {
        this.pointsData.length = 0;
    }
}
