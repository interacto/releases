import { TerminalState } from "../../fsm/TerminalState";
import { MouseDownTransition } from "../../fsm/MouseDownTransition";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
export class MouseDownFSM extends FSMImpl {
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const pressed = new TerminalState(this, "pressed");
        this.addState(pressed);
        const pressure = new MouseDownTransition(this.initState, pressed);
        pressure.action = (event) => {
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.initToPress(event);
        };
    }
}
export class MouseDown extends InteractionBase {
    constructor() {
        super(new MouseDownFSM(), new PointDataImpl());
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
