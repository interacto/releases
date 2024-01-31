import type { FSM } from "./FSM";
export interface ConcurrentFSM<F extends FSM> extends FSM {
    getAllConccurFSMs(): ReadonlyArray<F>;
}
