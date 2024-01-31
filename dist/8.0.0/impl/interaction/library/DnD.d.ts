import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { SrcTgtPointsDataImpl } from "../SrcTgtPointsDataImpl";
import type { PointData } from "../../../api/interaction/PointData";
import type { SrcTgtPointsData } from "../../../api/interaction/SrcTgtPointsData";
import type { Logger } from "../../../api/logging/Logger";
import type { FSMDataHandler } from "../../fsm/FSMDataHandler";
declare class DnDFSM extends FSMImpl<DnDFSMHandler> {
    private readonly cancellable;
    private buttonToCheck;
    constructor(cancellable: boolean, logger: Logger, dataHandler: DnDFSMHandler);
    reinit(): void;
}
interface DnDFSMHandler extends FSMDataHandler {
    onPress(event: Event): void;
    onDrag(event: Event): void;
    onRelease(event: Event): void;
}
export declare class DnD extends InteractionBase<SrcTgtPointsData<PointData>, SrcTgtPointsDataImpl, DnDFSM> {
    constructor(cancellable: boolean, logger: Logger, name?: string);
}
export {};
