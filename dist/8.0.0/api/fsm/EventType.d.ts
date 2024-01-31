export declare const mouseEventTypes: readonly ["mousedown", "mouseup", "mousemove", "mouseover", "mouseout", "mouseenter", "mouseleave", "click", "auxclick"];
export declare const touchEventTypes: readonly ["touchstart", "touchend", "touchmove"];
export declare const keyEventTypes: readonly ["keydown", "keyup"];
export declare const eventTypes: readonly ["mousedown", "mouseup", "mousemove", "mouseover", "mouseout", "mouseenter", "mouseleave", "click", "auxclick", "touchstart", "touchend", "touchmove", "keydown", "keyup", "input", "scroll", "change", "wheel"];
export type EventType = typeof eventTypes[number];
export type MouseEventType = typeof mouseEventTypes[number];
export type TouchEventType = typeof touchEventTypes[number];
export type KeyEventType = typeof keyEventTypes[number];
