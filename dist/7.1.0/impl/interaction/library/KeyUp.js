import { TerminalState } from "../../fsm/TerminalState";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { KeyDataImpl } from "../KeyDataImpl";
import { KeyUpTransition } from "../../fsm/KeyUpTransition";
export class KeyUpFSM extends FSMImpl {
    constructor(modifierAccepted) {
        super();
        this.modifiersAccepted = modifierAccepted;
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const released = new TerminalState(this, "released");
        this.addState(released);
        const release = new KeyUpTransition(this.initState, released);
        release.action = (event) => {
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onKeyUp(event);
        };
        release.isGuardOK = (event) => this.modifiersAccepted ||
            (!event.altKey && !event.ctrlKey && !event.shiftKey && !event.metaKey);
    }
    reinit() {
        super.reinit();
    }
}
export class KeyUp extends InteractionBase {
    constructor(modifierAccepted, fsm) {
        super(fsm !== null && fsm !== void 0 ? fsm : new KeyUpFSM(modifierAccepted), new KeyDataImpl());
        this.handler = {
            "onKeyUp": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}
