import { ClickTransition } from "../../fsm/ClickTransition";
import { FSMImpl } from "../../fsm/FSMImpl";
import { InteractionBase } from "../InteractionBase";
import { PointDataImpl } from "../PointDataImpl";
export class ClickFSM extends FSMImpl {
    constructor(logger, dataHandler) {
        super(logger, dataHandler);
        new ClickTransition(this.initState, this.addTerminalState("clicked"), (evt) => {
            this.setCheckButton(evt.button);
            this.dataHandler?.initToClicked(evt);
        }, (evt) => this.checkButton === undefined || evt.button === this.checkButton);
    }
    getCheckButton() {
        return this.checkButton ?? -1;
    }
    setCheckButton(buttonToCheck) {
        if (this.checkButton === undefined) {
            this.checkButton = buttonToCheck;
        }
    }
    reinit() {
        super.reinit();
        this.checkButton = undefined;
    }
}
export class Click extends InteractionBase {
    constructor(logger, fsm, data) {
        super(fsm ?? new ClickFSM(logger), data ?? new PointDataImpl(), logger);
        this.fsm.dataHandler = {
            "initToClicked": (evt) => {
                this._data.copy(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
    }
}
