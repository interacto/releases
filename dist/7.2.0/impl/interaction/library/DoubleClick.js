import { Click, ClickFSM } from "./Click";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
import { SubFSMTransition } from "../../fsm/SubFSMTransition";
import { TimeoutTransition } from "../../fsm/TimeoutTransition";
import { MouseTransition } from "../../fsm/MouseTransition";
export class DoubleClickFSM extends FSMImpl {
    constructor(logger, dataHandler) {
        super(logger, dataHandler);
        this.firstClickFSM = new ClickFSM(logger);
        this.sndClickFSM = new ClickFSM(logger);
        const errorHandler = {
            "fsmError": (err) => {
                this.notifyHandlerOnError(err);
            }
        };
        this.firstClickFSM.addHandler(errorHandler);
        this.sndClickFSM.addHandler(errorHandler);
        const cancelled = this.addCancellingState("cancelled");
        const clicked = this.addStdState("clicked");
        new SubFSMTransition(this.initState, clicked, this.firstClickFSM, () => {
            this.setCheckButton(this.firstClickFSM.getCheckButton());
        });
        new MouseTransition(clicked, cancelled, "mousemove", undefined, (ev) => (this.checkButton === undefined || ev instanceof MouseEvent && ev.button === this.checkButton));
        new TimeoutTransition(clicked, cancelled, DoubleClickFSM.timeGapSupplier);
        new SubFSMTransition(clicked, this.addTerminalState("dbleclicked", true), this.sndClickFSM);
    }
    static getTimeGap() {
        return DoubleClickFSM.timeGap;
    }
    static setTimeGap(timeGapBetweenClicks) {
        if (timeGapBetweenClicks > 0) {
            DoubleClickFSM.timeGap = timeGapBetweenClicks;
        }
    }
    set log(log) {
        super.log = log;
        this.firstClickFSM.log = log;
        this.sndClickFSM.log = log;
    }
    setCheckButton(buttonToCheck) {
        if (this.checkButton === undefined) {
            this.checkButton = buttonToCheck;
        }
        this.sndClickFSM.setCheckButton(buttonToCheck);
    }
    getCheckButton() {
        return this.checkButton ?? -1;
    }
    fullReinit() {
        super.fullReinit();
        this.firstClickFSM.fullReinit();
        this.sndClickFSM.fullReinit();
    }
    reinit() {
        super.reinit();
        this.firstClickFSM.reinit();
        this.sndClickFSM.reinit();
        this.checkButton = undefined;
    }
}
DoubleClickFSM.timeGap = 300;
DoubleClickFSM.timeGapSupplier = () => DoubleClickFSM.getTimeGap();
export class DoubleClick extends InteractionBase {
    constructor(logger, fsm, data) {
        super(fsm ?? new DoubleClickFSM(logger), data ?? new PointDataImpl(), logger);
        this.fsm.dataHandler = {
            "reinitData": () => {
                this.reinitData();
            }
        };
        new Click(logger, this.fsm.firstClickFSM, this._data);
    }
}
