import { TreeUndoHistory } from "../../api/undo/TreeUndoHistory";
import { remove } from "../util/ArrayUtil";
import { Subject } from "rxjs";
class UndoableTreeNodeImpl {
    constructor(undoable, id, parent) {
        this.undoable = undoable;
        this.id = id;
        this.children = new Array();
        this.parent = parent;
        this.cacheVisualSnap = undoable.getVisualSnapshot();
    }
    undo() {
        if (this.parent !== undefined) {
            this.parent.lastChildUndone = this;
        }
        this.undoable.undo();
    }
    redo() {
        this.undoable.redo();
    }
    get visualSnapshot() {
        return this.cacheVisualSnap;
    }
}
export class TreeUndoHistoryImpl extends TreeUndoHistory {
    constructor() {
        super();
        this.undoableNodes = [];
        this.idCounter = 0;
        this.root = new UndoableTreeNodeImpl({
            getUndoName() {
                return "";
            },
            getVisualSnapshot() {
                return "root";
            },
            redo() {
            },
            undo() {
            }
        }, -1, undefined);
        this._currentNode = this.root;
        this.undoPublisher = new Subject();
        this.redoPublisher = new Subject();
    }
    add(undoable) {
        const node = new UndoableTreeNodeImpl(undoable, this.idCounter, this.currentNode);
        this.undoableNodes[this.idCounter] = node;
        this.currentNode.children.push(node);
        this._currentNode = node;
        this.idCounter++;
        this.undoPublisher.next(undoable);
    }
    get currentNode() {
        return this._currentNode;
    }
    clear() {
        this._currentNode = this.root;
        this.undoableNodes.length = 0;
        this.idCounter = 0;
        this.undoPublisher.next(undefined);
        this.redoPublisher.next(undefined);
    }
    delete(id) {
        const node = this.undoableNodes[id];
        if (node === undefined) {
            return;
        }
        let nodeBranch = this.currentNode;
        while (nodeBranch !== this.root) {
            if (nodeBranch.id === id) {
                return;
            }
            nodeBranch = nodeBranch.parent ?? this.root;
        }
        this.undoableNodes[id] = undefined;
        if (node.parent !== undefined) {
            remove(node.parent.children, node);
            if (node.parent.lastChildUndone === node) {
                node.parent.lastChildUndone = undefined;
            }
        }
        [...node.children].forEach(child => {
            this.delete(child.id);
        });
        if (this.currentNode === node) {
            this._currentNode = this.root;
        }
    }
    goTo(id) {
        if (this.currentNode.id === id || this.undoableNodes.length === 0 || id >= this.undoableNodes.length || id < -1) {
            return;
        }
        if (this.currentNode === this.root) {
            this.goToFromRoot(id);
        }
        else {
            this.goFromOneNodeToAnotherOne(id);
        }
        this._currentNode = this.undoableNodes[id] ?? this.root;
    }
    goToFromRoot(id) {
        const undoables = this.gatherToRoot(this.undoableNodes[id]);
        for (let i = undoables.length - 1; i >= 0; i--) {
            undoables[i].redo();
        }
    }
    gatherToRoot(node) {
        const path = new Array();
        let n = node;
        while (n !== this.root && n !== undefined) {
            path.push(n);
            n = n.parent;
        }
        return path.reverse();
    }
    goFromOneNodeToAnotherOne(id) {
        const pathSrc = this.gatherToRoot(this.currentNode);
        const pathTo = id === -1 ? [] : this.gatherToRoot(this.undoableNodes[id]);
        let i = 0;
        while (pathSrc[i] === pathTo[i]) {
            i++;
        }
        for (let j = pathSrc.length - 1; j > i; j--) {
            pathSrc[j].undo();
        }
        if (i < pathSrc.length) {
            pathSrc[i].undo();
        }
        for (let j = i; j < pathTo.length; j++) {
            pathTo[j].redo();
        }
    }
    redo() {
        const node = this.currentNode.lastChildUndone;
        if (node !== undefined) {
            node.undoable.redo();
            this._currentNode = node;
            this.undoPublisher.next(node.undoable);
            this.redoPublisher.next(this.getLastRedo());
        }
    }
    undo() {
        if (this.currentNode !== this.root) {
            const u = this.currentNode.undoable;
            this.currentNode.undo();
            this._currentNode = this.currentNode.parent ?? this.root;
            this.undoPublisher.next(this.getLastUndo());
            this.redoPublisher.next(u);
        }
    }
    getPositions() {
        const positions = new Map();
        this.getPositionNode(this.root, positions, 0);
        return positions;
    }
    getPositionNode(node, positions, counter) {
        if (node.children.length === 0) {
            positions.set(node.id, counter);
            return counter + 1;
        }
        if (node.children.length === 1) {
            const newCounter = this.getPositionNode(node.children[0], positions, counter);
            positions.set(node.id, positions.get(node.children[0].id) ?? -1);
            return newCounter;
        }
        let newCounter = counter;
        for (let i = 0; i < Math.floor(node.children.length / 2); i++) {
            newCounter = this.getPositionNode(node.children[i], positions, newCounter);
        }
        if (node.children.length % 2 === 0) {
            positions.set(node.id, newCounter);
            newCounter++;
        }
        else {
            newCounter = this.getPositionNode(node.children[Math.floor(node.children.length / 2)], positions, newCounter);
            positions.set(node.id, positions.get(node.children[Math.floor(node.children.length / 2)].id) ?? -1);
        }
        for (let i = Math.ceil(node.children.length / 2); i < node.children.length; i++) {
            newCounter = this.getPositionNode(node.children[i], positions, newCounter);
        }
        return newCounter;
    }
    getLastOrEmptyRedoMessage() {
        return this.getLastRedoMessage() ?? "";
    }
    getLastOrEmptyUndoMessage() {
        return this.getLastUndoMessage() ?? "";
    }
    getLastRedo() {
        if (this.currentNode.lastChildUndone !== undefined) {
            return this.currentNode.lastChildUndone.undoable;
        }
        return this.currentNode.children[0]?.undoable;
    }
    getLastRedoMessage() {
        return this.getLastRedo()?.getUndoName();
    }
    getLastUndo() {
        return this.currentNode === this.root ? undefined : this.currentNode.undoable;
    }
    getLastUndoMessage() {
        return this.getLastUndo()?.getUndoName();
    }
    undosObservable() {
        return this.undoPublisher;
    }
    redosObservable() {
        return this.redoPublisher;
    }
}
