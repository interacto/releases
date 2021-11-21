import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { StdState } from "../../fsm/StdState";
import { TerminalState } from "../../fsm/TerminalState";
import { CancellingState } from "../../fsm/CancellingState";
import { TouchPressureTransition } from "../../fsm/TouchPressureTransition";
import { TouchReleaseTransition } from "../../fsm/TouchReleaseTransition";
import { TimeoutTransition } from "../../fsm/TimeoutTransition";
import { TouchDataImpl } from "../TouchDataImpl";
import { TouchMoveTransition } from "../../fsm/TouchMoveTransition";
class LongTouchFSM extends FSMImpl {
    constructor(duration) {
        super();
        if (duration <= 0) {
            throw new Error("Incorrect duration");
        }
        this.duration = duration;
        this.currentTouchID = undefined;
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        const touched = new StdState(this, "touched");
        const cancelled = new CancellingState(this, "cancelled");
        const timeouted = new TerminalState(this, "timeouted");
        this.addState(touched);
        this.addState(cancelled);
        this.addState(timeouted);
        const press = new TouchPressureTransition(this.initState, touched);
        press.action = (event) => {
            this.currentTouchID = event.changedTouches[0].identifier;
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.tap(event);
        };
        const moved = new TouchMoveTransition(touched, cancelled);
        moved.isGuardOK = (event) => event.changedTouches[0].identifier === this.currentTouchID;
        const release = new TouchReleaseTransition(touched, cancelled);
        release.isGuardOK = (event) => event.changedTouches[0].identifier === this.currentTouchID;
        new TimeoutTransition(touched, timeouted, () => this.duration);
        super.buildFSM(dataHandler);
    }
    reinit() {
        super.reinit();
        this.currentTouchID = undefined;
    }
}
export class LongTouch extends InteractionBase {
    constructor(duration) {
        super(new LongTouchFSM(duration), new TouchDataImpl());
        this.handler = {
            "tap": (evt) => {
                if (evt.changedTouches.length > 0) {
                    this._data.copy(TouchDataImpl.mergeTouchEventData(evt.changedTouches[0], evt));
                }
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}
