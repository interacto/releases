import { InteractionBase } from "../InteractionBase";
import { FSMImpl } from "../../fsm/FSMImpl";
import { TerminalState } from "../../fsm/TerminalState";
import { StdState } from "../../fsm/StdState";
import { CancellingState } from "../../fsm/CancellingState";
import { TouchReleaseTransition } from "../../fsm/TouchReleaseTransition";
import { TapDataImpl } from "../TapDataImpl";
import { TouchDataImpl } from "../TouchDataImpl";
import { TouchPressureTransition } from "../../fsm/TouchPressureTransition";
import { TouchMoveTransition } from "../../fsm/TouchMoveTransition";
import { TimeoutTransition } from "../../fsm/TimeoutTransition";
class TapFSM extends FSMImpl {
    constructor(nbTaps) {
        super();
        this.nbTaps = nbTaps;
        this.countTaps = 0;
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const down = new StdState(this, "down");
        const up = new StdState(this, "up");
        const ended = new TerminalState(this, "ended");
        const cancelled = new CancellingState(this, "cancelled");
        this.addState(down);
        this.addState(up);
        this.addState(ended);
        this.addState(cancelled);
        const pressureAction = (event) => {
            this.touchID = event.changedTouches[0].identifier;
            this.countTaps++;
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.tap(event);
        };
        const press1 = new TouchPressureTransition(this.initState, down);
        press1.action = pressureAction;
        const move = new TouchMoveTransition(down, cancelled);
        move.isGuardOK = (event) => event.changedTouches[0].identifier === this.touchID;
        new TouchPressureTransition(down, cancelled);
        const release = new TouchReleaseTransition(down, ended);
        release.isGuardOK = (event) => event.changedTouches[0].identifier === this.touchID && this.nbTaps === this.countTaps;
        const release2 = new TouchReleaseTransition(down, up);
        release2.isGuardOK = (event) => event.changedTouches[0].identifier === this.touchID && this.nbTaps !== this.countTaps;
        const press2 = new TouchPressureTransition(up, down);
        press2.action = pressureAction;
        new TouchMoveTransition(up, cancelled);
        new TimeoutTransition(down, cancelled, () => 1000);
        new TimeoutTransition(up, cancelled, () => 1000);
    }
    reinit() {
        super.reinit();
        this.countTaps = 0;
    }
}
export class Tap extends InteractionBase {
    constructor(numberTaps) {
        super(new TapFSM(numberTaps), new TapDataImpl());
        this.handler = {
            "tap": (evt) => {
                if (evt.changedTouches.length > 0) {
                    const touch = new TouchDataImpl();
                    touch.copy(TouchDataImpl.mergeTouchEventData(evt.changedTouches[0], evt));
                    this._data.addTapData(touch);
                }
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}
