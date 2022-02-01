export function isEltRef(o) {
    if (o === undefined || o === null) {
        return false;
    }
    return o.nativeElement instanceof EventTarget;
}
