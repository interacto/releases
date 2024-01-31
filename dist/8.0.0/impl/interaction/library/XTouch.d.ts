import { MultiTouchFSM } from "./MultiTouch";
import { ConcurrentInteraction } from "../ConcurrentInteraction";
import { FourTouchDataImpl } from "../FourTouchDataImpl";
import { GeneralTwoTouchDataImpl } from "../GeneralTwoTouchDataImpl";
import { ThreeTouchDataImpl } from "../ThreeTouchDataImpl";
import type { FourTouchData } from "../../../api/interaction/FourTouchData";
import type { ThreeTouchData } from "../../../api/interaction/ThreeTouchData";
import type { GeneralTwoTouchData, TwoTouchData } from "../../../api/interaction/TwoTouchData";
import type { Logger } from "../../../api/logging/Logger";
import type { TwoTouchDataImpl } from "../TwoTouchDataImpl";
export declare class XTouchDnD<T extends TwoTouchData, S extends T & TwoTouchDataImpl> extends ConcurrentInteraction<T, S, MultiTouchFSM> {
    constructor(nbTouches: number, logger: Logger, dataImpl: S, name?: string, fsm?: MultiTouchFSM, movementRequired?: boolean);
    protected setTgtData(evt: TouchEvent): void;
}
export type TwoTouch = XTouchDnD<GeneralTwoTouchData, GeneralTwoTouchDataImpl>;
export declare function twoTouch(logger: Logger): () => TwoTouch;
export declare class ThreeTouchDnD extends XTouchDnD<ThreeTouchData, ThreeTouchDataImpl> {
    constructor(logger: Logger, name?: string, movementRequired?: boolean);
}
export declare class FourTouchDnD extends XTouchDnD<FourTouchData, FourTouchDataImpl> {
    constructor(logger: Logger, name?: string, movementRequired?: boolean);
}
