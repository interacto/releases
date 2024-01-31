import { FSMImpl } from "./FSMImpl";
import type { FSMDataHandler } from "./FSMDataHandler";
import type { ConcurrentFSM } from "../../api/fsm/ConcurrentFSM";
import type { FSM } from "../../api/fsm/FSM";
import type { VisitorFSM } from "../../api/fsm/VisitorFSM";
import type { Logger } from "../../api/logging/Logger";
export declare class ConcurrentAndFSM<F extends FSM, T extends FSMDataHandler> extends FSMImpl<T> implements ConcurrentFSM<F> {
    private readonly _conccurFSMs;
    private readonly _secondaryFSMs;
    private readonly totalReinit;
    constructor(fsms: ReadonlyArray<F>, logger: Logger, secondaries?: ReadonlyArray<F>, totalReinit?: boolean, dataHandler?: T);
    getAllConccurFSMs(): ReadonlyArray<F>;
    get conccurFSMs(): ReadonlyArray<F>;
    get secondaryFSMs(): ReadonlyArray<FSM>;
    process(event: Event): boolean;
    acceptVisitor(visitor: VisitorFSM): void;
    get started(): boolean;
    set log(log: boolean);
    uninstall(): void;
    fullReinit(): void;
}
