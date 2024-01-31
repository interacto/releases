import { PointDataImpl } from "./PointDataImpl";
import { SrcTgtDataBase } from "./SrcTgtDataBase";
export class SrcTgtPointsDataImpl extends SrcTgtDataBase {
    constructor() {
        super(new PointDataImpl(), new PointDataImpl());
    }
    copySrc(data) {
        this.srcData.copy(data);
    }
    copyTgt(data) {
        this.tgtData.copy(data);
    }
}
