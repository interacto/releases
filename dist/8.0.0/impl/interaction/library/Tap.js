import { FSMImpl } from "../../fsm/FSMImpl";
import { TimeoutTransition } from "../../fsm/TimeoutTransition";
import { TouchTransition } from "../../fsm/TouchTransition";
import { InteractionBase } from "../InteractionBase";
import { TapDataImpl } from "../TapDataImpl";
import { TouchDataImpl } from "../TouchDataImpl";
export class TapFSM extends FSMImpl {
    countTaps;
    nbTaps;
    touchID;
    downState;
    cancelState;
    constructor(nbTaps, logger, dataHandler) {
        super(logger, dataHandler);
        this.nbTaps = nbTaps;
        this.countTaps = 0;
        this.downState = this.addStdState("down");
        const up = this.addStdState("up");
        this.cancelState = this.addCancellingState("cancelled");
        const action = (event) => {
            this.touchID = event.changedTouches[0].identifier;
            this.countTaps++;
            this.dataHandler?.tap(event);
        };
        new TouchTransition(this.initState, this.downState, "touchstart", action);
        new TouchTransition(up, this.downState, "touchstart", action);
        new TouchTransition(this.downState, this.cancelState, "touchmove", undefined, (evt) => evt.changedTouches[0].identifier === this.touchID);
        new TouchTransition(this.downState, this.cancelState, "touchstart", undefined, (evt) => Array.from(evt.touches).some(touch => touch.identifier === this.touchID));
        new TouchTransition(this.downState, this.downState, "touchstart", (event) => {
            this.touchID = event.changedTouches[0].identifier;
            this.dataHandler?.tap(event);
        }, (evt) => Array.from(evt.touches).filter(touch => touch.identifier === this.touchID).length === 0);
        new TouchTransition(this.downState, this.addTerminalState("ended"), "touchend", undefined, (evt) => evt.changedTouches[0].identifier === this.touchID && this.nbTaps === this.countTaps);
        new TouchTransition(this.downState, up, "touchend", undefined, (evt) => evt.changedTouches[0].identifier === this.touchID && this.nbTaps !== this.countTaps);
        new TouchTransition(up, this.cancelState, "touchmove");
        new TimeoutTransition(up, this.cancelState, () => 1000);
    }
    reinit() {
        super.reinit();
        this.countTaps = 0;
    }
}
export class Tap extends InteractionBase {
    constructor(numberTaps, logger, name) {
        const handler = {
            "tap": (evt) => {
                if (evt.changedTouches.length > 0) {
                    const touch = new TouchDataImpl();
                    touch.copy(TouchDataImpl.mergeTouchEventData(evt.changedTouches[0], evt, Array.from(evt.touches)));
                    this._data.addPoint(touch);
                }
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new TapFSM(numberTaps, logger, handler), new TapDataImpl(), logger, name ?? Tap.name);
    }
}
