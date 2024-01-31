import { FSMImpl } from "../../fsm/FSMImpl";
import { TouchTransition } from "../../fsm/TouchTransition";
import { InteractionBase } from "../InteractionBase";
import { TouchDataImpl } from "../TouchDataImpl";
class TouchStartFSM extends FSMImpl {
    constructor(logger, dataHandler) {
        super(logger, dataHandler);
        new TouchTransition(this.initState, this.addTerminalState("touched"), "touchstart", (event) => {
            this.dataHandler?.initToTouch(event);
        });
    }
}
export class TouchStart extends InteractionBase {
    constructor(logger, name) {
        const handler = {
            "initToTouch": (evt) => {
                this._data.copy(TouchDataImpl.mergeTouchEventData(evt.changedTouches[0], evt, Array.from(evt.touches)));
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new TouchStartFSM(logger, handler), new TouchDataImpl(), logger, name ?? TouchStart.name);
    }
}
