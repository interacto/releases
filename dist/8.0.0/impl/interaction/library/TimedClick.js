import { FSMImpl } from "../../fsm/FSMImpl";
import { MouseTransition } from "../../fsm/MouseTransition";
import { TimeoutTransition } from "../../fsm/TimeoutTransition";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
export class TimedClickFSM extends FSMImpl {
    currentButton;
    buttonToConsider;
    constructor(duration, logger, button, dataHandler) {
        super(logger, dataHandler);
        if (duration <= 0) {
            throw new Error("Incorrect duration");
        }
        this.buttonToConsider = button;
        const pressed = this.addStdState("pressed");
        const cancelled = this.addCancellingState("cancelled");
        new MouseTransition(this.initState, pressed, "mousedown", (evt) => {
            this.setButtonToCheck(evt.button);
            this.dataHandler?.initToClicked(evt);
        }, (evt) => this.buttonToConsider === undefined || evt.button === this.buttonToConsider);
        new MouseTransition(pressed, this.addTerminalState("clicked", true), "mouseup", (evt) => {
            this.dataHandler?.initToClicked(evt);
        }, (evt) => this.currentButton === undefined || evt.button === this.currentButton);
        new MouseTransition(pressed, cancelled, "mousemove");
        new TimeoutTransition(pressed, cancelled, () => duration);
    }
    setButtonToCheck(evtButton) {
        this.currentButton = this.buttonToConsider ?? evtButton;
    }
    reinit() {
        super.reinit();
        this.currentButton = undefined;
    }
}
export class TimedClick extends InteractionBase {
    constructor(duration, logger, button, fsm, data, name) {
        super(fsm ?? new TimedClickFSM(duration, logger, button), data ?? new PointDataImpl(), logger, name ?? TimedClick.name);
        this.fsm.dataHandler = {
            "initToClicked": (evt) => {
                this._data.copy(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
    }
}
