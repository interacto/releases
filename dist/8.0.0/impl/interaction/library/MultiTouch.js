import { TouchDnDFSM } from "./TouchDnD";
import { ConcurrentAndFSM } from "../../fsm/ConcurrentAndFSM";
import { ConcurrentInteraction } from "../ConcurrentInteraction";
import { MultiTouchDataImpl } from "../MultiTouchDataImpl";
import { SrcTgtTouchDataImpl } from "../SrcTgtTouchDataImpl";
export class MultiTouchFSM extends ConcurrentAndFSM {
    constructor(nbTouch, totalReinit, logger, dataHandler, movementRequired = false) {
        super(Array.from(Array.from({ "length": nbTouch }).keys(), () => new TouchDnDFSM(false, logger, dataHandler, movementRequired)), logger, totalReinit ? [new TouchDnDFSM(false, logger, dataHandler, movementRequired)] : [], totalReinit, dataHandler);
    }
    process(event) {
        if (!(event instanceof TouchEvent)) {
            return false;
        }
        let processed = false;
        let res = false;
        if (event.type === "touchstart") {
            const ids = new Set(Array.from(event.touches, touch => touch.identifier));
            const losts = this.conccurFSMs.filter(fsm => {
                const id = fsm.getTouchId();
                return id !== undefined && !ids.has(id);
            });
            for (const lost of losts) {
                lost.reinit();
            }
        }
        for (let i = 0; i < event.changedTouches.length; i++) {
            const first = this.conccurFSMs
                .find(fsm => fsm.getTouchId() !== undefined && fsm.getTouchId() === event.changedTouches[i]?.identifier);
            if (first === undefined) {
                const remainingFSM = this.conccurFSMs.find(fsm => fsm.getTouchId() === undefined);
                if (remainingFSM === undefined) {
                    this.onCancelling();
                    res = false;
                }
                else {
                    res = remainingFSM.process(event) || res;
                }
            }
            else {
                processed = true;
                res = first.process(event) || res;
            }
        }
        return processed && res;
    }
}
export class MultiTouch extends ConcurrentInteraction {
    constructor(nbTouches, strict, logger, name) {
        const handler = {
            "onTouch": (event) => {
                const all = Array.from(event.touches);
                for (const touch of Array.from(event.changedTouches)) {
                    const data = new SrcTgtTouchDataImpl();
                    data.copySrc(touch, event, all);
                    data.copyTgt(touch, event, all);
                    this._data.addTouchData(data);
                }
            },
            "onMove": (event) => {
                for (const touch of Array.from(event.changedTouches)) {
                    this._data.setTouch(touch, event);
                }
            },
            "onRelease": (event) => {
                for (const touch of Array.from(event.changedTouches)) {
                    this._data.setTouch(touch, event);
                }
            },
            "reinitData": () => {
                const currentIDs = new Set(this.fsm.conccurFSMs
                    .filter(fsm => fsm.started)
                    .map(fsm => fsm.getTouchId()));
                this.data
                    .touches
                    .filter(data => !currentIDs.has(data.src.identifier))
                    .forEach(data => {
                    this.data.removeTouchData(data.src.identifier);
                });
            }
        };
        super(new MultiTouchFSM(nbTouches, strict, logger, handler), new MultiTouchDataImpl(), logger, name ?? MultiTouch.name);
    }
}
