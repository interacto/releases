export const mouseEventTypes = [
    "mousedown",
    "mouseup",
    "mousemove",
    "mouseover",
    "mouseout",
    "mouseenter",
    "mouseleave",
    "mousemove",
    "click",
    "auxclick"
];
export const touchEventTypes = [
    "touchstart",
    "touchend",
    "touchmove"
];
export const keyEventTypes = [
    "keydown",
    "keyup"
];
export const eventTypes = [
    ...mouseEventTypes,
    ...touchEventTypes,
    ...keyEventTypes,
    "input",
    "scroll",
    "change",
    "wheel"
];
