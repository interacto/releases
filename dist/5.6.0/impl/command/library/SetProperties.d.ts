import { UndoableCommand } from "../UndoableCommand";
import { SetProperty } from "./SetProperty";
export declare class SetProperties<T> extends UndoableCommand {
    readonly obj: T;
    readonly newvalues: Partial<T>;
    readonly compositeCmds: Array<SetProperty<T, keyof T>>;
    constructor(obj: T, newvalues: Partial<T>);
    execute(): Promise<boolean> | boolean;
    protected execution(): void;
    redo(): void;
    undo(): void;
}
