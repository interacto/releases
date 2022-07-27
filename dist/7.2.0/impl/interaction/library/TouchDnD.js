import { InteractionBase } from "../InteractionBase";
import { FSMImpl } from "../../fsm/FSMImpl";
import { TerminalState } from "../../fsm/TerminalState";
import { getTouch } from "../../fsm/Events";
import { SrcTgtTouchDataImpl } from "../SrcTgtTouchDataImpl";
import { TouchTransition } from "../../fsm/TouchTransition";
export class TouchDnDFSM extends FSMImpl {
    constructor(cancellable, logger, dataHandler, movementRequired = true) {
        super(logger, dataHandler);
        this.touchID = undefined;
        this.cancellable = cancellable;
        this.movementRequired = movementRequired;
        this.buildFSM();
    }
    buildFSM() {
        new TerminalState(this, "released");
        const touched = this.addStdState("touched");
        const moved = this.addStdState("moved");
        const released = this.addTerminalState("released");
        const cancelled = this.addCancellingState("cancelled");
        const touchDown = (event) => {
            this.touchID = event.changedTouches[0].identifier;
            this.dataHandler?.onTouch(event);
        };
        const fixTouchDownCheck = (event) => [...event.touches].filter(t => t.identifier === this.touchID).length === 0;
        new TouchTransition(this.initState, touched, "touchstart", touchDown);
        new TouchTransition(touched, touched, "touchstart", touchDown, fixTouchDownCheck);
        if (this.movementRequired) {
            this.startingState = moved;
            new TouchTransition(touched, cancelled, "touchend", undefined, (event) => event.changedTouches[0].identifier === this.touchID);
        }
        else {
            new TouchTransition(touched, released, "touchend", (event) => {
                this.dataHandler?.onRelease(event);
            }, (event) => event.changedTouches[0].identifier === this.touchID);
        }
        new TouchTransition(touched, moved, "touchmove", (event) => {
            this.dataHandler?.onMove(event);
        }, (event) => event.changedTouches[0].identifier === this.touchID);
        new TouchTransition(moved, moved, "touchmove", (event) => {
            this.dataHandler?.onMove(event);
        }, (event) => event.changedTouches[0].identifier === this.touchID);
        new TouchTransition(moved, touched, "touchstart", touchDown, fixTouchDownCheck);
        if (this.cancellable) {
            new TouchTransition(moved, released, "touchend", (event) => {
                this.dataHandler?.onRelease(event);
            }, (event) => {
                const tgt = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
                return event.changedTouches[0].identifier === this.touchID &&
                    (!(tgt instanceof Element) || !tgt.classList.contains("ioDwellSpring"));
            });
            new TouchTransition(moved, cancelled, "touchend", undefined, (ev) => {
                const tgt = document.elementFromPoint(ev.changedTouches[0].clientX, ev.changedTouches[0].clientY);
                return ev.changedTouches[0].identifier === this.touchID && tgt instanceof Element && tgt.classList.contains("ioDwellSpring");
            });
        }
        else {
            new TouchTransition(moved, released, "touchend", (event) => {
                this.dataHandler?.onRelease(event);
            }, (event) => event.changedTouches[0].identifier === this.touchID);
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
export class TouchDnD extends InteractionBase {
    constructor(logger, cancellable, movementRequired = true, fsm) {
        const handler = {
            "onTouch": (evt) => {
                const touch = evt.changedTouches[0];
                const all = [...evt.touches];
                this._data.copySrc(touch, evt, all);
                this._data.copyTgt(touch, evt, all);
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
        super(fsm ?? new TouchDnDFSM(cancellable, logger, handler, movementRequired), new SrcTgtTouchDataImpl(), logger);
    }
    setTgtData(evt) {
        const touch = getTouch(evt.changedTouches, this.data.src.identifier);
        if (touch !== undefined) {
            this._data.copyTgt(touch, evt, [...evt.touches]);
        }
    }
}
