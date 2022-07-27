export var WhenType;
(function (WhenType) {
    WhenType[WhenType["nonStrict"] = 0] = "nonStrict";
    WhenType[WhenType["strict"] = 1] = "strict";
    WhenType[WhenType["strictStart"] = 2] = "strictStart";
    WhenType[WhenType["then"] = 3] = "then";
    WhenType[WhenType["strictThen"] = 4] = "strictThen";
    WhenType[WhenType["end"] = 5] = "end";
})(WhenType || (WhenType = {}));
export function isWhenAtStart(type) {
    return type === WhenType.strictStart || type === WhenType.then || type === WhenType.nonStrict || type === WhenType.strict;
}
export function isWhenAtThen(type) {
    return type === WhenType.strictThen || type === WhenType.then || type === WhenType.nonStrict || type === WhenType.strict;
}
export function isWhenAtEnd(type) {
    return type === WhenType.end || type === WhenType.nonStrict || type === WhenType.strict;
}
export function isWhenStrict(type) {
    return type === WhenType.end || type === WhenType.strict || type === WhenType.strictThen || type === WhenType.strictStart;
}
