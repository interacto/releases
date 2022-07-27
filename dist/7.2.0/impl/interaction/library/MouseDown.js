import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
import { MouseTransition } from "../../fsm/MouseTransition";
export class MouseDownFSM extends FSMImpl {
    constructor(logger, dataHandler) {
        super(logger, dataHandler);
        new MouseTransition(this.initState, this.addTerminalState("pressed"), "mousedown", (event) => {
            this.dataHandler?.initToPress(event);
        });
    }
}
export class MouseDown extends InteractionBase {
    constructor(logger) {
        const handler = {
            "initToPress": (evt) => {
                this._data.copy(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new MouseDownFSM(logger, handler), new PointDataImpl(), logger);
    }
}
