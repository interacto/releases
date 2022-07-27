import { isComboBox } from "../../fsm/Events";
import { ComboBoxTransition } from "../../fsm/ComboBoxTransition";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { WidgetDataImpl } from "../WidgetDataImpl";
class ComboBoxSelectedFSM extends FSMImpl {
    constructor(logger, dataHandler) {
        super(logger, dataHandler);
        new ComboBoxTransition(this.initState, this.addTerminalState("selected"), (evt) => {
            this.dataHandler?.initToSelectedHandler(evt);
        });
    }
}
export class ComboBoxSelected extends InteractionBase {
    constructor(logger) {
        const handler = {
            "initToSelectedHandler": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new ComboBoxSelectedFSM(logger, handler), new WidgetDataImpl(), logger);
    }
    onNewNodeRegistered(node) {
        if (isComboBox(node)) {
            this.registerActionHandlerInput(node);
        }
    }
    onNodeUnregistered(node) {
        if (isComboBox(node)) {
            this.unregisterActionHandlerInput(node);
        }
    }
}
