import { TransitionBase } from "./TransitionBase";
export class TimeoutTransition extends TransitionBase {
    constructor(srcState, tgtState, timeout, logger, action) {
        super(srcState, tgtState, action, () => this.timeouted);
        this.logger = logger;
        this.timeouted = false;
        this.timeoutDuration = timeout;
        this.timeouted = false;
    }
    startTimeout() {
        if (this.timeoutThread === undefined) {
            const time = this.timeoutDuration();
            if (time <= 0) {
                this.src.fsm.onTimeout();
                return;
            }
            this.timeoutThread = window.setTimeout(() => {
                try {
                    this.timeouted = true;
                    this.src.fsm.onTimeout();
                }
                catch (ex) {
                    this.logger?.logInteractionErr("Exception on timeout of a timeout transition", ex);
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
    execute(event) {
        try {
            if (this.accept(event) && this.guard(event)) {
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
