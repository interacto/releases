export class TransitionBase {
    src;
    tgt;
    action;
    guard;
    constructor(srcState, tgtState, action, guard) {
        this.src = srcState;
        this.tgt = tgtState;
        this.action = action ?? (() => { });
        this.guard = guard ?? (() => true);
        this.src.addTransition(this);
    }
    execute(event) {
        if (this.accept(event) && this.guard(event)) {
            this.src.fsm.stopCurrentTimeout();
            this.action(event);
            this.src.exit();
            this.tgt.enter();
            return this.tgt;
        }
        return undefined;
    }
    acceptVisitor(visitor) {
        visitor.visitTransition(this);
    }
    get target() {
        return this.tgt;
    }
    uninstall() { }
}
