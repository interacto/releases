import { TransitionBase } from "./TransitionBase";
import { catFSM } from "../logging/ConfigLog";
export class TimeoutTransition extends TransitionBase {
    constructor(srcState, tgtState, timeout) {
        super(srcState, tgtState);
        this.timeouted = false;
        this.timeoutDuration = timeout;
        this.timeouted = false;
    }
    startTimeout() {
        if (this.timeoutThread === undefined) {
            const time = this.timeoutDuration();
            if (time <= 0) {
                this.src.getFSM().onTimeout();
                return;
            }
            this.timeoutThread = window.setTimeout(() => {
                try {
                    this.timeouted = true;
                    this.src.getFSM().onTimeout();
                }
                catch (ex) {
                    if (ex instanceof Error) {
                        catFSM.error("Exception on timeout of a timeout transition", ex);
                    }
                    else {
                        catFSM.warn(`Exception on timeout of a timeout transition: ${String(ex)}`);
                    }
                }
            }, time);
        }
    }
    stopTimeout() {
        if (this.timeoutThread !== undefined) {
            clearTimeout(this.timeoutThread);
            this.timeoutThread = undefined;
        }
    }
    accept(event) {
        return this.timeouted;
    }
    isGuardOK(_event) {
        return this.timeouted;
    }
    execute(event) {
        try {
            if (this.accept(event) && this.isGuardOK(event)) {
                this.src.exit();
                this.action(event);
                this.tgt.enter();
                this.timeouted = false;
                return this.tgt;
            }
            return undefined;
        }
        catch (ex) {
            this.timeouted = false;
            throw ex;
        }
    }
    getAcceptedEvents() {
        return [];
    }
}
