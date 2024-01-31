export function isWhenAtStart(type) {
    return type === "strictStart" || type === "then" || type === "nonStrict" || type === "strict";
}
export function isWhenAtThen(type) {
    return type === "strictThen" || type === "then" || type === "nonStrict" || type === "strict";
}
export function isWhenAtEnd(type) {
    return type === "end" || type === "nonStrict" || type === "strict";
}
export function isWhenStrict(type) {
    return type === "end" || type === "strict" || type === "strictThen" || type === "strictStart";
}
