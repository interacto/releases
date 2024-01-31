import { ClickFSM } from "./Click";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
import type { PointData } from "../../../api/interaction/PointData";
import type { Logger } from "../../../api/logging/Logger";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
export declare class DoubleClickFSM extends FSMImpl<FSMDataHandler> {
    private static timeGap;
    private static readonly timeGapSupplier;
    static getTimeGap(): number;
    static setTimeGap(timeGapBetweenClicks: number): void;
    readonly firstClickFSM: ClickFSM;
    private readonly sndClickFSM;
    private checkButton;
    constructor(logger: Logger, dataHandler?: FSMDataHandler);
    set log(log: boolean);
    setCheckButton(buttonToCheck: number): void;
    getCheckButton(): number;
    fullReinit(): void;
    reinit(): void;
}
export declare class DoubleClick extends InteractionBase<PointData, PointDataImpl, DoubleClickFSM> {
    constructor(logger: Logger, fsm?: DoubleClickFSM, data?: PointDataImpl, name?: string);
}
