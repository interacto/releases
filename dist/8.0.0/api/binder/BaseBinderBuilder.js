export function isEltRef(obj) {
    if (obj === undefined || obj === null) {
        return false;
    }
    return obj.nativeElement instanceof EventTarget;
}
