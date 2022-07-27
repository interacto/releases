import type { FSM } from "../../api/fsm/FSM";
import { FSMImpl } from "./FSMImpl";
import type { FSMDataHandler } from "./FSMDataHandler";
import type { Logger } from "../../api/logging/Logger";
export declare class ConcurrentFSM<F extends FSM, T extends FSMDataHandler> extends FSMImpl<T> {
    private readonly _conccurFSMs;
    private readonly _secondaryFSMs;
    private readonly totalReinit;
    constructor(fsms: ReadonlyArray<F>, logger: Logger, secondaries?: ReadonlyArray<F>, totalReinit?: boolean, dataHandler?: T);
    getAllConccurFSMs(): ReadonlyArray<F>;
    get conccurFSMs(): ReadonlyArray<F>;
    get secondaryFSMs(): ReadonlyArray<FSM>;
    process(event: Event): boolean;
    get started(): boolean;
    set log(log: boolean);
    uninstall(): void;
    fullReinit(): void;
    reinit(): void;
}
