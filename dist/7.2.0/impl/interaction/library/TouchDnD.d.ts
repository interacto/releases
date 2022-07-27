import { InteractionBase } from "../InteractionBase";
import { FSMImpl } from "../../fsm/FSMImpl";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import { SrcTgtTouchDataImpl } from "../SrcTgtTouchDataImpl";
import type { SrcTgtPointsData } from "../../../api/interaction/SrcTgtPointsData";
import type { TouchData } from "../../../api/interaction/TouchData";
import type { Logger } from "../../../api/logging/Logger";
export declare class TouchDnDFSM extends FSMImpl<TouchDnDFSMHandler> {
    private touchID?;
    private readonly cancellable;
    private readonly movementRequired;
    constructor(cancellable: boolean, logger: Logger, dataHandler: TouchDnDFSMHandler, movementRequired?: boolean);
    private buildFSM;
    getTouchId(): number | undefined;
    reinit(): void;
}
export interface TouchDnDFSMHandler extends FSMDataHandler {
    onTouch(event: TouchEvent): void;
    onMove(event: TouchEvent): void;
    onRelease(event: TouchEvent): void;
}
export declare class TouchDnD extends InteractionBase<SrcTgtPointsData<TouchData>, SrcTgtTouchDataImpl, TouchDnDFSM> {
    constructor(logger: Logger, cancellable: boolean, movementRequired?: boolean, fsm?: TouchDnDFSM);
    private setTgtData;
}
