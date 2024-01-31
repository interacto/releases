import { CommandBase } from "../CommandBase";
export declare class FocusHTMLElement extends CommandBase {
    private readonly element;
    constructor(elt: unknown);
    protected execution(): void;
    canExecute(): boolean;
}
