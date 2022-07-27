import { CommandBase } from "../CommandBase";
export class FocusHTMLElement extends CommandBase {
    constructor(elt) {
        super();
        this.element = elt;
    }
    execution() {
        this.element.focus();
    }
    canExecute() {
        return this.element instanceof HTMLElement;
    }
}
