import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { WidgetDataImpl } from "../WidgetDataImpl";
import type { WidgetData } from "../../../api/interaction/WidgetData";
import type { Logger } from "../../../api/logging/Logger";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
interface ButtonPressedFSMHandler extends FSMDataHandler {
    initToPressedHandler(event: InputEvent): void;
}
export declare class ButtonPressed extends InteractionBase<WidgetData<HTMLButtonElement>, WidgetDataImpl<HTMLButtonElement>, FSMImpl<ButtonPressedFSMHandler>> {
    constructor(logger: Logger, name?: string);
    onNewNodeRegistered(node: EventTarget): void;
    onNodeUnregistered(node: EventTarget): void;
}
export {};
