import { TransitionBase } from "./TransitionBase";
export class TimeoutTransition extends TransitionBase {
    timeoutDuration;
    logger;
    timeoutThread;
    timeouted;
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
                catch (error) {
                    this.logger?.logInteractionErr("Exception on timeout of a timeout transition", error);
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
    accept(_event) {
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
        catch (error) {
            this.timeouted = false;
            throw error;
        }
    }
    getAcceptedEvents() {
        return new Set();
    }
    acceptVisitor(visitor) {
        visitor.visitTimeoutTransition(this);
    }
}
