import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
import { MouseTransition } from "../../fsm/MouseTransition";
export class MouseUpFSM extends FSMImpl {
    constructor(logger, dataHandler) {
        super(logger, dataHandler);
        new MouseTransition(this.initState, this.addTerminalState("released"), "mouseup", (event) => {
            this.dataHandler?.initToPress(event);
        });
    }
}
export class MouseUp extends InteractionBase {
    constructor(logger) {
        const handler = {
            "initToPress": (evt) => {
                this._data.copy(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new MouseUpFSM(logger, handler), new PointDataImpl(), logger);
    }
}
