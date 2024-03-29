import { ClickTransition } from "../../fsm/ClickTransition";
import { FSMImpl } from "../../fsm/FSMImpl";
import { TimeoutTransition } from "../../fsm/TimeoutTransition";
import { InteractionBase } from "../InteractionBase";
import { MousePointsDataImpl } from "../MousePointsDataImpl";
import { PointDataImpl } from "../PointDataImpl";
export class ClicksFSM extends FSMImpl {
    countClicks;
    nbClicks;
    constructor(nbClicks, logger, dataHandler) {
        super(logger, dataHandler);
        if (nbClicks <= 0) {
            throw new Error("The number of clicks must be greater than 1");
        }
        if (nbClicks === 1) {
            throw new Error("For a number of clicks that equals 1, use the Click interaction");
        }
        this.countClicks = 0;
        this.nbClicks = nbClicks;
        const clicked = this.addStdState("clicked");
        new ClickTransition(this.initState, clicked, (evt) => {
            this.countClicks++;
            this.dataHandler?.click(evt);
        });
        new ClickTransition(clicked, clicked, (evt) => {
            this.countClicks++;
            this.dataHandler?.click(evt);
        }, () => (this.countClicks + 1) < this.nbClicks);
        new ClickTransition(clicked, this.addTerminalState("ended"), (evt) => {
            this.dataHandler?.click(evt);
        }, () => (this.countClicks + 1) === this.nbClicks);
        new TimeoutTransition(clicked, this.addCancellingState("timeouted"), () => 1000);
    }
    reinit() {
        super.reinit();
        this.countClicks = 0;
    }
}
export class Clicks extends InteractionBase {
    constructor(numberClicks, logger, name) {
        const handler = {
            "click": (evt) => {
                const pt = new PointDataImpl();
                pt.copy(evt);
                this._data.addPoint(pt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(new ClicksFSM(numberClicks, logger, handler), new MousePointsDataImpl(), logger, name ?? Clicks.name);
    }
}
