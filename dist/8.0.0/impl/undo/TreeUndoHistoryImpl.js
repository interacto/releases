import { TreeUndoHistory } from "../../api/undo/TreeUndoHistory";
import { remove } from "../util/ArrayUtil";
import { Subject } from "rxjs";
class UndoableTreeNodeImpl {
    lastChildUndone;
    children;
    id;
    parent;
    undoable;
    cacheVisualSnap;
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
class UndoableTreeNodeDTOImpl {
    children;
    id;
    undoable;
    constructor(node, fn) {
        this.id = node.id;
        this.undoable = fn(node.undoable);
        this.children = node.children.map(child => new UndoableTreeNodeDTOImpl(child, fn));
    }
    static toNode(dto, fn, parent) {
        const node = new UndoableTreeNodeImpl(fn(dto.undoable), dto.id, parent);
        const res = dto.children.map(child => UndoableTreeNodeDTOImpl.toNode(child, fn, node));
        node.children.push(...res.map(currNodeTree => currNodeTree[0]));
        const nodes = [node, ...res.flatMap(currNodeTree => currNodeTree[1])];
        return [node, nodes];
    }
}
export class TreeUndoHistoryImpl extends TreeUndoHistory {
    idCounter;
    _currentNode;
    undoableNodes;
    undoPublisher;
    redoPublisher;
    root;
    _path;
    _keepPath;
    constructor(keepPath = false) {
        super();
        this._keepPath = keepPath;
        this._path = [];
        this.undoableNodes = [];
        this.idCounter = 0;
        this.root = new UndoableTreeNodeImpl({
            getUndoName() {
                return "";
            },
            getVisualSnapshot() {
                return "root";
            },
            redo() { },
            undo() { }
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
        this.addToPath();
        this.idCounter++;
        this.undoPublisher.next(undoable);
        this.redoPublisher.next(undefined);
    }
    get currentNode() {
        return this._currentNode;
    }
    clear() {
        this.root.children.length = 0;
        this._currentNode = this.root;
        this._path.length = 0;
        this.undoableNodes.length = 0;
        this.idCounter = 0;
        this.undoPublisher.next(undefined);
        this.redoPublisher.next(undefined);
    }
    delete(id) {
        if (this.keepPath) {
            return;
        }
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
        for (const child of Array.from(node.children)) {
            this.delete(child.id);
        }
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
        this.addToPath();
        this.undoPublisher.next(this.getLastUndo());
        this.redoPublisher.next(this.getLastRedo());
    }
    goToFromRoot(id) {
        const undoables = this.gatherToRoot(this.undoableNodes[id]);
        for (let i = undoables.length - 1; i >= 0; i--) {
            undoables[i]?.redo();
        }
    }
    gatherToRoot(node) {
        const path = new Array();
        let currentNode = node;
        while (currentNode !== this.root && currentNode !== undefined) {
            path.push(currentNode);
            currentNode = currentNode.parent;
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
            pathSrc[j]?.undo();
        }
        if (i < pathSrc.length) {
            pathSrc[i]?.undo();
        }
        for (let j = i; j < pathTo.length; j++) {
            pathTo[j]?.redo();
        }
    }
    redo() {
        const node = this.currentNode.lastChildUndone;
        if (node !== undefined) {
            node.undoable.redo();
            this._currentNode = node;
            this.addToPath();
            this.undoPublisher.next(node.undoable);
            this.redoPublisher.next(this.getLastRedo());
        }
    }
    undo() {
        if (this.currentNode !== this.root) {
            const currentUndoable = this.currentNode.undoable;
            this.currentNode.undo();
            this._currentNode = this.currentNode.parent ?? this.root;
            this.addToPath();
            this.undoPublisher.next(this.getLastUndo());
            this.redoPublisher.next(currentUndoable);
        }
    }
    getPositions() {
        const positions = new Map();
        this.getPositionNode(this.root, positions, 0);
        return positions;
    }
    getPositionNode(node, positions, counter) {
        const [child0, child1] = node.children;
        if (child0 === undefined) {
            positions.set(node.id, counter);
            return counter + 1;
        }
        if (child1 === undefined) {
            const newCounter = this.getPositionNode(child0, positions, counter);
            positions.set(node.id, positions.get(child0.id) ?? -1);
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
            const value = node.children[Math.floor(node.children.length / 2)];
            newCounter = this.getPositionNode(value, positions, newCounter);
            positions.set(node.id, positions.get(value.id) ?? -1);
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
    get path() {
        return this._path;
    }
    get keepPath() {
        return this._keepPath;
    }
    addToPath() {
        if (this.keepPath) {
            this._path.push(this._currentNode.id);
        }
    }
    export(fn) {
        return {
            "roots": this.root.children.map(child => new UndoableTreeNodeDTOImpl(child, fn)),
            "path": this.path
        };
    }
    import(dtoHistory, fn) {
        this.clear();
        if (this.keepPath) {
            this._path.push(...dtoHistory.path);
        }
        const res = dtoHistory.roots.map(root => UndoableTreeNodeDTOImpl.toNode(root, fn, this.root));
        this.root.children.push(...res.map(currRoot => currRoot[0]));
        for (const currNode of res.flatMap(currRoot => currRoot[1])) {
            this.undoableNodes[currNode.id] = currNode;
        }
        this._currentNode = this.root;
        this.idCounter = Math.max(...this._path) + 1;
        const gotoId = this.path.at(-1);
        if (gotoId !== undefined) {
            this.goTo(gotoId);
            this.goTo(-1);
        }
        this.undoPublisher.next(this.getLastUndo());
        this.redoPublisher.next(this.getLastRedo());
    }
}
