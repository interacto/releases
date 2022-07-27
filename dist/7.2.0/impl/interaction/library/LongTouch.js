import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { TimeoutTransition } from "../../fsm/TimeoutTransition";
import { TouchDataImpl } from "../TouchDataImpl";
import { TouchTransition } from "../../fsm/TouchTransition";
class LongTouchFSM extends FSMImpl {
    constructor(duration, logger, dataHandler) {
        super(logger, dataHandler);
        if (duration <= 0) {
            throw new Error("Incorrect duration");
        }
        this.duration = duration;
        this.currentTouchID = undefined;
        const touched = this.addStdState("touched");
        const cancelled = this.addCancellingState("cancelled");
        new TouchTransition(this.initState, touched, "touchstart", (event) => {
            this.currentTouchID = event.changedTouches[0].identifier;
            this.dataHandler?.tap(event);
        });
        new TouchTransition(touched, cancelled, "touchmove", undefined, (ev) => ev.changedTouches[0].identifier === this.currentTouchID);
        new TouchTransition(touched, cancelled, "touchend", undefined, (ev) => ev.changedTouches[0].identifier === this.currentTouchID);
        new TimeoutTransition(touched, this.addTerminalState("timeouted"), () => this.duration);
    }
    reinit() {
        super.reinit();
        this.currentTouchID = undefined;
    }
}
export class LongTouch extends InteractionBase {
    constructor(duration, logger) {
        const handler = {
            "tap": (evt) => {
                if (evt.changedTouches.length > 0) {
                    this._data.copy(TouchDataImpl.mergeTouchEventData(evt.changedTouches[0], evt, [...evt.touches]));
                }
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new LongTouchFSM(duration, logger, handler), new TouchDataImpl(), logger);
    }
}
