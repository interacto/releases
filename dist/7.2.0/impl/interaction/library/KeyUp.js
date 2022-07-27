import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { KeyDataImpl } from "../KeyDataImpl";
import { KeyTransition } from "../../fsm/KeyTransition";
export class KeyUpFSM extends FSMImpl {
    constructor(modifierAccepted, logger, dataHandler) {
        super(logger, dataHandler);
        this.modifiersAccepted = modifierAccepted;
        new KeyTransition(this.initState, this.addTerminalState("released"), "keyup", (evt) => {
            this.dataHandler?.onKeyUp(evt);
        }, (ev) => this.modifiersAccepted || (!ev.altKey && !ev.ctrlKey && !ev.shiftKey && !ev.metaKey));
    }
}
export class KeyUp extends InteractionBase {
    constructor(logger, modifierAccepted, fsm) {
        const handler = {
            "onKeyUp": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(fsm ?? new KeyUpFSM(modifierAccepted, logger, handler), new KeyDataImpl(), logger);
    }
}
