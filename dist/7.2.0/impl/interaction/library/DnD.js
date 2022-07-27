import { EscapeKeyPressureTransition } from "../../fsm/EscapeKeyPressureTransition";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { SrcTgtPointsDataImpl } from "../SrcTgtPointsDataImpl";
import { MouseTransition } from "../../fsm/MouseTransition";
class DnDFSM extends FSMImpl {
    constructor(cancellable, logger, dataHandler) {
        super(logger, dataHandler);
        this.cancellable = cancellable;
        const pressed = this.addStdState("pressed");
        const dragged = this.addStdState("dragged", true);
        const cancelled = this.addCancellingState("cancelled");
        new MouseTransition(this.initState, pressed, "mousedown", (evt) => {
            this.buttonToCheck = evt.button;
            this.dataHandler?.onPress(evt);
        });
        new MouseTransition(pressed, cancelled, "mouseup", (evt) => evt.button === this.buttonToCheck);
        const move = new MouseTransition(pressed, dragged, "mousemove", (evt) => {
            this.dataHandler?.onDrag(evt);
        }, (evt) => evt.button === this.buttonToCheck);
        new MouseTransition(dragged, dragged, "mousemove", move.action, move.guard);
        new MouseTransition(dragged, this.addTerminalState("released"), "mouseup", (event) => {
            this.dataHandler?.onRelease(event);
        }, (event) => {
            const tgt = event.currentTarget;
            return event.button === this.buttonToCheck && (!(tgt instanceof Element) || !tgt.classList.contains("ioDwellSpring"));
        });
        if (this.cancellable) {
            new EscapeKeyPressureTransition(pressed, cancelled);
            new EscapeKeyPressureTransition(dragged, cancelled);
            new MouseTransition(dragged, cancelled, "mouseup", (evt) => {
                const tgt = evt.currentTarget;
                return evt.button === this.buttonToCheck && tgt instanceof Element && tgt.classList.contains("ioDwellSpring");
            });
        }
    }
    reinit() {
        super.reinit();
        this.buttonToCheck = undefined;
    }
}
export class DnD extends InteractionBase {
    constructor(cancellable, logger) {
        const handler = {
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
        super(new DnDFSM(cancellable, logger, handler), new SrcTgtPointsDataImpl(), logger);
    }
}
