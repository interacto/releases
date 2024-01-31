export function isOutputStateType(obj) {
    if (obj === undefined) {
        return false;
    }
    return "exit" in obj && "addTransition" in obj && "process" in obj && "transitions" in obj;
}
