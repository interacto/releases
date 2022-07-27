import type { WidgetData } from "../../api/interaction/WidgetData";
import type { Interaction } from "../../api/interaction/Interaction";
import type { BaseUpdateBinder } from "../../api/binder/BaseUpdateBinder";
import type { BindingsObserver } from "../../api/binding/BindingsObserver";
import type { EltRef, Widget } from "../../api/binder/BaseBinderBuilder";
import { Undo } from "../command/library/Undo";
import type { Binding } from "../../api/binding/Binding";
import { Redo } from "../command/library/Redo";
import type { PartialAnchorBinder, PartialButtonBinder, PartialInputBinder, PartialKeyBinder, PartialKeysBinder, PartialMultiTouchBinder, PartialPointBinder, PartialPointsBinder, PartialPointSrcTgtBinder, PartialScrollBinder, PartialSelectBinder, PartialSpinnerBinder, PartialTapBinder, PartialTextInputBinder, PartialTouchBinder, PartialTouchSrcTgtBinder, PartialUpdatePointBinder, PartialWheelBinder } from "../../api/binding/Bindings";
import { Bindings } from "../../api/binding/Bindings";
import type { Logger } from "../../api/logging/Logger";
import type { UndoHistoryBase } from "../../api/undo/UndoHistoryBase";
export declare class BindingsImpl<H extends UndoHistoryBase> extends Bindings<H> {
    protected observer: BindingsObserver | undefined;
    protected readonly undoHistoryData: H;
    readonly logger: Logger;
    constructor(history: H, logger?: Logger);
    get undoHistory(): H;
    nodeBinder(): BaseUpdateBinder;
    buttonBinder(): PartialButtonBinder;
    checkboxBinder(): PartialInputBinder;
    colorPickerBinder(): PartialInputBinder;
    comboBoxBinder(): PartialSelectBinder;
    spinnerBinder(): PartialSpinnerBinder;
    dateBinder(): PartialInputBinder;
    hyperlinkBinder(): PartialAnchorBinder;
    textInputBinder(timeout?: number): PartialTextInputBinder;
    touchDnDBinder(cancellable: boolean): PartialTouchSrcTgtBinder;
    reciprocalTouchDnDBinder(handle: EltRef<SVGCircleElement>, spring: EltRef<SVGLineElement>): PartialTouchSrcTgtBinder;
    multiTouchBinder(nbTouches: number): PartialMultiTouchBinder;
    tapBinder(nbTap: number): PartialTapBinder;
    longTouchBinder(duration: number): PartialTouchBinder;
    swipeBinder(horizontal: boolean, minVelocity: number, minLength: number, nbTouches: number, pxTolerance: number): PartialMultiTouchBinder;
    panBinder(horizontal: boolean, minLength: number, nbTouches: number, pxTolerance: number): PartialMultiTouchBinder;
    pinchBinder(pxTolerance: number): PartialMultiTouchBinder;
    clickBinder(): PartialPointBinder;
    dbleClickBinder(): PartialUpdatePointBinder;
    mouseUpBinder(): PartialPointBinder;
    mouseDownBinder(): PartialPointBinder;
    longMouseDownBinder(duration: number): PartialUpdatePointBinder;
    clicksBinder(nbClicks: number): PartialPointsBinder;
    mouseLeaveBinder(withBubbling: boolean): PartialPointBinder;
    mouseEnterBinder(withBubbling: boolean): PartialPointBinder;
    mouseMoveBinder(): PartialPointBinder;
    wheelBinder(): PartialWheelBinder;
    scrollBinder(): PartialScrollBinder;
    dndBinder(cancellable: boolean): PartialPointSrcTgtBinder;
    reciprocalDndBinder(handle: EltRef<SVGCircleElement>, spring: EltRef<SVGLineElement>): PartialPointSrcTgtBinder;
    dragLockBinder(): PartialPointSrcTgtBinder;
    keyUpBinder(modifierAccepted: boolean): PartialKeyBinder;
    keyDownBinder(modifierAccepted: boolean): PartialKeyBinder;
    keysDownBinder(): PartialKeysBinder;
    keysTypeBinder(): PartialKeysBinder;
    keyTypeBinder(): PartialKeyBinder;
    undoRedoBinder(undo: Widget<HTMLButtonElement>, redo: Widget<HTMLButtonElement>, catchFn?: ((err: unknown) => void)): [
        Binding<Undo, Interaction<WidgetData<HTMLButtonElement>>, WidgetData<HTMLButtonElement>>,
        Binding<Redo, Interaction<WidgetData<HTMLButtonElement>>, WidgetData<HTMLButtonElement>>
    ];
    clear(): void;
    setBindingObserver(obs?: BindingsObserver): void;
}
