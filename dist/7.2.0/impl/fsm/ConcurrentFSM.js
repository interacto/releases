import { FSMImpl } from "./FSMImpl";
export class ConcurrentFSM extends FSMImpl {
    constructor(fsms, logger, secondaries = [], totalReinit = false, dataHandler) {
        super(logger, dataHandler);
        this.totalReinit = totalReinit;
        const handler = {
            "fsmStarts": () => {
                if (this.started) {
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
            },
            "fsmError": (err) => {
                this.notifyHandlerOnError(err);
            }
        };
        this._conccurFSMs = [...fsms];
        this._secondaryFSMs = [...secondaries];
        this.conccurFSMs.forEach(fsm => {
            fsm.addHandler(handler);
        });
    }
    getAllConccurFSMs() {
        return [...this._conccurFSMs, ...this._secondaryFSMs];
    }
    get conccurFSMs() {
        return [...this._conccurFSMs];
    }
    get secondaryFSMs() {
        return [...this._secondaryFSMs];
    }
    process(event) {
        return this.getAllConccurFSMs().some(conccurFSM => conccurFSM.process(event));
    }
    get started() {
        return this.conccurFSMs.every(fsm => fsm.started);
    }
    set log(log) {
        super.log = log;
        this.conccurFSMs.forEach(fsm => {
            fsm.log = log;
        });
        this.secondaryFSMs.forEach(fsm => {
            fsm.log = log;
        });
    }
    uninstall() {
        super.uninstall();
        this.conccurFSMs.forEach(fsm => {
            fsm.uninstall();
        });
        this.secondaryFSMs.forEach(fsm => {
            fsm.uninstall();
        });
    }
    fullReinit() {
        if (this.totalReinit) {
            this.conccurFSMs.forEach(f => {
                f.fullReinit();
            });
            this.secondaryFSMs.forEach(f => {
                f.fullReinit();
            });
        }
        super.fullReinit();
    }
    reinit() {
        if (this.totalReinit) {
            this.conccurFSMs.forEach(f => {
                f.reinit();
            });
            this.secondaryFSMs.forEach(f => {
                f.reinit();
            });
        }
        super.reinit();
    }
}
