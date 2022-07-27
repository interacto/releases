import { ConcurrentFSM } from "../../fsm/ConcurrentFSM";
import { ConcurrentInteraction } from "../ConcurrentInteraction";
import type { MultiTouchData } from "../../../api/interaction/MultiTouchData";
import type { TouchDnDFSMHandler } from "./TouchDnD";
import { TouchDnDFSM } from "./TouchDnD";
import { MultiTouchDataImpl } from "../MultiTouchDataImpl";
import type { Logger } from "../../../api/logging/Logger";
declare class MultiTouchFSM extends ConcurrentFSM<TouchDnDFSM, TouchDnDFSMHandler> {
    constructor(nbTouch: number, totalReinit: boolean, logger: Logger, dataHandler: TouchDnDFSMHandler);
    process(event: Event): boolean;
}
export declare class MultiTouch extends ConcurrentInteraction<MultiTouchData, MultiTouchDataImpl, MultiTouchFSM> {
    constructor(nbTouches: number, strict: boolean, logger: Logger);
}
export {};
