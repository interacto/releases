import { StdState } from "../../fsm/StdState";
import { TerminalState } from "../../fsm/TerminalState";
import { CancellingState } from "../../fsm/CancellingState";
import { EscapeKeyPressureTransition } from "../../fsm/EscapeKeyPressureTransition";
import { FSMImpl } from "../../fsm/FSMImpl";
import { MouseDownTransition } from "../../fsm/MouseDownTransition";
import { MouseUpTransition } from "../../fsm/MouseUpTransition";
import { InteractionBase } from "../InteractionBase";
import { SrcTgtPointsDataImpl } from "../SrcTgtPointsDataImpl";
import { MouseMoveTransition } from "../../fsm/MouseMoveTransition";
class DnDFSM extends FSMImpl {
    constructor(cancellable) {
        super();
        this.cancellable = cancellable;
    }
    buildFSM(dataHandler) {
        if (this.states.length > 1) {
            return;
        }
        super.buildFSM(dataHandler);
        const pressed = new StdState(this, "pressed");
        const dragged = new StdState(this, "dragged");
        const released = new TerminalState(this, "released");
        const cancelled = new CancellingState(this, "cancelled");
        this.addState(pressed);
        this.addState(dragged);
        this.addState(released);
        this.addState(cancelled);
        this.startingState = dragged;
        const press = new MouseDownTransition(this.initState, pressed);
        press.action = (event) => {
            this.buttonToCheck = event.button;
            dataHandler.onPress(event);
        };
        const relCancel = new MouseUpTransition(pressed, cancelled);
        relCancel.isGuardOK = (event) => event.button === this.buttonToCheck;
        const guardMove = (event) => event.button === this.buttonToCheck;
        const actionMove = (event) => {
            dataHandler.onDrag(event);
        };
        const move = new MouseMoveTransition(pressed, dragged);
        move.isGuardOK = guardMove;
        move.action = actionMove;
        const moveDrag = new MouseMoveTransition(dragged, dragged);
        moveDrag.isGuardOK = guardMove;
        moveDrag.action = actionMove;
        const release = new MouseUpTransition(dragged, released);
        release.isGuardOK = (event) => {
            const tgt = event.currentTarget;
            return event.button === this.buttonToCheck && (!(tgt instanceof Element) || !tgt.classList.contains("ioDwellSpring"));
        };
        release.action = (event) => {
            dataHandler.onRelease(event);
        };
        this.configureCancellation(pressed, dragged, cancelled);
    }
    configureCancellation(pressed, dragged, cancelled) {
        if (this.cancellable) {
            new EscapeKeyPressureTransition(pressed, cancelled);
            new EscapeKeyPressureTransition(dragged, cancelled);
            const releaseCancel = new MouseUpTransition(dragged, cancelled);
            releaseCancel.isGuardOK = (event) => {
                const tgt = event.currentTarget;
                return event.button === this.buttonToCheck && tgt instanceof Element && tgt.classList.contains("ioDwellSpring");
            };
        }
    }
    reinit() {
        super.reinit();
        this.buttonToCheck = undefined;
    }
}
export class DnD extends InteractionBase {
    constructor(cancellable) {
        super(new DnDFSM(cancellable), new SrcTgtPointsDataImpl());
        this.handler = {
            "onPress": (evt) => {
                this._data.copySrc(evt);
                this._data.copyTgt(evt);
            },
            "onDrag": (evt) => {
                this._data.copyTgt(evt);
            },
            "onRelease": (evt) => {
                this._data.copyTgt(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.fsm.buildFSM(this.handler);
    }
}
