import type { Undoable, UndoableSnapshot } from "./Undoable";
import type { UndoHistoryBase } from "./UndoHistoryBase";
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
export interface UndoableTreeNodeDTO {
    readonly id: number;
    readonly undoable: unknown;
    readonly children: ReadonlyArray<UndoableTreeNodeDTO>;
}
export interface TreeUndoHistoryDTO {
    readonly path: ReadonlyArray<number>;
    readonly roots: ReadonlyArray<UndoableTreeNodeDTO>;
}
export declare abstract class TreeUndoHistory implements UndoHistoryBase {
    abstract get keepPath(): boolean;
    abstract get path(): ReadonlyArray<number>;
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
    abstract export(fn: (undoable: Undoable) => unknown): TreeUndoHistoryDTO;
    abstract import(dtoHistory: TreeUndoHistoryDTO, fn: (dtoUndoable: unknown) => Undoable): void;
}
