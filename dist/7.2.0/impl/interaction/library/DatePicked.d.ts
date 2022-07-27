import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import type { WidgetData } from "../../../api/interaction/WidgetData";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { WidgetDataImpl } from "../WidgetDataImpl";
import type { Logger } from "../../../api/logging/Logger";
declare class DatePickedFSM extends FSMImpl<DatePickedHandler> {
    constructor(logger: Logger, dataHandler: DatePickedHandler);
}
interface DatePickedHandler extends FSMDataHandler {
    initToPickedHandler(event: Event): void;
}
export declare class DatePicked extends InteractionBase<WidgetData<HTMLInputElement>, WidgetDataImpl<HTMLInputElement>, DatePickedFSM> {
    constructor(logger: Logger);
    onNewNodeRegistered(node: EventTarget): void;
    onNodeUnregistered(node: EventTarget): void;
}
export {};
