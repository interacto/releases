import { StdState } from "../../fsm/StdState";
import { TerminalState } from "../../fsm/TerminalState";
import { CancellingState } from "../../fsm/CancellingState";
import { MoveTransition } from "../../fsm/MoveTransition";
import { EscapeKeyPressureTransition } from "../../fsm/EscapeKeyPressureTransition";
import { FSMImpl } from "../../fsm/FSMImpl";
import { PressureTransition } from "../../fsm/PressureTransition";
import { ReleaseTransition } from "../../fsm/ReleaseTransition";
import { InteractionBase } from "../InteractionBase";
import { SrcTgtPointsDataImpl } from "../SrcTgtPointsDataImpl";
export class DnDFSM extends FSMImpl {
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
        this.setStartingState(dragged);
        const press = new PressureTransition(this.initState, pressed);
        press.action = (event) => {
            this.buttonToCheck = event.button;
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onPress(event);
        };
        const relCancel = new ReleaseTransition(pressed, cancelled);
        relCancel.isGuardOK = (event) => event.button === this.buttonToCheck;
        const guardMove = (event) => event.button === this.buttonToCheck;
        const actionMove = (event) => {
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onDrag(event);
        };
        const move = new MoveTransition(pressed, dragged);
        move.isGuardOK = guardMove;
        move.action = actionMove;
        const moveDrag = new MoveTransition(dragged, dragged);
        moveDrag.isGuardOK = guardMove;
        moveDrag.action = actionMove;
        const release = new ReleaseTransition(dragged, released);
        release.isGuardOK = (event) => event.button === this.buttonToCheck;
        release.action = (event) => {
            dataHandler === null || dataHandler === void 0 ? void 0 : dataHandler.onRelease(event);
        };
        if (this.cancellable) {
            new EscapeKeyPressureTransition(pressed, cancelled);
            new EscapeKeyPressureTransition(dragged, cancelled);
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
                this.data.copySrc(evt);
                this.data.copyTgt(evt);
            },
            "onDrag": (evt) => {
                this.data.copyTgt(evt);
            },
            "onRelease": (evt) => {
                this.data.copyTgt(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        this.getFsm().buildFSM(this.handler);
    }
}
