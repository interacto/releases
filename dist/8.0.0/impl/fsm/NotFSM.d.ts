import { ConcurrentAndFSM } from "./ConcurrentAndFSM";
import type { FSMDataHandler } from "./FSMDataHandler";
import type { FSM } from "../../api/fsm/FSM";
import type { Logger } from "../../api/logging/Logger";
export declare class NotFSM<H extends FSMDataHandler> extends ConcurrentAndFSM<FSM, H> {
    private readonly mainFSM;
    constructor(mainFSM: FSM, negFSM: FSM, logger: Logger);
}
