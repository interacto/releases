import { TapFSM } from "./Tap";
import { TimeoutTransition } from "../../fsm/TimeoutTransition";
import { InteractionBase } from "../InteractionBase";
import { TapDataImpl } from "../TapDataImpl";
import { TouchDataImpl } from "../TouchDataImpl";
class TimedTapFSM extends TapFSM {
    constructor(duration, nbTaps, logger, dataHandler) {
        super(nbTaps, logger, dataHandler);
        if (duration <= 0) {
            throw new Error("Incorrect duration");
        }
        new TimeoutTransition(this.downState, this.cancelState, () => duration);
    }
}
export class TimedTap extends InteractionBase {
    constructor(duration, numberTaps, logger, name) {
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
        super(new TimedTapFSM(duration, numberTaps, logger, handler), new TapDataImpl(), logger, name ?? TimedTap.name);
    }
}
