import { InteractionBase } from "../InteractionBase";
import { FSMImpl } from "../../fsm/FSMImpl";
import { StdState } from "../../fsm/StdState";
import { TerminalState } from "../../fsm/TerminalState";
import { TouchPressureTransition } from "../../fsm/TouchPressureTransition";
import { TouchMoveTransition } from "../../fsm/TouchMoveTransition";
import { TouchReleaseTransition } from "../../fsm/TouchReleaseTransition";
import { getTouch } from "../../fsm/Events";
import { SrcTgtTouchDataImpl } from "../SrcTgtTouchDataImpl";
import { CancellingState } from "../../fsm/CancellingState";
export class TouchDnDFSM extends FSMImpl {
    constructor(cancellable, movementRequired = true) {
        super();
        this.touchID = undefined;
        this.cancellable = cancellable;
        this.movementRequired = movementRequired;
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const touched = new StdState(this, "touched");
        const moved = new StdState(this, "moved");
        const released = new TerminalState(this, "released");
        const cancelled = new CancellingState(this, "cancelled");
        this.addState(touched);
        this.addState(moved);
        this.addState(released);
        this.addState(cancelled);
        const touchDownFn = (event) => {
            this.touchID = event.changedTouches[0].identifier;
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onTouch(event);
        };
        const fixTouchDownCheck = (event) => [...event.touches].filter(t => t.identifier === this.touchID).length === 0;
        const pressure = new TouchPressureTransition(this.initState, touched);
        pressure.action = touchDownFn;
        const fixBlockedEvent = new TouchPressureTransition(touched, touched);
        fixBlockedEvent.isGuardOK = fixTouchDownCheck;
        fixBlockedEvent.action = touchDownFn;
        if (this.movementRequired) {
            this.startingState = moved;
            const tap = new TouchReleaseTransition(touched, cancelled);
            tap.isGuardOK = (event) => event.changedTouches[0].identifier === this.touchID;
        }
        else {
            const releaseTouched = new TouchReleaseTransition(touched, released);
            releaseTouched.isGuardOK = (event) => event.changedTouches[0].identifier === this.touchID;
            releaseTouched.action = (event) => {
                dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onRelease(event);
            };
        }
        const firstMove = new TouchMoveTransition(touched, moved);
        firstMove.isGuardOK = (event) => event.changedTouches[0].identifier === this.touchID;
        firstMove.action = (event) => {
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onMove(event);
        };
        const move = new TouchMoveTransition(moved, moved);
        move.isGuardOK = (event) => event.changedTouches[0].identifier === this.touchID;
        move.action = (event) => {
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onMove(event);
        };
        const fixBlockedEvent2 = new TouchPressureTransition(moved, touched);
        fixBlockedEvent2.isGuardOK = fixTouchDownCheck;
        fixBlockedEvent2.action = touchDownFn;
        if (this.cancellable) {
            const release = new TouchReleaseTransition(moved, released);
            release.isGuardOK = (event) => {
                const tgt = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
                return event.changedTouches[0].identifier === this.touchID &&
                    (!(tgt instanceof Element) || !tgt.classList.contains("ioDwellSpring"));
            };
            release.action = (event) => {
                dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onRelease(event);
            };
            const releaseCancel = new TouchReleaseTransition(moved, cancelled);
            releaseCancel.isGuardOK = (event) => {
                const tgt = document.elementFromPoint(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
                return event.changedTouches[0].identifier === this.touchID && tgt instanceof Element && tgt.classList.contains("ioDwellSpring");
            };
        }
        else {
            const release = new TouchReleaseTransition(moved, released);
            release.isGuardOK = (event) => event.changedTouches[0].identifier === this.touchID;
            release.action = (event) => {
                dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onRelease(event);
            };
        }
        super.buildFSM(dataHandler);
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
    constructor(cancellable, movementRequired = true, fsm) {
        super(fsm !== null && fsm !== void 0 ? fsm : new TouchDnDFSM(cancellable, movementRequired), new SrcTgtTouchDataImpl());
        this.handler = {
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
        this.fsm.buildFSM(this.handler);
    }
    setTgtData(evt) {
        const touch = getTouch(evt.changedTouches, this.data.src.identifier);
        if (touch !== undefined) {
            this._data.copyTgt(touch, evt, [...evt.touches]);
        }
    }
}
