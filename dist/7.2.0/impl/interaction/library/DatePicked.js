import { isDatePicker } from "../../fsm/Events";
import { DatePickedTransition } from "../../fsm/DatePickedTransition";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { WidgetDataImpl } from "../WidgetDataImpl";
class DatePickedFSM extends FSMImpl {
    constructor(logger, dataHandler) {
        super(logger, dataHandler);
        new DatePickedTransition(this.initState, this.addTerminalState("picked"), (evt) => {
            this.dataHandler?.initToPickedHandler(evt);
        });
    }
}
export class DatePicked extends InteractionBase {
    constructor(logger) {
        const handler = {
            "initToPickedHandler": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new DatePickedFSM(logger, handler), new WidgetDataImpl(), logger);
    }
    onNewNodeRegistered(node) {
        if (isDatePicker(node)) {
            this.registerActionHandlerInput(node);
        }
    }
    onNodeUnregistered(node) {
        if (isDatePicker(node)) {
            this.unregisterActionHandlerInput(node);
        }
    }
}
