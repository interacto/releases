export declare const mouseEventTypes: readonly ["mousedown", "mouseup", "mousemove", "mouseover", "mouseout", "mouseenter", "mouseleave", "mousemove", "click", "auxclick"];
export declare const touchEventTypes: readonly ["touchstart", "touchend", "touchmove"];
export declare const keyEventTypes: readonly ["keydown", "keyup"];
export declare const eventTypes: readonly ["mousedown", "mouseup", "mousemove", "mouseover", "mouseout", "mouseenter", "mouseleave", "mousemove", "click", "auxclick", "touchstart", "touchend", "touchmove", "keydown", "keyup", "input", "scroll", "change", "wheel"];
export declare type EventType = typeof eventTypes[number];
export declare type MouseEventType = typeof mouseEventTypes[number];
export declare type TouchEventType = typeof touchEventTypes[number];
export declare type KeyEventType = typeof keyEventTypes[number];
