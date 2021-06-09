import { CommandBase } from "../CommandBase";
import type { UndoHistory } from "../../../api/undo/UndoHistory";
export declare class Redo extends CommandBase {
    private readonly history;
    constructor(undoHistory: UndoHistory);
    canExecute(): boolean;
    protected execution(): void;
}
