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
        this.roots = new Set();
        this.idCounter = 0;
        this.undoPublisher = new Subject();
        this.redoPublisher = new Subject();
    }
    add(undoable) {
        const node = new UndoableTreeNodeImpl(undoable, this.idCounter, this.currentNode);
        this.undoableNodes[this.idCounter] = node;
        if (this.currentNode === undefined) {
            this.roots.add(node.id);
        }
        else {
            this.currentNode.children.push(node);
        }
        this._currentNode = node;
        this.idCounter++;
        this.undoPublisher.next(undoable);
    }
    get currentNode() {
        return this._currentNode;
    }
    clear() {
        this.roots.clear();
        this._currentNode = undefined;
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
        while (nodeBranch !== undefined) {
            if (nodeBranch.id === id) {
                return;
            }
            nodeBranch = nodeBranch.parent;
        }
        this.undoableNodes[id] = undefined;
        this.roots.delete(id);
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
            this._currentNode = undefined;
        }
    }
    goTo(id) {
        var _a;
        if (((_a = this.currentNode) === null || _a === void 0 ? void 0 : _a.id) === id || this.undoableNodes.length === 0 || id >= this.undoableNodes.length || id < -1) {
            return;
        }
        if (this.currentNode === undefined) {
            this.goToFromRoot(id);
        }
        else {
            this.goFromOneNodeToAnotherOne(id);
        }
        this._currentNode = this.undoableNodes[id];
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
        while (n !== undefined) {
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
        const node = this.currentNode === undefined ? this.undoableNodes[0] : this.currentNode.lastChildUndone;
        if (node !== undefined) {
            node.undoable.redo();
            this._currentNode = node;
            this.undoPublisher.next(node.undoable);
            this.redoPublisher.next(this.getLastRedo());
        }
    }
    undo() {
        if (this.currentNode !== undefined) {
            const u = this.currentNode.undoable;
            this.currentNode.undo();
            this._currentNode = this.currentNode.parent;
            this.undoPublisher.next(this.getLastUndo());
            this.redoPublisher.next(u);
        }
    }
    getPositions() {
        const positions = new Map();
        let counter = 0;
        this.roots.forEach(root => {
            counter = this.getPositionNode(this.undoableNodes[root], positions, counter);
        });
        return positions;
    }
    getPositionNode(node, positions, counter) {
        var _a, _b;
        if (node.children.length === 0) {
            positions.set(node.id, counter);
            return counter + 1;
        }
        if (node.children.length === 1) {
            const newCounter = this.getPositionNode(node.children[0], positions, counter);
            positions.set(node.id, (_a = positions.get(node.children[0].id)) !== null && _a !== void 0 ? _a : -1);
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
            positions.set(node.id, (_b = positions.get(node.children[Math.floor(node.children.length / 2)].id)) !== null && _b !== void 0 ? _b : -1);
        }
        for (let i = Math.ceil(node.children.length / 2); i < node.children.length; i++) {
            newCounter = this.getPositionNode(node.children[i], positions, newCounter);
        }
        return newCounter;
    }
    getLastOrEmptyRedoMessage() {
        var _a;
        return (_a = this.getLastRedoMessage()) !== null && _a !== void 0 ? _a : "";
    }
    getLastOrEmptyUndoMessage() {
        var _a;
        return (_a = this.getLastUndoMessage()) !== null && _a !== void 0 ? _a : "";
    }
    getLastRedo() {
        var _a, _b;
        if (this.currentNode === undefined) {
            return (_a = this.undoableNodes[0]) === null || _a === void 0 ? void 0 : _a.undoable;
        }
        if (this.currentNode.lastChildUndone !== undefined) {
            return this.currentNode.lastChildUndone.undoable;
        }
        return (_b = this.currentNode.children[0]) === null || _b === void 0 ? void 0 : _b.undoable;
    }
    getLastRedoMessage() {
        var _a;
        return (_a = this.getLastRedo()) === null || _a === void 0 ? void 0 : _a.getUndoName();
    }
    getLastUndo() {
        var _a;
        return (_a = this.currentNode) === null || _a === void 0 ? void 0 : _a.undoable;
    }
    getLastUndoMessage() {
        var _a;
        return (_a = this.getLastUndo()) === null || _a === void 0 ? void 0 : _a.getUndoName();
    }
    undosObservable() {
        return this.undoPublisher;
    }
    redosObservable() {
        return this.redoPublisher;
    }
}
