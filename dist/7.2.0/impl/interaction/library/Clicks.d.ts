import { FSMImpl } from "../../fsm/FSMImpl";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import { InteractionBase } from "../InteractionBase";
import type { PointsData } from "../../../api/interaction/PointsData";
import { PointsDataImpl } from "../PointsDataImpl";
import type { Logger } from "../../../api/logging/Logger";
export declare class ClicksFSM extends FSMImpl<ClicksFSMHandler> {
    private countClicks;
    private readonly nbClicks;
    constructor(nbClicks: number, logger: Logger, dataHandler: ClicksFSMHandler);
    reinit(): void;
}
interface ClicksFSMHandler extends FSMDataHandler {
    click(evt: MouseEvent): void;
}
export declare class Clicks extends InteractionBase<PointsData, PointsDataImpl, ClicksFSM> {
    constructor(numberClicks: number, logger: Logger);
}
export {};
