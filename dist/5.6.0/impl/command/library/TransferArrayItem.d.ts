import { UndoableCommand } from "../UndoableCommand";
export declare class TransferArrayItem<T> extends UndoableCommand {
    private _srcArray;
    private _tgtArray;
    private _srcIndex;
    private _tgtIndex;
    private readonly cmdName;
    constructor(srcArray: Array<T>, tgtArray: Array<T>, srcIndex: number, tgtIndex: number, cmdName: string);
    protected execution(): void;
    canExecute(): boolean;
    getUndoName(): string;
    redo(): void;
    undo(): void;
    get srcArray(): Array<T>;
    set srcArray(value: Array<T>);
    get tgtArray(): Array<T>;
    set tgtArray(value: Array<T>);
    get srcIndex(): number;
    set srcIndex(value: number);
    get tgtIndex(): number;
    set tgtIndex(value: number);
}
