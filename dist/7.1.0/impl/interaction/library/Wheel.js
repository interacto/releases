import { TerminalState } from "../../fsm/TerminalState";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { WheelTransition } from "../../fsm/WheelTransition";
import { WheelDataImpl } from "../WheelDataImpl";
export class WheelFSM extends FSMImpl {
    constructor() {
        super();
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const moved = new TerminalState(this, "moved");
        this.addState(moved);
        const move = new WheelTransition(this.initState, moved);
        move.action = (event) => {
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.initToMoved(event);
        };
    }
}
export class Wheel extends InteractionBase {
    constructor(fsm, data) {
        super(fsm !== null && fsm !== void 0 ? fsm : new WheelFSM(), data !== null && data !== void 0 ? data : new WheelDataImpl());
        this.handler = {
            "initToMoved": (evt) => {
                this._data.copy(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}
