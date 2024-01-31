import { FSMImpl } from "../../fsm/FSMImpl";
import { KeyTransition } from "../../fsm/KeyTransition";
import { TimeoutTransition } from "../../fsm/TimeoutTransition";
import { InteractionBase } from "../InteractionBase";
import { KeysDataImpl } from "../KeysDataImpl";
export class KeysTypedFSM extends FSMImpl {
    static timeGap = 1000;
    static timeGapSupplier = () => KeysTypedFSM.getTimeGap();
    static getTimeGap() {
        return KeysTypedFSM.timeGap;
    }
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
}
export class KeysTyped extends InteractionBase {
    constructor(logger, name) {
        const handler = {
            "onKeyTyped": (event) => {
                this._data.addKey(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new KeysTypedFSM(logger, handler), new KeysDataImpl(), logger, name ?? KeysTyped.name);
    }
}
