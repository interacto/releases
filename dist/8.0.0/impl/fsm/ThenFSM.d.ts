import { FSMImpl } from "./FSMImpl";
import type { FSMDataHandler } from "./FSMDataHandler";
import type { FSM } from "../../api/fsm/FSM";
import type { Logger } from "../../api/logging/Logger";
export declare class ThenFSM<T extends FSMDataHandler> extends FSMImpl<T> {
    constructor(fsms: Array<FSM>, logger: Logger);
}
