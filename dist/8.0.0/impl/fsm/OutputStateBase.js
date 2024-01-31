import { CancelFSMError } from "./CancelFSMError";
import { StateBase } from "./StateBase";
export class OutputStateBase extends StateBase {
    _transitions;
    constructor(stateMachine, stateName) {
        super(stateMachine, stateName);
        this._transitions = [];
    }
    process(event) {
        return this.transitions.some(tr => {
            try {
                return tr.execute(event) !== undefined;
            }
            catch (error) {
                if (error instanceof CancelFSMError) {
                    return false;
                }
                throw error;
            }
        });
    }
    clearTransitions() {
        this._transitions.length = 0;
    }
    get transitions() {
        return Array.from(this._transitions);
    }
    addTransition(tr) {
        this._transitions.push(tr);
    }
    uninstall() {
        super.uninstall();
        for (const tr of this.transitions) {
            tr.uninstall();
        }
        this._transitions.length = 0;
    }
}
