import { TouchDnDFSM } from "./TouchDnD";
import { ConcurrentAndFSM } from "../../fsm/ConcurrentAndFSM";
import { ConcurrentInteraction } from "../ConcurrentInteraction";
import { MultiTouchDataImpl } from "../MultiTouchDataImpl";
import type { TouchDnDFSMHandler } from "./TouchDnD";
import type { MultiTouchData } from "../../../api/interaction/MultiTouchData";
import type { Logger } from "../../../api/logging/Logger";
export declare class MultiTouchFSM extends ConcurrentAndFSM<TouchDnDFSM, TouchDnDFSMHandler> {
    constructor(nbTouch: number, totalReinit: boolean, logger: Logger, dataHandler: TouchDnDFSMHandler, movementRequired?: boolean);
    process(event: Event): boolean;
}
export declare class MultiTouch extends ConcurrentInteraction<MultiTouchData, MultiTouchDataImpl, MultiTouchFSM> {
    constructor(nbTouches: number, strict: boolean, logger: Logger, name?: string);
}
