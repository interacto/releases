import { TerminalState } from "../../fsm/TerminalState";
import { KeyDownTransition } from "../../fsm/KeyDownTransition";
import { StdState } from "../../fsm/StdState";
import { KeyUpTransition } from "../../fsm/KeyUpTransition";
import { FSMImpl } from "../../fsm/FSMImpl";
import { KeyDataImpl } from "../KeyDataImpl";
import { InteractionBase } from "../InteractionBase";
export class KeyTypedFSM extends FSMImpl {
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const pressed = new StdState(this, "pressed");
        const typed = new TerminalState(this, "typed");
        this.startingState = typed;
        this.addState(pressed);
        this.addState(typed);
        const kp = new KeyDownTransition(this.initState, pressed);
        kp.action = (event) => {
            this.checkKey = event.code;
        };
        const kr = new KeyUpTransition(pressed, typed);
        kr.isGuardOK = (event) => this.checkKey === undefined || event.code === this.checkKey;
        kr.action = (event) => {
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onKeyTyped(event);
        };
    }
    reinit() {
        super.reinit();
        this.checkKey = undefined;
    }
}
export class KeyTyped extends InteractionBase {
    constructor() {
        super(new KeyTypedFSM(), new KeyDataImpl());
        this.handler = {
            "onKeyTyped": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}
