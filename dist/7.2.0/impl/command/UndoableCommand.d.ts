import { CommandBase } from "./CommandBase";
import type { Undoable, UndoableSnapshot } from "../../api/undo/Undoable";
export declare abstract class UndoableCommand extends CommandBase implements Undoable {
    getUndoName(): string;
    getVisualSnapshot(): UndoableSnapshot;
    abstract redo(): void;
    abstract undo(): void;
}
