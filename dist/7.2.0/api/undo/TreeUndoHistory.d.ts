import type { UndoHistoryBase } from "./UndoHistoryBase";
import type { Undoable } from "./Undoable";
import type { UndoableSnapshot } from "./Undoable";
import type { Observable } from "rxjs";
export interface UndoableTreeNode {
    lastChildUndone: UndoableTreeNode | undefined;
    readonly id: number;
    readonly undoable: Undoable;
    readonly parent: UndoableTreeNode | undefined;
    readonly children: Array<UndoableTreeNode>;
    readonly visualSnapshot: UndoableSnapshot;
    undo(): void;
    redo(): void;
}
export declare abstract class TreeUndoHistory implements UndoHistoryBase {
    abstract get root(): UndoableTreeNode;
    abstract get undoableNodes(): Array<UndoableTreeNode | undefined>;
    abstract get currentNode(): UndoableTreeNode;
    abstract goTo(id: number): void;
    abstract delete(id: number): void;
    abstract getPositions(): Map<number, number>;
    abstract add(undoable: Undoable): void;
    abstract clear(): void;
    abstract getLastOrEmptyRedoMessage(): string;
    abstract getLastOrEmptyUndoMessage(): string;
    abstract getLastRedo(): Undoable | undefined;
    abstract getLastRedoMessage(): string | undefined;
    abstract getLastUndo(): Undoable | undefined;
    abstract getLastUndoMessage(): string | undefined;
    abstract redo(): void;
    abstract redosObservable(): Observable<Undoable | undefined>;
    abstract undo(): void;
    abstract undosObservable(): Observable<Undoable | undefined>;
}
