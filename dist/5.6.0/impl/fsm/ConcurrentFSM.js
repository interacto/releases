import { FSMImpl } from "./FSMImpl";
export class ConcurrentFSM extends FSMImpl {
    constructor(fsms) {
        super();
        if (fsms.length < 2) {
            throw new Error(`Requires more that 1 FSM: ${String(fsms)}`);
        }
        const handler = {
            "fsmStarts": () => {
                if (this.isStarted()) {
                    this.onStarting();
                }
            },
            "fsmUpdates": () => {
                this.onUpdating();
            },
            "fsmStops": () => {
                this.onTerminating();
            },
            "fsmCancels": () => {
                this.onCancelling();
            }
        };
        this.conccurFSMs = [...fsms];
        this.conccurFSMs.forEach(fsm => {
            fsm.addHandler(handler);
        });
    }
    getConccurFSMs() {
        return [...this.conccurFSMs];
    }
    process(event) {
        return this.conccurFSMs.some(conccurFSM => conccurFSM.process(event));
    }
    isStarted() {
        return this.conccurFSMs.every(fsm => fsm.isStarted());
    }
    log(log) {
        super.log(log);
        this.conccurFSMs.forEach(fsm => {
            fsm.log(log);
        });
    }
    uninstall() {
        super.uninstall();
        this.conccurFSMs.forEach(fsm => {
            fsm.uninstall();
        });
    }
}
