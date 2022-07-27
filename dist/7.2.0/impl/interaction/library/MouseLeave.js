import { TerminalState } from "../../fsm/TerminalState";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
import { MouseTransition } from "../../fsm/MouseTransition";
export class MouseLeaveFSM extends FSMImpl {
    constructor(withBubbling, logger, dataHandler) {
        super(logger, dataHandler);
        this.withBubbling = withBubbling;
        const exited = new TerminalState(this, "exited");
        const action = (event) => {
            this.dataHandler?.onExit(event);
        };
        if (this.withBubbling) {
            new MouseTransition(this.initState, exited, "mouseout", action);
        }
        else {
            new MouseTransition(this.initState, exited, "mouseleave", action);
        }
    }
}
export class MouseLeave extends InteractionBase {
    constructor(withBubbling, logger) {
        const handler = {
            "onExit": (evt) => {
                this._data.copy(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new MouseLeaveFSM(withBubbling, logger, handler), new PointDataImpl(), logger);
    }
}
