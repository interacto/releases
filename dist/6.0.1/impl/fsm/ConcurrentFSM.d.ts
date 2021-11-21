import type { FSM } from "../../api/fsm/FSM";
import { FSMImpl } from "./FSMImpl";
export declare class ConcurrentFSM<F extends FSM> extends FSMImpl {
    private readonly _conccurFSMs;
    private readonly _secondaryFSMs;
    private readonly totalReinit;
    constructor(fsms: ReadonlyArray<F>, secondaries?: ReadonlyArray<F>, totalReinit?: boolean);
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
