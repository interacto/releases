import { FSMImpl } from "./FSMImpl";
import { StdState } from "./StdState";
import { SubFSMTransition } from "./SubFSMTransition";
import { TerminalState } from "./TerminalState";
export class ThenFSM extends FSMImpl {
    constructor(fsms, logger) {
        super(logger);
        let currentState = this.initState;
        const last = fsms.length - 1;
        for (const [i, fsm] of fsms.entries()) {
            if (i === last) {
                new SubFSMTransition(currentState, new TerminalState(this, i.toString()), fsm);
            }
            else {
                const state = new StdState(this, i.toString());
                new SubFSMTransition(currentState, state, fsm);
                currentState = state;
            }
        }
    }
}
