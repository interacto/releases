import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import type { TouchData } from "../../../api/interaction/TouchData";
import { TouchDataImpl } from "../TouchDataImpl";
import type { Logger } from "../../../api/logging/Logger";
declare class LongTouchFSM extends FSMImpl<LongTouchFSMHandler> {
    private readonly duration;
    private currentTouchID?;
    constructor(duration: number, logger: Logger, dataHandler: LongTouchFSMHandler);
    reinit(): void;
}
interface LongTouchFSMHandler extends FSMDataHandler {
    tap(evt: TouchEvent): void;
}
export declare class LongTouch extends InteractionBase<TouchData, TouchDataImpl, LongTouchFSM> {
    constructor(duration: number, logger: Logger);
}
export {};
