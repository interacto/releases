import { isHyperLink } from "../../fsm/Events";
import { HyperLinkTransition } from "../../fsm/HyperLinkTransition";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { WidgetDataImpl } from "../WidgetDataImpl";
class HyperLinkClickedFSM extends FSMImpl {
    constructor(logger, dataHandler) {
        super(logger, dataHandler);
        new HyperLinkTransition(this.initState, this.addTerminalState("clicked"), (evt) => {
            this.dataHandler?.initToClickedHandler(evt);
        });
    }
}
export class HyperLinkClicked extends InteractionBase {
    constructor(logger) {
        const handler = {
            "initToClickedHandler": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new HyperLinkClickedFSM(logger, handler), new WidgetDataImpl(), logger);
    }
    onNewNodeRegistered(node) {
        if (isHyperLink(node)) {
            this.registerActionHandlerInput(node);
        }
    }
    onNodeUnregistered(node) {
        if (isHyperLink(node)) {
            this.unregisterActionHandlerInput(node);
        }
    }
}
