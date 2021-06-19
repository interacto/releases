import { StateBase } from "./StateBase";
export class OutputStateBase extends StateBase {
    constructor(stateMachine, stateName) {
        super(stateMachine, stateName);
        this.transitions = [];
    }
    process(event) {
        return this.getTransitions().find(tr => {
            try {
                return tr.execute(event) !== undefined;
            }
            catch (ignored) {
                return false;
            }
        }) !== undefined;
    }
    clearTransitions() {
        this.transitions.length = 0;
    }
    getTransitions() {
        return [...this.transitions];
    }
    addTransition(tr) {
        this.transitions.push(tr);
    }
    uninstall() {
        super.uninstall();
        this.transitions.forEach(tr => {
            tr.uninstall();
        });
        this.transitions.length = 0;
    }
}
