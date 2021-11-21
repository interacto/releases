import { TerminalState } from "../../fsm/TerminalState";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
import { MouseUpTransition } from "../../fsm/MouseUpTransition";
export class MouseUpFSM extends FSMImpl {
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const released = new TerminalState(this, "released");
        this.addState(released);
        const release = new MouseUpTransition(this.initState, released);
        release.action = (event) => {
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.initToPress(event);
        };
    }
}
export class MouseUp extends InteractionBase {
    constructor() {
        super(new MouseUpFSM(), new PointDataImpl());
        this.handler = {
            "initToPress": (evt) => {
                this._data.copy(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}
