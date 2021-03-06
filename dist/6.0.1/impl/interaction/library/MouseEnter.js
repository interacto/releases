import { TerminalState } from "../../fsm/TerminalState";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
import { MouseOverTransition } from "../../fsm/MouseOverTransition";
import { MouseEnterTransition } from "../../fsm/MouseEnterTransition";
export class MouseEnterFSM extends FSMImpl {
    constructor(withBubbling) {
        super();
        this.withBubbling = withBubbling;
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const entered = new TerminalState(this, "entered");
        this.addState(entered);
        let enter;
        if (this.withBubbling) {
            enter = new MouseOverTransition(this.initState, entered);
        }
        else {
            enter = new MouseEnterTransition(this.initState, entered);
        }
        enter.action = (event) => {
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onEnter(event);
        };
    }
}
export class MouseEnter extends InteractionBase {
    constructor(withBubbling) {
        super(new MouseEnterFSM(withBubbling), new PointDataImpl());
        this.handler = {
            "onEnter": (evt) => {
                this._data.copy(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}
