import type { Flushable } from "./Flushable";
import type { ThenData } from "../../api/interaction/ThenData";
export declare class ThenDataImpl<DX extends Array<Flushable>> implements ThenData<DX>, Flushable {
    readonly dx: DX;
    constructor(dx: DX);
    flush(): void;
}
