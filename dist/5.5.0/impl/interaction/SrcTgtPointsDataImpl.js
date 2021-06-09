import { PointDataImpl } from "./PointDataImpl";
export class SrcTgtPointsDataImpl {
    constructor() {
        this.srcData = new PointDataImpl();
        this.tgtData = new PointDataImpl();
    }
    get src() {
        return this.srcData;
    }
    get tgt() {
        return this.tgtData;
    }
    flush() {
        this.srcData.flush();
        this.tgtData.flush();
    }
    copySrc(data) {
        this.srcData.copy(data);
    }
    copyTgt(data) {
        this.tgtData.copy(data);
    }
}
