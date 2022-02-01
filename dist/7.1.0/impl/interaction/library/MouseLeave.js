import { TerminalState } from "../../fsm/TerminalState";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
import { MouseOutTransition } from "../../fsm/MouseOutTransition";
import { MouseLeaveTransition } from "../../fsm/MouseLeaveTransition";
export class MouseLeaveFSM extends FSMImpl {
    constructor(withBubbling) {
        super();
        this.withBubbling = withBubbling;
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const exited = new TerminalState(this, "exited");
        this.addState(exited);
        let exit;
        if (this.withBubbling) {
            exit = new MouseOutTransition(this.initState, exited);
        }
        else {
            exit = new MouseLeaveTransition(this.initState, exited);
        }
        exit.action = (event) => {
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onExit(event);
        };
    }
}
export class MouseLeave extends InteractionBase {
    constructor(withBubbling) {
        super(new MouseLeaveFSM(withBubbling), new PointDataImpl());
        this.handler = {
            "onExit": (evt) => {
                this._data.copy(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}
