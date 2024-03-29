import { UndoableCommand } from "../UndoableCommand";
export class SetProperty extends UndoableCommand {
    obj;
    prop;
    newvalue;
    mementoValue;
    constructor(obj, prop, newvalue) {
        super();
        this.obj = obj;
        this.prop = prop;
        this.newvalue = newvalue;
        this.mementoValue = undefined;
    }
    createMemento() {
        this.mementoValue = this.obj[this.prop];
    }
    execution() {
        this.obj[this.prop] = this.newvalue;
    }
    redo() {
        this.execution();
    }
    undo() {
        this.obj[this.prop] = this.mementoValue;
    }
    getUndoName() {
        return `Set '${String(this.prop)}' value: ${String(this.newvalue)}`;
    }
}
