import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { ScrollDataImpl } from "../ScrollDataImpl";
import type { ScrollData } from "../../../api/interaction/ScrollData";
import type { Logger } from "../../../api/logging/Logger";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
interface ScrollFSMHandler extends FSMDataHandler {
    initToScroll(event: Event): void;
}
export declare class ScrollFSM extends FSMImpl<ScrollFSMHandler> {
    constructor(logger: Logger, dataHandler: ScrollFSMHandler);
}
export declare class Scroll extends InteractionBase<ScrollData, ScrollDataImpl, ScrollFSM> {
    constructor(logger: Logger, name?: string);
}
export {};
