import { UndoableCommand } from "../UndoableCommand";
import { SetProperty } from "./SetProperty";
export class SetProperties extends UndoableCommand {
    constructor(obj, newvalues) {
        super();
        this.obj = obj;
        this.newvalues = newvalues;
        this.compositeCmds = [];
        for (const key in newvalues) {
            this.compositeCmds.push(new SetProperty(obj, key, newvalues[key]));
        }
    }
    execute() {
        this.compositeCmds.forEach(cmd => {
            void cmd.execute();
        });
        return super.execute();
    }
    execution() {
    }
    redo() {
        this.compositeCmds.forEach(cmd => {
            cmd.redo();
        });
    }
    undo() {
        this.compositeCmds.forEach(cmd => {
            cmd.undo();
        });
    }
}
