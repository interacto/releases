import { FSMImpl } from "../../fsm/FSMImpl";
import { KeysDataImpl } from "../KeysDataImpl";
import { InteractionBase } from "../InteractionBase";
import { KeyTransition } from "../../fsm/KeyTransition";
export class KeysDownFSM extends FSMImpl {
    constructor(logger, dataHandler) {
        super(logger, dataHandler);
        this.currentCodes = [];
        const pressed = this.addStdState("pressed");
        const actionkp = (evt) => {
            this.currentCodes.push(evt.code);
            this.dataHandler?.onKeyPressed(evt);
        };
        new KeyTransition(this.initState, pressed, "keydown", actionkp);
        new KeyTransition(pressed, pressed, "keydown", actionkp);
        new KeyTransition(pressed, this.addTerminalState("ended"), "keyup", undefined, (evt) => this.currentCodes.find(value => value === evt.code) !== undefined);
    }
    reinit() {
        this.currentCodes.length = 0;
        super.reinit();
    }
}
export class KeysDown extends InteractionBase {
    constructor(logger) {
        const handler = {
            "onKeyPressed": (event) => {
                this._data.addKey(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new KeysDownFSM(logger, handler), new KeysDataImpl(), logger);
    }
}
