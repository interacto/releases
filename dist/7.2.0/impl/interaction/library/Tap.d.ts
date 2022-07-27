import { InteractionBase } from "../InteractionBase";
import { FSMImpl } from "../../fsm/FSMImpl";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import type { TapData } from "../../../api/interaction/TapData";
import { TapDataImpl } from "../TapDataImpl";
import type { Logger } from "../../../api/logging/Logger";
declare class TapFSM extends FSMImpl<TapFSMHandler> {
    private countTaps;
    private readonly nbTaps;
    private touchID?;
    constructor(nbTaps: number, logger: Logger, dataHandler: TapFSMHandler);
    reinit(): void;
}
interface TapFSMHandler extends FSMDataHandler {
    tap(evt: TouchEvent): void;
}
export declare class Tap extends InteractionBase<TapData, TapDataImpl, TapFSM> {
    constructor(numberTaps: number, logger: Logger);
}
export {};
