import { BoxCheckPressedTransition } from "../../fsm/BoxCheckPressedTransition";
import { isCheckBox } from "../../fsm/Events";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { WidgetDataImpl } from "../WidgetDataImpl";
class BoxCheckedFSM extends FSMImpl {
    constructor(logger, dataHandler) {
        super(logger, dataHandler);
        new BoxCheckPressedTransition(this.initState, this.addTerminalState("checked"), (evt) => {
            this.dataHandler?.initToCheckHandler(evt);
        });
    }
}
export class BoxChecked extends InteractionBase {
    constructor(logger) {
        const handler = {
            "initToCheckHandler": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new BoxCheckedFSM(logger, handler), new WidgetDataImpl(), logger);
    }
    onNewNodeRegistered(node) {
        if (isCheckBox(node)) {
            this.registerActionHandlerInput(node);
        }
    }
    onNodeUnregistered(node) {
        if (isCheckBox(node)) {
            this.unregisterActionHandlerInput(node);
        }
    }
}
