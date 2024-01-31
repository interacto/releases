import { CommandBase } from "./CommandBase";
export class AnonCmd extends CommandBase {
    exec;
    constructor(fct) {
        super();
        this.exec = fct;
    }
    canExecute() {
        return true;
    }
    execution() {
        this.exec();
    }
}
