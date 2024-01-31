import { UndoHistory } from "../../api/undo/UndoHistory";
import { Subject } from "rxjs";
export class UndoHistoryImpl extends UndoHistory {
    undos;
    redos;
    sizeMax;
    undoPublisher;
    redoPublisher;
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
        return this.undos.at(-1)?.getUndoName();
    }
    getLastRedoMessage() {
        return this.redos.at(-1)?.getUndoName();
    }
    getLastOrEmptyUndoMessage() {
        return this.getLastUndoMessage() ?? "";
    }
    getLastOrEmptyRedoMessage() {
        return this.getLastRedoMessage() ?? "";
    }
    getLastUndo() {
        return this.undos.at(-1);
    }
    getLastRedo() {
        return this.redos.at(-1);
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
