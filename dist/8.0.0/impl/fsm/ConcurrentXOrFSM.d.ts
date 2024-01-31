import { FSMImpl } from "./FSMImpl";
import type { FSMDataHandler } from "./FSMDataHandler";
import type { ConcurrentFSM } from "../../api/fsm/ConcurrentFSM";
import type { FSM } from "../../api/fsm/FSM";
import type { VisitorFSM } from "../../api/fsm/VisitorFSM";
import type { Logger } from "../../api/logging/Logger";
export declare class ConcurrentXOrFSM<F extends FSM, T extends FSMDataHandler> extends FSMImpl<T> implements ConcurrentFSM<F> {
    private readonly _conccurFSMs;
    constructor(fsms: ReadonlyArray<F>, logger: Logger, dataHandler?: T);
    process(event: Event): boolean;
    getAllConccurFSMs(): ReadonlyArray<F>;
    get started(): boolean;
    set log(log: boolean);
    uninstall(): void;
    fullReinit(): void;
    reinit(): void;
    acceptVisitor(visitor: VisitorFSM): void;
}
