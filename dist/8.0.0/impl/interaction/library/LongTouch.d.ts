import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { TouchDataImpl } from "../TouchDataImpl";
import type { TouchData } from "../../../api/interaction/TouchData";
import type { Logger } from "../../../api/logging/Logger";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
declare class LongTouchFSM extends FSMImpl<LongTouchFSMHandler> {
    private readonly duration;
    private currentTouchID;
    constructor(duration: number, logger: Logger, dataHandler: LongTouchFSMHandler);
    reinit(): void;
}
interface LongTouchFSMHandler extends FSMDataHandler {
    tap(evt: TouchEvent): void;
}
export declare class LongTouch extends InteractionBase<TouchData, TouchDataImpl, LongTouchFSM> {
    constructor(duration: number, logger: Logger, name?: string);
}
export {};
