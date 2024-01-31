import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
import type { PointData } from "../../../api/interaction/PointData";
import type { Logger } from "../../../api/logging/Logger";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
interface ClickFSMHandler extends FSMDataHandler {
    initToClicked(event: MouseEvent): void;
}
export declare class TimedClickFSM extends FSMImpl<ClickFSMHandler> {
    private currentButton;
    private readonly buttonToConsider;
    constructor(duration: number, logger: Logger, button?: number, dataHandler?: ClickFSMHandler);
    private setButtonToCheck;
    reinit(): void;
}
export declare class TimedClick extends InteractionBase<PointData, PointDataImpl, TimedClickFSM> {
    constructor(duration: number, logger: Logger, button?: number, fsm?: TimedClickFSM, data?: PointDataImpl, name?: string);
}
export {};
