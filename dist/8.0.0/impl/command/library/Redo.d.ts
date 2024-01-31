import { CommandBase } from "../CommandBase";
import type { UndoHistoryBase } from "../../../api/undo/UndoHistoryBase";
export declare class Redo extends CommandBase {
    protected readonly history: UndoHistoryBase;
    constructor(undoHistory: UndoHistoryBase);
    canExecute(): boolean;
    protected execution(): void;
}
