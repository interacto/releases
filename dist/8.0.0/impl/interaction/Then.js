import { InteractionBase } from "./InteractionBase";
import { ThenDataImpl } from "./ThenDataImpl";
import { ThenFSM } from "../fsm/ThenFSM";
export class Then extends InteractionBase {
    ix;
    constructor(ix, logger) {
        super(new ThenFSM(ix.map(inter => inter.fsm), logger), new ThenDataImpl(ix.map(inter => inter.data)), logger, "");
        this.ix = ix;
    }
    uninstall() {
        super.uninstall();
        for (const inter of this.ix) {
            inter.uninstall();
        }
    }
    reinit() {
        super.reinit();
        for (const inter of this.ix) {
            inter.reinit();
        }
    }
    fullReinit() {
        super.fullReinit();
        for (const inter of this.ix) {
            inter.fullReinit();
        }
    }
    reinitData() {
        super.reinitData();
        for (const inter of this.ix) {
            inter.reinitData();
        }
    }
}
