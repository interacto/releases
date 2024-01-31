import { FSMImpl } from "../../fsm/FSMImpl";
import { ScrollTransition } from "../../fsm/ScrollTransition";
import { InteractionBase } from "../InteractionBase";
import { ScrollDataImpl } from "../ScrollDataImpl";
export class ScrollFSM extends FSMImpl {
    constructor(logger, dataHandler) {
        super(logger, dataHandler);
        new ScrollTransition(this.initState, this.addTerminalState("scrolled"), (evt) => {
            this.dataHandler?.initToScroll(evt);
        });
    }
}
export class Scroll extends InteractionBase {
    constructor(logger, name) {
        const handler = {
            "initToScroll": (event) => {
                this._data.setScrollData(event);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new ScrollFSM(logger, handler), new ScrollDataImpl(), logger, name ?? Scroll.name);
    }
}
