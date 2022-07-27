import { isButton } from "../../fsm/Events";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { WidgetDataImpl } from "../WidgetDataImpl";
import { ButtonPressedTransition } from "../../fsm/ButtonPressedTransition";
class ButtonPressedFSM extends FSMImpl {
    constructor(logger, dataHandler) {
        super(logger, dataHandler);
        new ButtonPressedTransition(this.initState, this.addTerminalState("pressed"), (evt) => {
            this.dataHandler?.initToPressedHandler(evt);
        });
    }
}
export class ButtonPressed extends InteractionBase {
    constructor(logger) {
        const handler = {
            "initToPressedHandler": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new ButtonPressedFSM(logger, handler), new WidgetDataImpl(), logger);
    }
    onNewNodeRegistered(node) {
        if (isButton(node)) {
            this.registerActionHandlerClick(node);
        }
    }
    onNodeUnregistered(node) {
        if (isButton(node)) {
            this.unregisterActionHandlerClick(node);
        }
    }
}
