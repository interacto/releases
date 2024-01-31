import type { Undoable } from "./Undoable";
import type { Observable } from "rxjs";
export interface UndoHistoryBase {
    undo(): void;
    redo(): void;
    clear(): void;
    add(undoable: Undoable): void;
    getLastUndo(): Undoable | undefined;
    getLastRedo(): Undoable | undefined;
    getLastUndoMessage(): string | undefined;
    getLastRedoMessage(): string | undefined;
    getLastOrEmptyUndoMessage(): string;
    getLastOrEmptyRedoMessage(): string;
    undosObservable(): Observable<Undoable | undefined>;
    redosObservable(): Observable<Undoable | undefined>;
}
