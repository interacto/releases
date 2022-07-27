import { DoubleClick, DoubleClickFSM } from "./DoubleClick";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { EscapeKeyPressureTransition } from "../../fsm/EscapeKeyPressureTransition";
import { SrcTgtPointsDataImpl } from "../SrcTgtPointsDataImpl";
import { SubFSMTransition } from "../../fsm/SubFSMTransition";
import { MouseTransition } from "../../fsm/MouseTransition";
class DragLockFSM extends FSMImpl {
    constructor(logger, dataHandler) {
        super(logger, dataHandler);
        this.firstDbleClick = new DoubleClickFSM(logger);
        this.sndDbleClick = new DoubleClickFSM(logger);
        const cancelDbleClick = new DoubleClickFSM(logger);
        const errorHandler = {
            "fsmError": (err) => {
                this.notifyHandlerOnError(err);
            }
        };
        this.firstDbleClick.addHandler(errorHandler);
        this.sndDbleClick.addHandler(errorHandler);
        cancelDbleClick.addHandler(errorHandler);
        const cancelled = this.addCancellingState("cancelled");
        const locked = this.addStdState("locked");
        const moved = this.addStdState("moved");
        new SubFSMTransition(this.initState, locked, this.firstDbleClick, () => {
            const checkButton = this.firstDbleClick.getCheckButton();
            this.sndDbleClick.setCheckButton(checkButton);
            cancelDbleClick.setCheckButton(checkButton);
            this.dataHandler?.onFirstDbleClick();
        });
        new SubFSMTransition(locked, cancelled, cancelDbleClick);
        const move = new MouseTransition(locked, moved, "mousemove", (event) => {
            this.dataHandler?.onMove(event);
        });
        new MouseTransition(moved, moved, "mousemove", move.action);
        new EscapeKeyPressureTransition(locked, cancelled);
        new EscapeKeyPressureTransition(moved, cancelled);
        new SubFSMTransition(moved, this.addTerminalState("dropped"), this.sndDbleClick);
    }
    set log(log) {
        super.log = log;
        this.firstDbleClick.log = log;
        this.sndDbleClick.log = log;
    }
    reinit() {
        super.reinit();
        this.firstDbleClick.reinit();
        this.sndDbleClick.reinit();
        this.checkButton = undefined;
    }
    fullReinit() {
        super.fullReinit();
        this.firstDbleClick.fullReinit();
        this.sndDbleClick.fullReinit();
    }
}
export class DragLock extends InteractionBase {
    constructor(logger) {
        const handler = {
            "onMove": (evt) => {
                this.data.tgt.copy(evt);
            },
            "onFirstDbleClick": () => {
                this.data.tgt.copy(this.data.src);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new DragLockFSM(logger, handler), new SrcTgtPointsDataImpl(), logger);
        new DoubleClick(logger, this.fsm.firstDbleClick, this.data.src);
        new DoubleClick(logger, this.fsm.sndDbleClick, this.data.tgt);
    }
}
