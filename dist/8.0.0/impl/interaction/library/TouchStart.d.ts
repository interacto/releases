import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { TouchDataImpl } from "../TouchDataImpl";
import type { TouchData } from "../../../api/interaction/TouchData";
import type { Logger } from "../../../api/logging/Logger";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
declare class TouchStartFSM extends FSMImpl<TouchStartFSMHandler> {
    constructor(logger: Logger, dataHandler: TouchStartFSMHandler);
}
interface TouchStartFSMHandler extends FSMDataHandler {
    initToTouch(event: TouchEvent): void;
}
export declare class TouchStart extends InteractionBase<TouchData, TouchDataImpl, TouchStartFSM> {
    constructor(logger: Logger, name?: string);
}
export {};
