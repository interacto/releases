import { TouchDnD } from "./TouchDnD";
import type { Logger } from "../../../api/logging/Logger";
export declare function hPan(logger: Logger, cancellable: boolean, pxTolerance: number, minLength?: number, minVelocity?: number): () => TouchDnD;
export declare function vPan(logger: Logger, cancellable: boolean, pxTolerance: number, minLength?: number, minVelocity?: number): () => TouchDnD;
export declare function leftPan(logger: Logger, cancellable: boolean, pxTolerance: number, minLength?: number, minVelocity?: number): () => TouchDnD;
export declare function rightPan(logger: Logger, cancellable: boolean, pxTolerance: number, minLength?: number, minVelocity?: number): () => TouchDnD;
export declare function topPan(logger: Logger, cancellable: boolean, pxTolerance: number, minLength?: number, minVelocity?: number): () => TouchDnD;
export declare function bottomPan(logger: Logger, cancellable: boolean, pxTolerance: number, minLength?: number, minVelocity?: number): () => TouchDnD;
