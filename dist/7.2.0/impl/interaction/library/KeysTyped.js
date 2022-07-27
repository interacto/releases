import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { TimeoutTransition } from "../../fsm/TimeoutTransition";
import { KeysDataImpl } from "../KeysDataImpl";
import { KeyTransition } from "../../fsm/KeyTransition";
export class KeysTypedFSM extends FSMImpl {
    constructor(logger, dataHandler) {
        super(logger, dataHandler);
        const keyup = this.addStdState("keyup");
        const action = (event) => {
            this.dataHandler?.onKeyTyped(event);
        };
        new KeyTransition(this.initState, keyup, "keyup", action);
        new KeyTransition(keyup, keyup, "keyup", action);
        new TimeoutTransition(keyup, this.addTerminalState("timeouted"), KeysTypedFSM.timeGapSupplier);
    }
    static getTimeGap() {
        return KeysTypedFSM.timeGap;
    }
}
KeysTypedFSM.timeGap = 1000;
KeysTypedFSM.timeGapSupplier = () => KeysTypedFSM.getTimeGap();
export class KeysTyped extends InteractionBase {
    constructor(logger) {
        const handler = {
            "onKeyTyped": (event) => {
                this._data.addKey(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new KeysTypedFSM(logger, handler), new KeysDataImpl(), logger);
    }
}
