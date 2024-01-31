import { FSMImpl } from "../../fsm/FSMImpl";
import { MouseTransition } from "../../fsm/MouseTransition";
import { TerminalState } from "../../fsm/TerminalState";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
export class MouseLeaveFSM extends FSMImpl {
    withBubbling;
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
    constructor(withBubbling, logger, name) {
        const handler = {
            "onExit": (evt) => {
                this._data.copy(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new MouseLeaveFSM(withBubbling, logger, handler), new PointDataImpl(), logger, name ?? MouseLeave.name);
    }
}
