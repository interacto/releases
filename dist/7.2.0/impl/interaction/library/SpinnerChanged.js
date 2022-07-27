import { isSpinner } from "../../fsm/Events";
import { SpinnerChangedTransition } from "../../fsm/SpinnerChangedTransition";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { TimeoutTransition } from "../../fsm/TimeoutTransition";
import { WidgetDataImpl } from "../WidgetDataImpl";
export class SpinnerChangedFSM extends FSMImpl {
    constructor(logger, dataHandler) {
        super(logger, dataHandler);
        const changed = this.addStdState("changed");
        const spinnerAction = (evt) => {
            this.dataHandler?.initToChangedHandler(evt);
        };
        new SpinnerChangedTransition(this.initState, changed, spinnerAction);
        new SpinnerChangedTransition(changed, changed, spinnerAction);
        new TimeoutTransition(changed, this.addTerminalState("ended"), SpinnerChangedFSM.timeGapSupplier);
    }
    static getTimeGap() {
        return SpinnerChangedFSM.timeGap;
    }
    static setTimeGap(timeGapBetweenClicks) {
        if (timeGapBetweenClicks > 0) {
            SpinnerChangedFSM.timeGap = timeGapBetweenClicks;
        }
    }
}
SpinnerChangedFSM.timeGap = 300;
SpinnerChangedFSM.timeGapSupplier = () => SpinnerChangedFSM.getTimeGap();
export class SpinnerChanged extends InteractionBase {
    constructor(logger) {
        const handler = {
            "initToChangedHandler": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new SpinnerChangedFSM(logger, handler), new WidgetDataImpl(), logger);
    }
    onNewNodeRegistered(node) {
        if (isSpinner(node)) {
            this.registerActionHandlerInput(node);
        }
    }
    onNodeUnregistered(node) {
        if (isSpinner(node)) {
            this.unregisterActionHandlerInput(node);
        }
    }
}
