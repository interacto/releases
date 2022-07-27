import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { WheelTransition } from "../../fsm/WheelTransition";
import { WheelDataImpl } from "../WheelDataImpl";
export class WheelFSM extends FSMImpl {
    constructor(logger, dataHandler) {
        super(logger, dataHandler);
        new WheelTransition(this.initState, this.addTerminalState("moved"), (evt) => {
            this.dataHandler?.initToMoved(evt);
        });
    }
}
export class Wheel extends InteractionBase {
    constructor(logger, fsm, data) {
        const handler = {
            "initToMoved": (evt) => {
                this._data.copy(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(fsm ?? new WheelFSM(logger, handler), data ?? new WheelDataImpl(), logger);
    }
}
