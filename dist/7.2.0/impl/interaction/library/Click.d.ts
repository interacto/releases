import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import type { PointData } from "../../../api/interaction/PointData";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
import type { Logger } from "../../../api/logging/Logger";
export declare class ClickFSM extends FSMImpl<ClickFSMHandler> {
    private checkButton?;
    constructor(logger: Logger, dataHandler?: ClickFSMHandler);
    getCheckButton(): number;
    setCheckButton(buttonToCheck: number): void;
    reinit(): void;
}
interface ClickFSMHandler extends FSMDataHandler {
    initToClicked(event: MouseEvent): void;
}
export declare class Click extends InteractionBase<PointData, PointDataImpl, ClickFSM> {
    constructor(logger: Logger, fsm?: ClickFSM, data?: PointDataImpl);
}
export {};
