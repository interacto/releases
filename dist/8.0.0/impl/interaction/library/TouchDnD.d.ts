import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { SrcTgtTouchDataImpl } from "../SrcTgtTouchDataImpl";
import type { SrcTgtPointsData } from "../../../api/interaction/SrcTgtPointsData";
import type { TouchData } from "../../../api/interaction/TouchData";
import type { Logger } from "../../../api/logging/Logger";
import type { CancellingState } from "../../fsm/CancellingState";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
import type { StdState } from "../../fsm/StdState";
export declare class TouchDnDFSM extends FSMImpl<TouchDnDFSMHandler> {
    protected touchID: number | undefined;
    protected readonly cancellable: boolean;
    protected readonly movementRequired: boolean;
    protected readonly cancelled: CancellingState;
    protected readonly moved: StdState;
    protected readonly touched: StdState;
    constructor(cancellable: boolean, logger: Logger, dataHandler: TouchDnDFSMHandler, movementRequired?: boolean);
    protected buildFSM(): void;
    getTouchId(): number | undefined;
    reinit(): void;
}
export declare class OneTouchDnDFSM extends TouchDnDFSM {
    constructor(cancellable: boolean, logger: Logger, dataHandler: TouchDnDFSMHandler);
    protected buildFSM(): void;
}
export interface TouchDnDFSMHandler extends FSMDataHandler {
    onTouch(event: TouchEvent): void;
    onMove(event: TouchEvent): void;
    onRelease(event: TouchEvent): void;
}
export declare class TouchDnD extends InteractionBase<SrcTgtPointsData<TouchData>, SrcTgtTouchDataImpl, OneTouchDnDFSM> {
    constructor(logger: Logger, cancellable: boolean, fsm?: OneTouchDnDFSM, name?: string);
    private setTgtData;
}
