import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { WidgetDataImpl } from "../WidgetDataImpl";
import type { WidgetData } from "../../../api/interaction/WidgetData";
import type { Logger } from "../../../api/logging/Logger";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
declare class ComboBoxSelectedFSM extends FSMImpl<ComboBoxSelectedHandler> {
    constructor(logger: Logger, dataHandler: ComboBoxSelectedHandler);
}
interface ComboBoxSelectedHandler extends FSMDataHandler {
    initToSelectedHandler(event: Event): void;
}
export declare class ComboBoxSelected extends InteractionBase<WidgetData<HTMLSelectElement>, WidgetDataImpl<HTMLSelectElement>, ComboBoxSelectedFSM> {
    constructor(logger: Logger, name?: string);
    onNewNodeRegistered(node: EventTarget): void;
    onNodeUnregistered(node: EventTarget): void;
}
export {};
