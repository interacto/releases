import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { KeyDataImpl } from "../KeyDataImpl";
import { KeyTransition } from "../../fsm/KeyTransition";
export class KeyDownFSM extends FSMImpl {
    constructor(modifierAccepted, logger, dataHandler) {
        super(logger, dataHandler);
        this.modifiersAccepted = modifierAccepted;
        new KeyTransition(this.initState, this.addTerminalState("pressed"), "keydown", (evt) => {
            this.dataHandler?.onKeyPressed(evt);
        }, (evt) => this.modifiersAccepted || (!evt.altKey && !evt.ctrlKey && !evt.shiftKey && !evt.metaKey));
    }
    reinit() {
        super.reinit();
    }
}
export class KeyDown extends InteractionBase {
    constructor(logger, modifierAccepted, fsm) {
        const handler = {
            "onKeyPressed": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(fsm ?? new KeyDownFSM(modifierAccepted, logger, handler), new KeyDataImpl(), logger);
    }
}
