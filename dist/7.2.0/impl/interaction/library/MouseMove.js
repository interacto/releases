import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
import { MouseTransition } from "../../fsm/MouseTransition";
export class MouseMoveFSM extends FSMImpl {
    constructor(logger, dataHandler) {
        super(logger, dataHandler);
        new MouseTransition(this.initState, this.addTerminalState("moved"), "mousemove", (event) => {
            this.dataHandler?.onMove(event);
        });
    }
}
export class MouseMove extends InteractionBase {
    constructor(logger) {
        const handler = {
            "onMove": (evt) => {
                this._data.copy(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new MouseMoveFSM(logger, handler), new PointDataImpl(), logger);
    }
}
