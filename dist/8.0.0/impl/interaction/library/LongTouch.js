import { FSMImpl } from "../../fsm/FSMImpl";
import { TimeoutTransition } from "../../fsm/TimeoutTransition";
import { TouchTransition } from "../../fsm/TouchTransition";
import { InteractionBase } from "../InteractionBase";
import { TouchDataImpl } from "../TouchDataImpl";
class LongTouchFSM extends FSMImpl {
    duration;
    currentTouchID;
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
            if (event.changedTouches[0] !== undefined) {
                this.currentTouchID = event.changedTouches[0].identifier;
                this.dataHandler?.tap(event);
            }
        });
        new TouchTransition(touched, cancelled, "touchmove", undefined, (ev) => ev.changedTouches[0] !== undefined && ev.changedTouches[0].identifier === this.currentTouchID);
        new TouchTransition(touched, cancelled, "touchend", undefined, (ev) => ev.changedTouches[0] !== undefined && ev.changedTouches[0].identifier === this.currentTouchID);
        new TimeoutTransition(touched, this.addTerminalState("timeouted"), () => this.duration);
    }
    reinit() {
        super.reinit();
        this.currentTouchID = undefined;
    }
}
export class LongTouch extends InteractionBase {
    constructor(duration, logger, name) {
        const handler = {
            "tap": (evt) => {
                if (evt.changedTouches[0] !== undefined) {
                    this._data.copy(TouchDataImpl.mergeTouchEventData(evt.changedTouches[0], evt, Array.from(evt.touches)));
                }
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new LongTouchFSM(duration, logger, handler), new TouchDataImpl(), logger, name ?? LongTouch.name);
    }
}
