import { InteractionDataBase } from "./InteractionDataBase";
import type { Flushable } from "./Flushable";
import type { WidgetData } from "../../api/interaction/WidgetData";
export declare class WidgetDataImpl<T> extends InteractionDataBase implements WidgetData<T>, Flushable {
    get widget(): T | undefined;
}
