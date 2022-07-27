import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
import { MouseTransition } from "../../fsm/MouseTransition";
export class MouseEnterFSM extends FSMImpl {
    constructor(withBubbling, logger, dataHandler) {
        super(logger, dataHandler);
        this.withBubbling = withBubbling;
        const entered = this.addTerminalState("entered");
        const action = (event) => {
            this.dataHandler?.onEnter(event);
        };
        if (this.withBubbling) {
            new MouseTransition(this.initState, entered, "mouseover", action);
        }
        else {
            new MouseTransition(this.initState, entered, "mouseenter", action);
        }
    }
}
export class MouseEnter extends InteractionBase {
    constructor(withBubbling, logger) {
        const handler = {
            "onEnter": (evt) => {
                this._data.copy(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new MouseEnterFSM(withBubbling, logger, handler), new PointDataImpl(), logger);
    }
}
