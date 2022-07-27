import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import type { WidgetData } from "../../../api/interaction/WidgetData";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { WidgetDataImpl } from "../WidgetDataImpl";
import type { Logger } from "../../../api/logging/Logger";
declare class ColorPickedFSM extends FSMImpl<ColorPickedHandler> {
    constructor(logger: Logger, dataHandler: ColorPickedHandler);
}
interface ColorPickedHandler extends FSMDataHandler {
    initToPickedHandler(event: Event): void;
}
export declare class ColorPicked extends InteractionBase<WidgetData<HTMLInputElement>, WidgetDataImpl<HTMLInputElement>, ColorPickedFSM> {
    constructor(logger: Logger);
    onNewNodeRegistered(node: EventTarget): void;
    onNodeUnregistered(node: EventTarget): void;
}
export {};
