import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import type { ScrollData } from "../../../api/interaction/ScrollData";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { ScrollDataImpl } from "../ScrollDataImpl";
import type { Logger } from "../../../api/logging/Logger";
export declare class ScrollFSM extends FSMImpl<ScrollFSMHandler> {
    constructor(logger: Logger, dataHandler: ScrollFSMHandler);
}
interface ScrollFSMHandler extends FSMDataHandler {
    initToScroll(event: Event): void;
}
export declare class Scroll extends InteractionBase<ScrollData, ScrollDataImpl, ScrollFSM> {
    constructor(logger: Logger);
}
export {};
