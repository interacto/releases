import { FSMImpl } from "../../fsm/FSMImpl";
import { KeyTransition } from "../../fsm/KeyTransition";
import { InteractionBase } from "../InteractionBase";
import { KeyDataImpl } from "../KeyDataImpl";
export class KeyTypedFSM extends FSMImpl {
    checkKey;
    constructor(logger, dataHandler, key) {
        super(logger, dataHandler);
        this.checkKey = key;
        const pressed = this.addStdState("pressed");
        new KeyTransition(this.initState, pressed, "keydown", (event) => {
            if (this.checkKey === undefined) {
                this.checkKey = event.code;
            }
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
    constructor(logger, key, name) {
        const handler = {
            "onKeyTyped": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new KeyTypedFSM(logger, handler, key), new KeyDataImpl(), logger, name ?? KeyTyped.name);
    }
}
