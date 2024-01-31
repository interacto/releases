import { FSMImpl } from "./FSMImpl";
export class ConcurrentXOrFSM extends FSMImpl {
    _conccurFSMs;
    constructor(fsms, logger, dataHandler) {
        if (new Set(fsms.map(fsm => fsm.constructor.name)).size !== fsms.length) {
            throw new Error("Cannot create an XOR interaction using two interactions of the same type");
        }
        super(logger, dataHandler);
        const handler = {
            "fsmStarts": () => {
                this.onStarting();
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
        for (const fsm of this._conccurFSMs) {
            fsm.addHandler(handler);
        }
    }
    process(event) {
        const startedFSM = this._conccurFSMs.find(fsm => fsm.started);
        if (startedFSM === undefined) {
            return this._conccurFSMs.some(conccurFSM => conccurFSM.process(event));
        }
        return startedFSM.process(event);
    }
    getAllConccurFSMs() {
        return Array.from(this._conccurFSMs);
    }
    get started() {
        return this._conccurFSMs.some(fsm => fsm.started);
    }
    set log(log) {
        super.log = log;
        for (const fsm of this._conccurFSMs) {
            fsm.log = log;
        }
    }
    uninstall() {
        super.uninstall();
        for (const fsm of this._conccurFSMs) {
            fsm.uninstall();
        }
    }
    fullReinit() {
        for (const fsm of this._conccurFSMs) {
            fsm.fullReinit();
        }
        super.fullReinit();
    }
    reinit() {
        for (const fsm of this._conccurFSMs) {
            fsm.reinit();
        }
        super.reinit();
    }
    acceptVisitor(visitor) {
        visitor.visitXOrConcurrentFSM(this);
    }
}
