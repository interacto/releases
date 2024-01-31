import { ConcurrentInteraction } from "./ConcurrentInteraction";
import { ConcurrentXOrFSM } from "../fsm/ConcurrentXOrFSM";
export class Or extends ConcurrentInteraction {
    i1;
    i2;
    constructor(i1, i2, logger) {
        const handler = {
            "reinitData": () => { }
        };
        super(new ConcurrentXOrFSM([i1.fsm, i2.fsm], logger, handler), {
            "flush": () => { }
        }, logger, `${i1.name}-${i2.name}`);
        this.i1 = i1;
        this.i2 = i2;
    }
    get data() {
        return this.i1.fsm.started ? this.i1.data : this.i2.data;
    }
    uninstall() {
        this.i1.uninstall();
        this.i2.uninstall();
    }
    reinit() {
        this.i1.reinit();
        this.i2.reinit();
        super.reinit();
    }
    fullReinit() {
        this.i1.fullReinit();
        this.i2.fullReinit();
        super.fullReinit();
    }
    reinitData() {
        this.i1.reinitData();
        this.i2.reinitData();
        super.reinitData();
    }
}
