import { isSpinner } from "../../fsm/Events";
import { FSMImpl } from "../../fsm/FSMImpl";
import { SpinnerChangedTransition } from "../../fsm/SpinnerChangedTransition";
import { TimeoutTransition } from "../../fsm/TimeoutTransition";
import { InteractionBase } from "../InteractionBase";
import { WidgetDataImpl } from "../WidgetDataImpl";
export class SpinnerChangedFSM extends FSMImpl {
    static timeGap = 300;
    static timeGapSupplier = () => SpinnerChangedFSM.getTimeGap();
    static getTimeGap() {
        return SpinnerChangedFSM.timeGap;
    }
    static setTimeGap(timeGapBetweenClicks) {
        if (timeGapBetweenClicks > 0) {
            SpinnerChangedFSM.timeGap = timeGapBetweenClicks;
        }
    }
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
}
export class SpinnerChanged extends InteractionBase {
    constructor(logger, name) {
        const handler = {
            "initToChangedHandler": (event) => {
                this._data.copy(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new SpinnerChangedFSM(logger, handler), new WidgetDataImpl(), logger, name ?? SpinnerChanged.name);
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
