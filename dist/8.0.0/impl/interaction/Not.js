import { ConcurrentInteraction } from "./ConcurrentInteraction";
import { NotFSM } from "../fsm/NotFSM";
export class Not extends ConcurrentInteraction {
    mainInteraction;
    negInteraction;
    constructor(i1, not, logger, name) {
        super(new NotFSM(i1.fsm, not.fsm, logger), i1.data, logger, name);
        this.mainInteraction = i1;
        this.negInteraction = not;
    }
    uninstall() {
        this.mainInteraction.uninstall();
        this.negInteraction.uninstall();
        super.uninstall();
    }
    reinit() {
        this.mainInteraction.reinit();
        this.negInteraction.reinit();
        super.reinit();
    }
    fullReinit() {
        this.mainInteraction.fullReinit();
        this.negInteraction.fullReinit();
        super.fullReinit();
    }
    reinitData() {
        this.mainInteraction.reinitData();
        this.negInteraction.reinitData();
        super.reinitData();
    }
}
