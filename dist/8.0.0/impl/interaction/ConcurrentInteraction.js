import { InteractionBase } from "./InteractionBase";
export class ConcurrentInteraction extends InteractionBase {
    subscriptions;
    constructor(fsm, data, logger, name) {
        super(fsm, data, logger, name);
        this.subscriptions = this.fsm.getAllConccurFSMs()
            .map(conc => conc.currentStateObservable
            .subscribe(current => {
            this.updateEventsRegistered(current[1], current[0]);
        }));
    }
    isRunning() {
        return this.isActivated() && this.fsm.started;
    }
    onNodeUnregistered(node) {
        for (const type of this.getCurrentAcceptedEvents()) {
            this.unregisterEventToNode(type, node);
        }
    }
    onNewNodeRegistered(node) {
        for (const type of this.getCurrentAcceptedEvents()) {
            this.registerEventToNode(type, node);
        }
    }
    getCurrentAcceptedEvents(_state) {
        return this.fsm.getAllConccurFSMs().flatMap(concFSM => Array.from(this.getEventTypesOf(concFSM.currentState)));
    }
    uninstall() {
        super.uninstall();
        for (const sub of this.subscriptions) {
            sub.unsubscribe();
        }
    }
}
