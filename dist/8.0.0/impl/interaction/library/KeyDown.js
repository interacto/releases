import { FSMImpl } from "../../fsm/FSMImpl";
import { KeyTransition } from "../../fsm/KeyTransition";
import { InteractionBase } from "../InteractionBase";
import { KeyDataImpl } from "../KeyDataImpl";
export class KeyDownFSM extends FSMImpl {
    modifiersAccepted;
    constructor(modifierAccepted, logger, dataHandler, key) {
        super(logger, dataHandler);
        this.modifiersAccepted = modifierAccepted;
        new KeyTransition(this.initState, this.addTerminalState("pressed"), "keydown", (evt) => {
            this.dataHandler?.onKeyPressed(evt);
        }, (evt) => (key === undefined || key === evt.code) &&
            (this.modifiersAccepted || (!evt.altKey && !evt.ctrlKey && !evt.shiftKey && !evt.metaKey)));
    }
    reinit() {
        super.reinit();
    }
}
export class KeyDown extends InteractionBase {
    constructor(logger, modifierAccepted, key, fsm, name) {
        const handler = {
            "onKeyPressed": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(fsm ?? new KeyDownFSM(modifierAccepted, logger, handler, key), new KeyDataImpl(), logger, name ?? KeyDown.name);
    }
}
