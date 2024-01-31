import { SetProperty } from "./SetProperty";
import { UndoableCommand } from "../UndoableCommand";
export class SetProperties extends UndoableCommand {
    obj;
    _newvalues;
    compositeCmds;
    constructor(obj, newvalues) {
        super();
        this.obj = obj;
        this.compositeCmds = [];
        this._newvalues = newvalues;
        this.newvalues = newvalues;
    }
    get newvalues() {
        return this._newvalues;
    }
    set newvalues(value) {
        this._newvalues = value;
        for (const key in value) {
            this.compositeCmds.push(new SetProperty(this.obj, key, value[key]));
        }
    }
    execute() {
        for (const cmd of this.compositeCmds) {
            void cmd.execute();
        }
        return super.execute();
    }
    execution() { }
    redo() {
        for (const cmd of this.compositeCmds) {
            cmd.redo();
        }
    }
    undo() {
        for (const cmd of this.compositeCmds) {
            cmd.undo();
        }
    }
}
