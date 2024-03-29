import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { WidgetDataImpl } from "../WidgetDataImpl";
import type { WidgetData } from "../../../api/interaction/WidgetData";
import type { Logger } from "../../../api/logging/Logger";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
declare class HyperLinkClickedFSM extends FSMImpl<HyperLinkClickedFSMHandler> {
    constructor(logger: Logger, dataHandler: HyperLinkClickedFSMHandler);
}
interface HyperLinkClickedFSMHandler extends FSMDataHandler {
    initToClickedHandler(event: Event): void;
}
export declare class HyperLinkClicked extends InteractionBase<WidgetData<HTMLAnchorElement>, WidgetDataImpl<HTMLAnchorElement>, HyperLinkClickedFSM> {
    constructor(logger: Logger, name?: string);
    onNewNodeRegistered(node: EventTarget): void;
    onNodeUnregistered(node: EventTarget): void;
}
export {};
