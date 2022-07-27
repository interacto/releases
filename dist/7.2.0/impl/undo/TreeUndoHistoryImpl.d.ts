import type { UndoableTreeNode } from "../../api/undo/TreeUndoHistory";
import { TreeUndoHistory } from "../../api/undo/TreeUndoHistory";
import type { Undoable } from "../../api/undo/Undoable";
import type { Observable } from "rxjs";
export declare class TreeUndoHistoryImpl extends TreeUndoHistory {
    private idCounter;
    private _currentNode;
    readonly undoableNodes: Array<UndoableTreeNode | undefined>;
    private readonly undoPublisher;
    private readonly redoPublisher;
    readonly root: UndoableTreeNode;
    constructor();
    add(undoable: Undoable): void;
    get currentNode(): UndoableTreeNode;
    clear(): void;
    delete(id: number): void;
    goTo(id: number): void;
    private goToFromRoot;
    private gatherToRoot;
    private goFromOneNodeToAnotherOne;
    redo(): void;
    undo(): void;
    getPositions(): Map<number, number>;
    private getPositionNode;
    getLastOrEmptyRedoMessage(): string;
    getLastOrEmptyUndoMessage(): string;
    getLastRedo(): Undoable | undefined;
    getLastRedoMessage(): string | undefined;
    getLastUndo(): Undoable | undefined;
    getLastUndoMessage(): string | undefined;
    undosObservable(): Observable<Undoable | undefined>;
    redosObservable(): Observable<Undoable | undefined>;
}