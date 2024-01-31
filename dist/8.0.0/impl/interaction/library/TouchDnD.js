import { getTouch } from "../../fsm/Events";
import { FSMImpl } from "../../fsm/FSMImpl";
import { TouchTransition } from "../../fsm/TouchTransition";
import { InteractionBase } from "../InteractionBase";
import { SrcTgtTouchDataImpl } from "../SrcTgtTouchDataImpl";
export class TouchDnDFSM extends FSMImpl {
    touchID;
    cancellable;
    movementRequired;
    cancelled;
    moved;
    touched;
    constructor(cancellable, logger, dataHandler, movementRequired = true) {
        super(logger, dataHandler);
        this.touchID = undefined;
        this.cancellable = cancellable;
        this.movementRequired = movementRequired;
        this.cancelled = this.addCancellingState("cancelled");
        this.moved = this.addStdState("moved");
        this.touched = this.addStdState("touched");
        this.buildFSM();
    }
    buildFSM() {
        const released = this.addTerminalState("released");
        const touchDown = (event) => {
            this.touchID = event.changedTouches[0]?.identifier;
            this.dataHandler?.onTouch(event);
        };
        const fixTouchDownCheck = (event) => !Array.from(event.touches).some(touch => touch.identifier === this.touchID);
        new TouchTransition(this.initState, this.touched, "touchstart", touchDown);
        new TouchTransition(this.touched, this.touched, "touchstart", touchDown, fixTouchDownCheck);
        if (this.movementRequired) {
            this.startingState = this.moved;
            new TouchTransition(this.touched, this.cancelled, "touchend", undefined, (event) => event.changedTouches[0] !== undefined && event.changedTouches[0].identifier === this.touchID);
        }
        else {
            new TouchTransition(this.touched, released, "touchend", (event) => {
                this.dataHandler?.onRelease(event);
            }, (event) => event.changedTouches[0] !== undefined && event.changedTouches[0].identifier === this.touchID);
        }
        const moved = (event) => {
            this.dataHandler?.onMove(event);
        };
        const movedPredicate = (event) => event.changedTouches[0]?.identifier === this.touchID;
        new TouchTransition(this.touched, this.moved, "touchmove", moved, movedPredicate);
        new TouchTransition(this.moved, this.moved, "touchmove", moved, movedPredicate);
        new TouchTransition(this.moved, this.touched, "touchstart", touchDown, fixTouchDownCheck);
        if (this.cancellable) {
            new TouchTransition(this.moved, released, "touchend", (event) => {
                this.dataHandler?.onRelease(event);
            }, (event) => {
                const touch = event.changedTouches[0];
                const tgt = document.elementFromPoint(touch.clientX, touch.clientY);
                return touch.identifier === this.touchID &&
                    (!(tgt instanceof Element) || !tgt.classList.contains("ioDwellSpring"));
            });
            new TouchTransition(this.moved, this.cancelled, "touchend", undefined, (ev) => {
                const touch = ev.changedTouches[0];
                const tgt = document.elementFromPoint(touch.clientX, touch.clientY);
                return touch.identifier === this.touchID && tgt instanceof Element && tgt.classList.contains("ioDwellSpring");
            });
        }
        else {
            new TouchTransition(this.moved, released, "touchend", (event) => {
                this.dataHandler?.onRelease(event);
            }, (event) => event.changedTouches[0]?.identifier === this.touchID);
        }
    }
    getTouchId() {
        return this.touchID;
    }
    reinit() {
        super.reinit();
        this.touchID = undefined;
    }
}
export class OneTouchDnDFSM extends TouchDnDFSM {
    constructor(cancellable, logger, dataHandler) {
        super(cancellable, logger, dataHandler, true);
    }
    buildFSM() {
        super.buildFSM();
        const check = (event) => event.changedTouches[0] !== undefined && event.changedTouches[0].identifier !== this.touchID;
        new TouchTransition(this.moved, this.cancelled, "touchstart", undefined, check);
        new TouchTransition(this.touched, this.cancelled, "touchstart", undefined, check);
    }
}
export class TouchDnD extends InteractionBase {
    constructor(logger, cancellable, fsm, name) {
        const handler = {
            "onTouch": (evt) => {
                if (evt.changedTouches[0] !== undefined) {
                    const touch = evt.changedTouches[0];
                    const all = Array.from(evt.touches);
                    this._data.copySrc(touch, evt, all);
                    this._data.copyTgt(touch, evt, all);
                }
            },
            "onMove": (evt) => {
                this.setTgtData(evt);
            },
            "onRelease": (evt) => {
                this.setTgtData(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(fsm ?? new OneTouchDnDFSM(cancellable, logger, handler), new SrcTgtTouchDataImpl(), logger, name ?? TouchDnD.name);
    }
    setTgtData(evt) {
        const touch = getTouch(evt.changedTouches, this.data.src.identifier);
        if (touch !== undefined) {
            this._data.copyTgt(touch, evt, Array.from(evt.touches));
        }
    }
}
