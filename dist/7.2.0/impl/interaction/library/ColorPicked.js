import { isColorChoice } from "../../fsm/Events";
import { ColorPickedTransition } from "../../fsm/ColorPickedTransition";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { WidgetDataImpl } from "../WidgetDataImpl";
class ColorPickedFSM extends FSMImpl {
    constructor(logger, dataHandler) {
        super(logger, dataHandler);
        new ColorPickedTransition(this.initState, this.addTerminalState("picked"), (evt) => {
            this.dataHandler?.initToPickedHandler(evt);
        });
    }
}
export class ColorPicked extends InteractionBase {
    constructor(logger) {
        const handler = {
            "initToPickedHandler": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new ColorPickedFSM(logger, handler), new WidgetDataImpl(), logger);
    }
    onNewNodeRegistered(node) {
        if (isColorChoice(node)) {
            this.registerActionHandlerInput(node);
        }
    }
    onNodeUnregistered(node) {
        if (isColorChoice(node)) {
            this.unregisterActionHandlerInput(node);
        }
    }
}
