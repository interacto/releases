import { FSMImpl } from "../../fsm/FSMImpl";
import { KeyTransition } from "../../fsm/KeyTransition";
import { InteractionBase } from "../InteractionBase";
import { KeyDataImpl } from "../KeyDataImpl";
export class KeyUpFSM extends FSMImpl {
    modifiersAccepted;
    constructor(modifierAccepted, logger, dataHandler) {
        super(logger, dataHandler);
        this.modifiersAccepted = modifierAccepted;
        new KeyTransition(this.initState, this.addTerminalState("released"), "keyup", (evt) => {
            this.dataHandler?.onKeyUp(evt);
        }, (ev) => this.modifiersAccepted || (!ev.altKey && !ev.ctrlKey && !ev.shiftKey && !ev.metaKey));
    }
}
export class KeyUp extends InteractionBase {
    constructor(logger, modifierAccepted, fsm, name) {
        const handler = {
            "onKeyUp": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(fsm ?? new KeyUpFSM(modifierAccepted, logger, handler), new KeyDataImpl(), logger, name ?? KeyUp.name);
    }
}
