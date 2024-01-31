import { MultiTouchFSM } from "./MultiTouch";
import { ConcurrentInteraction } from "../ConcurrentInteraction";
import { FourTouchDataImpl } from "../FourTouchDataImpl";
import { GeneralTwoTouchDataImpl } from "../GeneralTwoTouchDataImpl";
import { InteractionBuilderImpl } from "../InteractionBuilderImpl";
import { ThreeTouchDataImpl } from "../ThreeTouchDataImpl";
export class XTouchDnD extends ConcurrentInteraction {
    constructor(nbTouches, logger, dataImpl, name, fsm, movementRequired) {
        const handler = {
            "onTouch": (evt) => {
                const all = Array.from(evt.touches);
                for (const touch of Array.from(evt.changedTouches)) {
                    this._data.initTouch(touch, evt, all);
                }
            },
            "onMove": (evt) => {
                this.setTgtData(evt);
            },
            "onRelease": (evt) => {
                this.setTgtData(evt);
            },
            "reinitData": () => {
                this.reinitData();
            }
        };
        super(fsm ?? new MultiTouchFSM(nbTouches, true, logger, handler, movementRequired), dataImpl, logger, name ?? XTouchDnD.name);
    }
    setTgtData(evt) {
        const all = Array.from(evt.touches);
        for (const touch of Array.from(evt.changedTouches)) {
            this._data.copyTouch(touch, evt, all);
        }
    }
}
export function twoTouch(logger) {
    return new InteractionBuilderImpl(name => new XTouchDnD(2, logger, new GeneralTwoTouchDataImpl(), name, undefined, false))
        .name(twoTouch.name)
        .build();
}
export class ThreeTouchDnD extends XTouchDnD {
    constructor(logger, name, movementRequired) {
        super(3, logger, new ThreeTouchDataImpl(), name ?? ThreeTouchDnD.name, undefined, movementRequired);
    }
}
export class FourTouchDnD extends XTouchDnD {
    constructor(logger, name, movementRequired) {
        super(4, logger, new FourTouchDataImpl(), name ?? FourTouchDnD.name, undefined, movementRequired);
    }
}
