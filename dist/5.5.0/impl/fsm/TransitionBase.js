export class TransitionBase {
    constructor(srcState, tgtState) {
        this.src = srcState;
        this.tgt = tgtState;
        this.src.addTransition(this);
    }
    execute(event) {
        if (this.accept(event) && this.isGuardOK(event)) {
            this.src.getFSM().stopCurrentTimeout();
            this.action(event);
            this.src.exit();
            this.tgt.enter();
            return this.tgt;
        }
        return undefined;
    }
    action(_event) {
    }
    isGuardOK(_event) {
        return true;
    }
    getTarget() {
        return this.tgt;
    }
    uninstall() {
    }
}
