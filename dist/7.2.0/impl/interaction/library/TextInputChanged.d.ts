import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import type { WidgetData } from "../../../api/interaction/WidgetData";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { WidgetDataImpl } from "../WidgetDataImpl";
import type { Logger } from "../../../api/logging/Logger";
declare class TextInputChangedFSM extends FSMImpl<TextInputChangedHandler> {
    private readonly _timeGap;
    private readonly timeGapSupplier;
    getTimeGap(): number;
    constructor(logger: Logger, dataHandler: TextInputChangedHandler, timeSet?: number);
}
interface TextInputChangedHandler extends FSMDataHandler {
    initToChangedHandler(event: Event): void;
}
export declare class TextInputChanged extends InteractionBase<WidgetData<HTMLInputElement | HTMLTextAreaElement>, WidgetDataImpl<HTMLInputElement | HTMLTextAreaElement>, TextInputChangedFSM> {
    constructor(logger: Logger, timeGap?: number);
    onNewNodeRegistered(node: EventTarget): void;
    onNodeUnregistered(node: EventTarget): void;
}
export {};
