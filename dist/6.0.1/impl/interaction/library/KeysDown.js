import { StdState } from "../../fsm/StdState";
import { TerminalState } from "../../fsm/TerminalState";
import { KeyDownTransition } from "../../fsm/KeyDownTransition";
import { KeyUpTransition } from "../../fsm/KeyUpTransition";
import { FSMImpl } from "../../fsm/FSMImpl";
import { KeysDataImpl } from "../KeysDataImpl";
import { InteractionBase } from "../InteractionBase";
export class KeysDownFSM extends FSMImpl {
    constructor() {
        super();
        this.currentCodes = [];
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const pressed = new StdState(this, "pressed");
        const ended = new TerminalState(this, "ended");
        this.addState(pressed);
        this.addState(ended);
        const actionkp = (event) => {
            this.currentCodes.push(event.code);
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onKeyPressed(event);
        };
        const kpInit = new KeyDownTransition(this.initState, pressed);
        kpInit.action = actionkp;
        const kpPressed = new KeyDownTransition(pressed, pressed);
        kpPressed.action = actionkp;
        const kr = new KeyUpTransition(pressed, ended);
        kr.isGuardOK = (event) => this.currentCodes.find(value => value === event.code) !== undefined;
    }
    reinit() {
        this.currentCodes.length = 0;
        super.reinit();
    }
}
export class KeysDown extends InteractionBase {
    constructor() {
        super(new KeysDownFSM(), new KeysDataImpl());
        this.handler = {
            "onKeyPressed": (event) => {
                this._data.addKey(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}
