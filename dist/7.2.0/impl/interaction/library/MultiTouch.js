import { ConcurrentFSM } from "../../fsm/ConcurrentFSM";
import { ConcurrentInteraction } from "../ConcurrentInteraction";
import { TouchDnDFSM } from "./TouchDnD";
import { MultiTouchDataImpl } from "../MultiTouchDataImpl";
import { SrcTgtTouchDataImpl } from "../SrcTgtTouchDataImpl";
class MultiTouchFSM extends ConcurrentFSM {
    constructor(nbTouch, totalReinit, logger, dataHandler) {
        super([...Array(nbTouch).keys()].map(_ => new TouchDnDFSM(false, logger, dataHandler, false)), logger, totalReinit ? [new TouchDnDFSM(false, logger, dataHandler, false)] : [], totalReinit, dataHandler);
    }
    process(event) {
        if (!(event instanceof TouchEvent)) {
            return false;
        }
        let processed = false;
        let res = false;
        if (event.type === "touchstart") {
            const ids = new Set([...event.touches].map(touch => touch.identifier));
            const losts = this.conccurFSMs.filter(fsm => {
                const id = fsm.getTouchId();
                return id !== undefined && !ids.has(id);
            });
            losts.forEach(lost => {
                lost.reinit();
            });
        }
        for (let i = 0; i < event.changedTouches.length; i++) {
            const touches = this.conccurFSMs
                .filter(fsm => fsm.getTouchId() === event.changedTouches[i].identifier);
            if (touches.length > 0) {
                processed = true;
                res = touches[0].process(event) || res;
            }
            else {
                const remainingFSMs = this.conccurFSMs.filter(fsm => fsm.getTouchId() === undefined);
                if (remainingFSMs.length === 0) {
                    this.onCancelling();
                    res = false;
                }
                else {
                    res = remainingFSMs[0].process(event) || res;
                }
            }
        }
        return processed && res;
    }
}
export class MultiTouch extends ConcurrentInteraction {
    constructor(nbTouches, strict, logger) {
        const handler = {
            "onTouch": (event) => {
                for (let i = 0; i < event.changedTouches.length; i++) {
                    const data = new SrcTgtTouchDataImpl();
                    const all = [...event.touches];
                    data.copySrc(event.changedTouches[i], event, all);
                    data.copyTgt(event.changedTouches[i], event, all);
                    this._data.addTouchData(data);
                }
            },
            "onMove": (event) => {
                for (let i = 0; i < event.changedTouches.length; i++) {
                    this._data.setTouch(event.changedTouches[i], event);
                }
            },
            "onRelease": (event) => {
                for (let i = 0; i < event.changedTouches.length; i++) {
                    this._data.setTouch(event.changedTouches[i], event);
                }
            },
            "reinitData": () => {
                const currentIDs = this.fsm.conccurFSMs
                    .filter(fsm => fsm.started)
                    .map(fsm => fsm.getTouchId());
                this.data
                    .touches
                    .filter(data => !currentIDs.includes(data.src.identifier))
                    .forEach(data => {
                    this.data.removeTouchData(data.src.identifier);
                });
            }
        };
        super(new MultiTouchFSM(nbTouches, strict, logger, handler), new MultiTouchDataImpl(), logger);
    }
}
