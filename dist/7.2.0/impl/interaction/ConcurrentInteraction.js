import { InteractionBase } from "./InteractionBase";
export class ConcurrentInteraction extends InteractionBase {
    constructor(fsm, data, logger) {
        super(fsm, data, logger);
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
        this.getCurrentAcceptedEvents().forEach(type => {
            this.unregisterEventToNode(type, node);
        });
    }
    onNewNodeRegistered(node) {
        this.getCurrentAcceptedEvents().forEach(type => {
            this.registerEventToNode(type, node);
        });
    }
    getCurrentAcceptedEvents(_state) {
        return this.fsm.getAllConccurFSMs().flatMap(concFSM => [...this.getEventTypesOf(concFSM.currentState)]);
    }
    uninstall() {
        super.uninstall();
        this.subscriptions.forEach(sub => {
            sub.unsubscribe();
        });
    }
}
