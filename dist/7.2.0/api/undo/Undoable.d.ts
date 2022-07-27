export declare type PrimitiveUndoableSnapshot = HTMLElement | SVGElement | string;
export declare type UndoableSnapshot = PrimitiveUndoableSnapshot | Promise<PrimitiveUndoableSnapshot> | undefined;
export interface Undoable {
    undo(): void;
    redo(): void;
    getUndoName(): string;
    getVisualSnapshot(): UndoableSnapshot;
}
export declare function isUndoableType(obj: unknown): obj is Undoable;
