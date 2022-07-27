import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import type { WidgetData } from "../../../api/interaction/WidgetData";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { WidgetDataImpl } from "../WidgetDataImpl";
import type { Logger } from "../../../api/logging/Logger";
declare class BoxCheckedFSM extends FSMImpl<BoxCheckedHandler> {
    constructor(logger: Logger, dataHandler: BoxCheckedHandler);
}
interface BoxCheckedHandler extends FSMDataHandler {
    initToCheckHandler(event: Event): void;
}
export declare class BoxChecked extends InteractionBase<WidgetData<HTMLInputElement>, WidgetDataImpl<HTMLInputElement>, BoxCheckedFSM> {
    constructor(logger: Logger);
    onNewNodeRegistered(node: EventTarget): void;
    onNodeUnregistered(node: EventTarget): void;
}
export {};
