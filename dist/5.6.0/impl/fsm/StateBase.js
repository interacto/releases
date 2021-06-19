export class StateBase {
    constructor(stateMachine, stateName) {
        this.fsm = stateMachine;
        this.name = stateName;
    }
    checkStartingState() {
        if (!this.getFSM().isStarted() && this.getFSM().getStartingState() === this) {
            this.getFSM().onStarting();
        }
    }
    getName() {
        return this.name;
    }
    getFSM() {
        return this.fsm;
    }
    uninstall() {
    }
}
