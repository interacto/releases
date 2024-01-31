import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { MousePointsDataImpl } from "../MousePointsDataImpl";
import type { MousePointsData } from "../../../api/interaction/MousePointsData";
import type { Logger } from "../../../api/logging/Logger";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
interface ClicksFSMHandler extends FSMDataHandler {
    click(evt: MouseEvent): void;
}
export declare class ClicksFSM extends FSMImpl<ClicksFSMHandler> {
    private countClicks;
    private readonly nbClicks;
    constructor(nbClicks: number, logger: Logger, dataHandler: ClicksFSMHandler);
    reinit(): void;
}
export declare class Clicks extends InteractionBase<MousePointsData, MousePointsDataImpl, ClicksFSM> {
    constructor(numberClicks: number, logger: Logger, name?: string);
}
export {};
