import { Click, ClickFSM } from "./Click";
import { FSMImpl } from "../../fsm/FSMImpl";
import { MouseTransition } from "../../fsm/MouseTransition";
import { SubFSMTransition } from "../../fsm/SubFSMTransition";
import { TimeoutTransition } from "../../fsm/TimeoutTransition";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
export class DoubleClickFSM extends FSMImpl {
    static timeGap = 300;
    static timeGapSupplier = () => DoubleClickFSM.getTimeGap();
    static getTimeGap() {
        return DoubleClickFSM.timeGap;
    }
    static setTimeGap(timeGapBetweenClicks) {
        if (timeGapBetweenClicks > 0) {
            DoubleClickFSM.timeGap = timeGapBetweenClicks;
        }
    }
    firstClickFSM;
    sndClickFSM;
    checkButton;
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
export class DoubleClick extends InteractionBase {
    constructor(logger, fsm, data, name) {
        super(fsm ?? new DoubleClickFSM(logger), data ?? new PointDataImpl(), logger, name ?? DoubleClick.name);
        this.fsm.dataHandler = {
            "reinitData": () => {
                this.reinitData();
            }
        };
        new Click(logger, this.fsm.firstClickFSM, this._data);
    }
}
