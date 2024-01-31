export function isUndoableType(obj) {
    if (typeof obj !== "object" || obj === null) {
        return false;
    }
    return "undo" in obj && "redo" in obj && "getUndoName" in obj;
}
