import { Subject } from "rxjs";
import { peek } from "../util/ArrayUtil";
import { UndoHistory } from "../../api/undo/UndoHistory";
export class UndoHistoryImpl extends UndoHistory {
    constructor() {
        super();
        this.sizeMax = 0;
        this.undos = [];
        this.redos = [];
        this.sizeMax = 20;
        this.undoPublisher = new Subject();
        this.redoPublisher = new Subject();
    }
    undosObservable() {
        return this.undoPublisher;
    }
    redosObservable() {
        return this.redoPublisher;
    }
    clear() {
        if (this.undos.length > 0) {
            this.undos.length = 0;
            this.undoPublisher.next(undefined);
        }
        this.clearRedo();
    }
    clearRedo() {
        if (this.redos.length > 0) {
            this.redos.length = 0;
            this.redoPublisher.next(undefined);
        }
    }
    add(undoable) {
        if (this.sizeMax > 0) {
            if (this.undos.length === this.sizeMax) {
                this.undos.shift();
            }
            this.undos.push(undoable);
            this.undoPublisher.next(undoable);
            this.clearRedo();
        }
    }
    undo() {
        const undoable = this.undos.pop();
        if (undoable !== undefined) {
            try {
                undoable.undo();
            }
            finally {
                this.redos.push(undoable);
                this.undoPublisher.next(this.getLastUndo());
                this.redoPublisher.next(undoable);
            }
        }
    }
    redo() {
        const undoable = this.redos.pop();
        if (undoable !== undefined) {
            try {
                undoable.redo();
            }
            finally {
                this.undos.push(undoable);
                this.undoPublisher.next(undoable);
                this.redoPublisher.next(this.getLastRedo());
            }
        }
    }
    getLastUndoMessage() {
        return peek(this.undos)?.getUndoName();
    }
    getLastRedoMessage() {
        return peek(this.redos)?.getUndoName();
    }
    getLastOrEmptyUndoMessage() {
        return this.getLastUndoMessage() ?? "";
    }
    getLastOrEmptyRedoMessage() {
        return this.getLastRedoMessage() ?? "";
    }
    getLastUndo() {
        return peek(this.undos);
    }
    getLastRedo() {
        return peek(this.redos);
    }
    getSizeMax() {
        return this.sizeMax;
    }
    setSizeMax(max) {
        if (max >= 0) {
            const removed = this.undos.splice(0, this.undos.length - max);
            if (this.undos.length === 0 && removed.length > 0) {
                this.undoPublisher.next(undefined);
            }
            this.sizeMax = max;
        }
    }
    getUndo() {
        return this.undos;
    }
    getRedo() {
        return this.redos;
    }
}
