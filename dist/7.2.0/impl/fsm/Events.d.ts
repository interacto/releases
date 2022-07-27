export declare function getTouch(touches: TouchList, idToFind?: number): Touch | undefined;
export declare function isButton(target: EventTarget): target is HTMLButtonElement;
export declare function isCheckBox(target: EventTarget): target is HTMLInputElement;
export declare function isColorChoice(target: EventTarget): target is HTMLInputElement;
export declare function isComboBox(target: EventTarget): target is HTMLSelectElement;
export declare function isDatePicker(target: EventTarget): target is HTMLInputElement;
export declare function isSpinner(target: EventTarget): target is HTMLInputElement;
export declare function isHyperLink(target: EventTarget): target is HTMLAnchorElement;
export declare function isTextInput(target: EventTarget): target is HTMLInputElement | HTMLTextAreaElement;
export declare function isKeyDownEvent(event: Event): event is KeyboardEvent;
export declare function isKeyUpEvent(event: Event): event is KeyboardEvent;
export declare enum KeyCode {
    escape = 27
}
