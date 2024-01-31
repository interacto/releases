import { FSMImpl } from "../../fsm/FSMImpl";
import { MouseTransition } from "../../fsm/MouseTransition";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
export class MouseUpFSM extends FSMImpl {
    constructor(logger, dataHandler) {
        super(logger, dataHandler);
        new MouseTransition(this.initState, this.addTerminalState("released"), "mouseup", (event) => {
            this.dataHandler?.initToPress(event);
        });
    }
}
export class MouseUp extends InteractionBase {
    constructor(logger, name) {
        const handler = {
            "initToPress": (evt) => {
                this._data.copy(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new MouseUpFSM(logger, handler), new PointDataImpl(), logger, name ?? MouseUp.name);
    }
}
