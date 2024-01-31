import { isTextInput } from "../../fsm/Events";
import { FSMImpl } from "../../fsm/FSMImpl";
import { TextInputChangedTransition } from "../../fsm/TextInputChangedTransition";
import { TimeoutTransition } from "../../fsm/TimeoutTransition";
import { InteractionBase } from "../InteractionBase";
import { WidgetDataImpl } from "../WidgetDataImpl";
class TextInputChangedFSM extends FSMImpl {
    _timeGap = 1000;
    timeGapSupplier = () => this.getTimeGap();
    getTimeGap() {
        return this._timeGap;
    }
    constructor(logger, dataHandler, timeSet) {
        super(logger, dataHandler);
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
}
export class TextInputChanged extends InteractionBase {
    constructor(logger, timeGap, name) {
        const handler = {
            "initToChangedHandler": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new TextInputChangedFSM(logger, handler, timeGap), new WidgetDataImpl(), logger, name ?? TextInputChanged.name);
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
