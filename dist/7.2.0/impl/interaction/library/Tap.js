import { InteractionBase } from "../InteractionBase";
import { FSMImpl } from "../../fsm/FSMImpl";
import { TapDataImpl } from "../TapDataImpl";
import { TouchDataImpl } from "../TouchDataImpl";
import { TimeoutTransition } from "../../fsm/TimeoutTransition";
import { TouchTransition } from "../../fsm/TouchTransition";
class TapFSM extends FSMImpl {
    constructor(nbTaps, logger, dataHandler) {
        super(logger, dataHandler);
        this.nbTaps = nbTaps;
        this.countTaps = 0;
        const down = this.addStdState("down");
        const up = this.addStdState("up");
        const cancelled = this.addCancellingState("cancelled");
        const action = (event) => {
            this.touchID = event.changedTouches[0].identifier;
            this.countTaps++;
            this.dataHandler?.tap(event);
        };
        new TouchTransition(this.initState, down, "touchstart", action);
        new TouchTransition(up, down, "touchstart", action);
        new TouchTransition(down, cancelled, "touchmove", undefined, (evt) => evt.changedTouches[0].identifier === this.touchID);
        new TouchTransition(down, cancelled, "touchstart", undefined, (evt) => [...evt.touches].filter(t => t.identifier === this.touchID).length > 0);
        new TouchTransition(down, down, "touchstart", (event) => {
            this.touchID = event.changedTouches[0].identifier;
            this.dataHandler?.tap(event);
        }, (evt) => [...evt.touches].filter(t => t.identifier === this.touchID).length === 0);
        new TouchTransition(down, this.addTerminalState("ended"), "touchend", undefined, (evt) => evt.changedTouches[0].identifier === this.touchID && this.nbTaps === this.countTaps);
        new TouchTransition(down, up, "touchend", undefined, (evt) => evt.changedTouches[0].identifier === this.touchID && this.nbTaps !== this.countTaps);
        new TouchTransition(up, cancelled, "touchmove");
        new TimeoutTransition(down, cancelled, () => 1000);
        new TimeoutTransition(up, cancelled, () => 1000);
    }
    reinit() {
        super.reinit();
        this.countTaps = 0;
    }
}
export class Tap extends InteractionBase {
    constructor(numberTaps, logger) {
        const handler = {
            "tap": (evt) => {
                if (evt.changedTouches.length > 0) {
                    const touch = new TouchDataImpl();
                    touch.copy(TouchDataImpl.mergeTouchEventData(evt.changedTouches[0], evt, [...evt.touches]));
                    this._data.addTapData(touch);
                }
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new TapFSM(numberTaps, logger, handler), new TapDataImpl(), logger);
    }
}
