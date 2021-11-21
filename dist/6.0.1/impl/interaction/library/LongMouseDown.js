import { FSMImpl } from "../../fsm/FSMImpl";
import { StdState } from "../../fsm/StdState";
import { CancellingState } from "../../fsm/CancellingState";
import { TerminalState } from "../../fsm/TerminalState";
import { TimeoutTransition } from "../../fsm/TimeoutTransition";
import { InteractionBase } from "../InteractionBase";
import { MouseDownTransition } from "../../fsm/MouseDownTransition";
import { MouseUpTransition } from "../../fsm/MouseUpTransition";
import { PointDataImpl } from "../PointDataImpl";
import { MouseMoveTransition } from "../../fsm/MouseMoveTransition";
export class LongMouseDownFSM extends FSMImpl {
    constructor(duration) {
        super();
        if (duration <= 0) {
            throw new Error("Incorrect duration");
        }
        this.duration = duration;
        this.currentButton = undefined;
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const down = new StdState(this, "down");
        const cancelled = new CancellingState(this, "cancelled");
        const timeouted = new TerminalState(this, "timeouted");
        this.addState(down);
        this.addState(cancelled);
        this.addState(timeouted);
        const press = new MouseDownTransition(this.initState, down);
        press.action = (event) => {
            this.currentButton = event.button;
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.press(event);
        };
        const guard = (event) => event.button === this.currentButton;
        const moved = new MouseMoveTransition(down, cancelled);
        moved.isGuardOK = guard;
        const release = new MouseUpTransition(down, cancelled);
        release.isGuardOK = guard;
        new TimeoutTransition(down, timeouted, () => this.duration);
    }
    reinit() {
        super.reinit();
        this.currentButton = undefined;
    }
}
export class LongMouseDown extends InteractionBase {
    constructor(duration) {
        super(new LongMouseDownFSM(duration), new PointDataImpl());
        this.handler = {
            "press": (evt) => {
                this._data.copy(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}
