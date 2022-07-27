import { isTextInput } from "../../fsm/Events";
import { TextInputChangedTransition } from "../../fsm/TextInputChangedTransition";
import { TimeoutTransition } from "../../fsm/TimeoutTransition";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { WidgetDataImpl } from "../WidgetDataImpl";
class TextInputChangedFSM extends FSMImpl {
    constructor(logger, dataHandler, timeSet) {
        super(logger, dataHandler);
        this._timeGap = 1000;
        this.timeGapSupplier = () => this.getTimeGap();
        if (timeSet !== undefined) {
            this._timeGap = timeSet;
        }
        const changed = this.addStdState("changed");
        new TextInputChangedTransition(this.initState, changed, (evt) => {
            this.dataHandler?.initToChangedHandler(evt);
        });
        new TextInputChangedTransition(changed, changed, (evt) => {
            this.dataHandler?.initToChangedHandler(evt);
        });
        new TimeoutTransition(changed, this.addTerminalState("ended"), this.timeGapSupplier);
    }
    getTimeGap() {
        return this._timeGap;
    }
}
export class TextInputChanged extends InteractionBase {
    constructor(logger, timeGap) {
        const handler = {
            "initToChangedHandler": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new TextInputChangedFSM(logger, handler, timeGap), new WidgetDataImpl(), logger);
    }
    onNewNodeRegistered(node) {
        if (isTextInput(node)) {
            this.registerActionHandlerInput(node);
        }
    }
    onNodeUnregistered(node) {
        if (isTextInput(node)) {
            this.unregisterActionHandlerInput(node);
        }
    }
}
