import { TerminalState } from "../../fsm/TerminalState";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
import { MouseMoveTransition } from "../../fsm/MouseMoveTransition";
export class MouseMoveFSM extends FSMImpl {
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
        const move = new MouseMoveTransition(this.initState, moved);
        move.action = (event) => {
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onMove(event);
        };
    }
}
export class MouseMove extends InteractionBase {
    constructor() {
        super(new MouseMoveFSM(), new PointDataImpl());
        this.handler = {
            "onMove": (evt) => {
                this._data.copy(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}
