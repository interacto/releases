import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { WidgetDataImpl } from "../WidgetDataImpl";
import type { WidgetData } from "../../../api/interaction/WidgetData";
import type { Logger } from "../../../api/logging/Logger";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
interface SpinnerChangedHandler extends FSMDataHandler {
    initToChangedHandler(event: Event): void;
}
export declare class SpinnerChangedFSM extends FSMImpl<SpinnerChangedHandler> {
    private static timeGap;
    private static readonly timeGapSupplier;
    static getTimeGap(): number;
    static setTimeGap(timeGapBetweenClicks: number): void;
    constructor(logger: Logger, dataHandler: SpinnerChangedHandler);
}
export declare class SpinnerChanged extends InteractionBase<WidgetData<HTMLInputElement>, WidgetDataImpl<HTMLInputElement>, SpinnerChangedFSM> {
    constructor(logger: Logger, name?: string);
    onNewNodeRegistered(node: EventTarget): void;
    onNodeUnregistered(node: EventTarget): void;
}
export {};
