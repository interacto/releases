export class StateBase {
    fsm;
    name;
    constructor(stateMachine, stateName) {
        this.fsm = stateMachine;
        this.name = stateName;
    }
    checkStartingState() {
        if (!this.fsm.started && this.fsm.startingState === this) {
            this.fsm.onStarting();
        }
    }
    uninstall() { }
}
