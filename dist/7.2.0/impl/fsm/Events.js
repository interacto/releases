export function getTouch(touches, idToFind) {
    for (let i = 0; i < touches.length; i++) {
        if (touches[i].identifier === idToFind) {
            return touches[i];
        }
    }
    return undefined;
}
export function isButton(target) {
    return target instanceof HTMLButtonElement;
}
export function isCheckBox(target) {
    return target instanceof HTMLInputElement && target.getAttribute("type") === "checkbox";
}
export function isColorChoice(target) {
    return target instanceof HTMLInputElement && target.getAttribute("type") === "color";
}
export function isComboBox(target) {
    return target instanceof HTMLSelectElement;
}
export function isDatePicker(target) {
    return target instanceof HTMLInputElement && target.getAttribute("type") === "date";
}
export function isSpinner(target) {
    return target instanceof HTMLInputElement && target.getAttribute("type") === "number";
}
export function isHyperLink(target) {
    return target instanceof HTMLAnchorElement;
}
export function isTextInput(target) {
    return (target instanceof HTMLInputElement && target.getAttribute("type") === "text") ||
        target instanceof HTMLTextAreaElement;
}
export function isKeyDownEvent(event) {
    return event instanceof KeyboardEvent && event.type === "keydown";
}
export function isKeyUpEvent(event) {
    return event instanceof KeyboardEvent && event.type === "keyup";
}
export var KeyCode;
(function (KeyCode) {
    KeyCode[KeyCode["escape"] = 27] = "escape";
})(KeyCode || (KeyCode = {}));
