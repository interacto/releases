export class VisitorFSMDepthFirst {
    visited;
    constructor() {
        this.visited = new Set();
    }
    visitAndConcurrentFSM(fsm) {
        for (const concFSM of fsm.getAllConccurFSMs()) {
            concFSM.acceptVisitor(this);
        }
    }
    visitXOrConcurrentFSM(fsm) {
        for (const concFSM of fsm.getAllConccurFSMs()) {
            concFSM.acceptVisitor(this);
        }
    }
    visitInitState(state) {
        if (this.alreadyVisited(state)) {
            return;
        }
        for (const tr of state.transitions) {
            tr.acceptVisitor(this);
        }
    }
    visitState(state) {
        if (this.alreadyVisited(state)) {
            return;
        }
        for (const tr of state.transitions) {
            tr.acceptVisitor(this);
        }
    }
    visitCancellingState(_state) { }
    visitTerminalState(_state) { }
    visitFSM(fsm) {
        fsm.initState.acceptVisitor(this);
    }
    visitTransition(transition) {
        transition.target.acceptVisitor(this);
    }
    visitTimeoutTransition(transition) {
        transition.target.acceptVisitor(this);
    }
    clear() {
        this.visited.clear();
    }
    alreadyVisited(state) {
        const already = this.visited.has(state);
        if (!already) {
            this.visited.add(state);
        }
        return already;
    }
}
