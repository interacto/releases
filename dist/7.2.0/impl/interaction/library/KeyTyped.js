import { FSMImpl } from "../../fsm/FSMImpl";
import { KeyDataImpl } from "../KeyDataImpl";
import { InteractionBase } from "../InteractionBase";
import { KeyTransition } from "../../fsm/KeyTransition";
export class KeyTypedFSM extends FSMImpl {
    constructor(logger, dataHandler) {
        super(logger, dataHandler);
        const pressed = this.addStdState("pressed");
        new KeyTransition(this.initState, pressed, "keydown", (event) => {
            this.checkKey = event.code;
        });
        new KeyTransition(pressed, this.addTerminalState("typed", true), "keyup", (evt) => {
            this.dataHandler?.onKeyTyped(evt);
        }, (evt) => this.checkKey === undefined || evt.code === this.checkKey);
    }
    reinit() {
        super.reinit();
        this.checkKey = undefined;
    }
}
export class KeyTyped extends InteractionBase {
    constructor(logger) {
        const handler = {
            "onKeyTyped": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new KeyTypedFSM(logger, handler), new KeyDataImpl(), logger);
    }
}
