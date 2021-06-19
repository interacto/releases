import { UndoableCommand } from "../UndoableCommand";
export declare class SetProperty<T, S extends keyof T> extends UndoableCommand {
    private readonly obj;
    private readonly prop;
    private readonly newvalue;
    private mementoValue;
    constructor(obj: T, prop: S, newvalue: T[S]);
    protected createMemento(): void;
    protected execution(): void;
    redo(): void;
    undo(): void;
    getUndoName(): string;
}
