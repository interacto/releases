import { FSMImpl } from "./FSMImpl";
export class ConcurrentAndFSM extends FSMImpl {
    _conccurFSMs;
    _secondaryFSMs;
    totalReinit;
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
        this._conccurFSMs = Array.from(fsms);
        this._secondaryFSMs = Array.from(secondaries);
        for (const fsm of this.conccurFSMs) {
            fsm.addHandler(handler);
        }
    }
    getAllConccurFSMs() {
        return [...this._conccurFSMs, ...this._secondaryFSMs];
    }
    get conccurFSMs() {
        return Array.from(this._conccurFSMs);
    }
    get secondaryFSMs() {
        return Array.from(this._secondaryFSMs);
    }
    process(event) {
        return this.getAllConccurFSMs().some(conccurFSM => conccurFSM.process(event));
    }
    acceptVisitor(visitor) {
        visitor.visitAndConcurrentFSM(this);
    }
    get started() {
        return this.conccurFSMs.every(fsm => fsm.started);
    }
    set log(log) {
        super.log = log;
        for (const fsm of this.conccurFSMs) {
            fsm.log = log;
        }
        for (const fsm of this.secondaryFSMs) {
            fsm.log = log;
        }
    }
    uninstall() {
        super.uninstall();
        for (const fsm of this.conccurFSMs) {
            fsm.uninstall();
        }
        for (const fsm of this.secondaryFSMs) {
            fsm.uninstall();
        }
    }
    fullReinit() {
        if (this.totalReinit) {
            for (const fsm of this.conccurFSMs) {
                fsm.fullReinit();
            }
            for (const fsm of this.secondaryFSMs) {
                fsm.fullReinit();
            }
        }
        super.fullReinit();
    }
}
