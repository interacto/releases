import type { Flushable } from "./Flushable";
import type { PointBaseData } from "../../api/interaction/PointBaseData";
import type { SrcTgtPointsData } from "../../api/interaction/SrcTgtPointsData";
export declare abstract class SrcTgtDataBase<T extends PointBaseData, S extends Flushable & T> implements SrcTgtPointsData<T> {
    protected readonly srcData: S;
    protected readonly tgtData: S;
    protected constructor(src: S, tgt: S);
    get src(): T;
    get tgt(): T;
    get diffClientX(): number;
    get diffClientY(): number;
    get diffPageX(): number;
    get diffPageY(): number;
    get diffScreenX(): number;
    get diffScreenY(): number;
    get duration(): number;
    velocity(direction: "all" | "horiz" | "vert"): number;
    isHorizontal(pxTolerance: number): boolean;
    isVertical(pxTolerance: number): boolean;
    isLeft(pxTolerance: number): boolean;
    isRight(pxTolerance: number): boolean;
    isTop(pxTolerance: number): boolean;
    isBottom(pxTolerance: number): boolean;
    flush(): void;
}
