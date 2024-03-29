import { XTouchDnD } from "./XTouch";
import { TwoPanDataImpl } from "../TwoPanDataImpl";
import type { LineTouchData } from "../../../api/interaction/LineTouchData";
import type { TwoTouchData } from "../../../api/interaction/TwoTouchData";
import type { Logger } from "../../../api/logging/Logger";
export type TwoPan = XTouchDnD<LineTouchData & TwoTouchData, TwoPanDataImpl>;
export declare function twoHPan(logger: Logger, pxTolerance: number, minLength?: number, minVelocity?: number): () => TwoPan;
export declare function twoVPan(logger: Logger, pxTolerance: number, minLength?: number, minVelocity?: number): () => TwoPan;
export declare function twoLeftPan(logger: Logger, pxTolerance: number, minLength?: number, minVelocity?: number): () => TwoPan;
export declare function twoRightPan(logger: Logger, pxTolerance: number, minLength?: number, minVelocity?: number): () => TwoPan;
export declare function twoTopPan(logger: Logger, pxTolerance: number, minLength?: number, minVelocity?: number): () => TwoPan;
export declare function twoBottomPan(logger: Logger, pxTolerance: number, minLength?: number, minVelocity?: number): () => TwoPan;
