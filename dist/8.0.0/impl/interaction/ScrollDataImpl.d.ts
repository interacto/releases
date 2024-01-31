import { InteractionDataBase } from "./InteractionDataBase";
import type { Flushable } from "./Flushable";
import type { ScrollData } from "../../api/interaction/ScrollData";
export declare class ScrollDataImpl extends InteractionDataBase implements ScrollData, Flushable {
    protected scrollXData: number;
    protected scrollYData: number;
    flush(): void;
    get scrollX(): number;
    get scrollY(): number;
    setScrollData(event: Event): void;
}
