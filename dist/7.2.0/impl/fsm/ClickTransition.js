import { MouseTransition } from "./MouseTransition";
export class ClickTransition extends MouseTransition {
    constructor(srcState, tgtState, action, guard) {
        super(srcState, tgtState, ["click", "auxclick"], action, guard);
    }
}
