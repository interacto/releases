import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
import { TimeoutTransition } from "../../fsm/TimeoutTransition";
import { MouseTransition } from "../../fsm/MouseTransition";
export class LongMouseDownFSM extends FSMImpl {
    constructor(duration, logger, dataHandler) {
        super(logger, dataHandler);
        if (duration <= 0) {
            throw new Error("Incorrect duration");
        }
        this.duration = duration;
        this.currentButton = undefined;
        const down = this.addStdState("down");
        const cancelled = this.addCancellingState("cancelled");
        const timeouted = this.addTerminalState("timeouted");
        new MouseTransition(this.initState, down, "mousedown", (evt) => {
            this.currentButton = evt.button;
            this.dataHandler?.press(evt);
        });
        const move = new MouseTransition(down, cancelled, "mousemove", undefined, (evt) => evt.button === this.currentButton);
        new MouseTransition(down, cancelled, "mouseup", undefined, move.guard);
        new TimeoutTransition(down, timeouted, () => this.duration);
    }
    reinit() {
        super.reinit();
        this.currentButton = undefined;
    }
}
export class LongMouseDown extends InteractionBase {
    constructor(duration, logger) {
        const handler = {
            "press": (evt) => {
                this._data.copy(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new LongMouseDownFSM(duration, logger, handler), new PointDataImpl(), logger);
    }
}
