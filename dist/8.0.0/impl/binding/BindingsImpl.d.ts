import { Bindings } from "../../api/binding/Bindings";
import { Redo } from "../command/library/Redo";
import { Undo } from "../command/library/Undo";
import type { EltRef, Widget } from "../../api/binder/BaseBinderBuilder";
import type { BaseUpdateBinder } from "../../api/binder/BaseUpdateBinder";
import type { Binding } from "../../api/binding/Binding";
import type { PartialAnchorTypedBinder, PartialButtonTypedBinder, PartialInputTypedBinder, PartialKeyTypedBinder, PartialKeysTypedBinder, PartialMultiTouchTypedBinder, PartialPointTypedBinder, PartialPointsTypedBinder, PartialPointSrcTgtTypedBinder, PartialScrollTypedBinder, PartialSelectTypedBinder, PartialSpinnerTypedBinder, PartialTapsTypedBinder, PartialTextInputTypedBinder, PartialTouchTypedBinder, PartialTouchSrcTgtTypedBinder, PartialUpdatePointTypedBinder, PartialWheelTypedBinder, PartialPointOrTouchTypedBinder, PartialTwoTouchTypedBinder, PartialThreeTouchTypedBinder, PartialFourTouchTypedBinder, PartialRotateTypedBinder, PartialTwoPanTypedBinder, PartialScaleTypedBinder, PartialThenBinder, PartialPointsOrTapsTypedBinder, PartialTouchMouseDnDTypedBinder } from "../../api/binding/Bindings";
import type { BindingsObserver } from "../../api/binding/BindingsObserver";
import type { VisitorBinding } from "../../api/binding/VisitorBinding";
import type { LinterRule } from "../../api/checker/Checker";
import type { Interaction } from "../../api/interaction/Interaction";
import type { InteractionData } from "../../api/interaction/InteractionData";
import type { WidgetData } from "../../api/interaction/WidgetData";
import type { Logger } from "../../api/logging/Logger";
import type { UndoHistoryBase } from "../../api/undo/UndoHistoryBase";
export declare class BindingsImpl<H extends UndoHistoryBase> extends Bindings<H> {
    protected observer: BindingsObserver | undefined;
    protected readonly undoHistoryData: H;
    readonly logger: Logger;
    constructor(history: H, logger?: Logger);
    setLinterRules(...rules: ReadonlyArray<LinterRule>): void;
    get undoHistory(): H;
    nodeBinder<A>(accInit?: A): BaseUpdateBinder;
    buttonBinder<A>(accInit?: A): PartialButtonTypedBinder<A>;
    checkboxBinder<A>(accInit?: A): PartialInputTypedBinder<A>;
    colorPickerBinder<A>(accInit?: A): PartialInputTypedBinder<A>;
    comboBoxBinder<A>(accInit?: A): PartialSelectTypedBinder<A>;
    spinnerBinder<A>(accInit?: A): PartialSpinnerTypedBinder<A>;
    dateBinder<A>(accInit?: A): PartialInputTypedBinder<A>;
    hyperlinkBinder<A>(accInit?: A): PartialAnchorTypedBinder<A>;
    textInputBinder<A>(timeout?: number, accInit?: A): PartialTextInputTypedBinder<A>;
    touchDnDBinder<A>(cancellable: boolean, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    touchStartBinder<A>(accInit?: A): PartialTouchTypedBinder<A>;
    reciprocalTouchDnDBinder<A>(handle: EltRef<SVGCircleElement>, spring: EltRef<SVGLineElement>, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    reciprocalMouseOrTouchDnD<A>(handle: EltRef<SVGCircleElement>, spring: EltRef<SVGLineElement>, accInit?: A): PartialTouchMouseDnDTypedBinder<A>;
    multiTouchBinder<A>(nbTouches: number, accInit?: A): PartialMultiTouchTypedBinder<A>;
    twoTouchBinder<A>(accInit?: A): PartialTwoTouchTypedBinder<A>;
    threeTouchBinder<A>(accInit?: A): PartialThreeTouchTypedBinder<A>;
    fourTouchBinder<A>(accInit?: A): PartialFourTouchTypedBinder<A>;
    tapBinder<A>(nbTap: number, accInit?: A): PartialTapsTypedBinder<A>;
    longTouchBinder<A>(duration: number, accInit?: A): PartialTouchTypedBinder<A>;
    panBinder<A>(cancellable: boolean, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    panVerticalBinder<A>(pxTolerance: number, cancellable: boolean, minLength?: number, minVelocity?: number, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    panHorizontalBinder<A>(pxTolerance: number, cancellable: boolean, minLength?: number, minVelocity?: number, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    panLeftBinder<A>(pxTolerance: number, cancellable: boolean, minLength?: number, minVelocity?: number, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    panRightBinder<A>(pxTolerance: number, cancellable: boolean, minLength?: number, minVelocity?: number, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    panTopBinder<A>(pxTolerance: number, cancellable: boolean, minLength?: number, minVelocity?: number, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    panBottomBinder<A>(pxTolerance: number, cancellable: boolean, minLength?: number, minVelocity?: number, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    twoPanVerticalBinder<A>(pxTolerance: number, minLength?: number, minVelocity?: number, accInit?: A): PartialTwoPanTypedBinder<A>;
    twoPanHorizontalBinder<A>(pxTolerance: number, minLength?: number, minVelocity?: number, accInit?: A): PartialTwoPanTypedBinder<A>;
    twoPanLeftBinder<A>(pxTolerance: number, minLength?: number, minVelocity?: number, accInit?: A): PartialTwoPanTypedBinder<A>;
    twoPanRightBinder<A>(pxTolerance: number, minLength?: number, minVelocity?: number, accInit?: A): PartialTwoPanTypedBinder<A>;
    twoPanTopBinder<A>(pxTolerance: number, minLength?: number, minVelocity?: number, accInit?: A): PartialTwoPanTypedBinder<A>;
    twoPanBottomBinder<A>(pxTolerance: number, minLength?: number, minVelocity?: number, accInit?: A): PartialTwoPanTypedBinder<A>;
    rotateBinder<A>(pxTolerance: number, accInit?: A): PartialRotateTypedBinder<A>;
    scaleBinder<A>(pxTolerance: number, accInit?: A): PartialScaleTypedBinder<A>;
    clickBinder<A>(accInit?: A): PartialPointTypedBinder<A>;
    dbleClickBinder<A>(accInit?: A): PartialUpdatePointTypedBinder<A>;
    mouseUpBinder<A>(accInit?: A): PartialPointTypedBinder<A>;
    mouseDownBinder<A>(accInit?: A): PartialPointTypedBinder<A>;
    longMouseDownBinder<A>(duration: number, accInit?: A): PartialUpdatePointTypedBinder<A>;
    clicksBinder<A>(nbClicks: number, accInit?: A): PartialPointsTypedBinder<A>;
    mouseLeaveBinder<A>(withBubbling: boolean, accInit?: A): PartialPointTypedBinder<A>;
    mouseEnterBinder<A>(withBubbling: boolean, accInit?: A): PartialPointTypedBinder<A>;
    mouseMoveBinder<A>(accInit?: A): PartialPointTypedBinder<A>;
    wheelBinder<A>(accInit?: A): PartialWheelTypedBinder<A>;
    scrollBinder<A>(accInit?: A): PartialScrollTypedBinder<A>;
    dndBinder<A>(cancellable: boolean, accInit?: A): PartialPointSrcTgtTypedBinder<A>;
    reciprocalDndBinder<A>(handle: EltRef<SVGCircleElement>, spring: EltRef<SVGLineElement>, accInit?: A): PartialPointSrcTgtTypedBinder<A>;
    dragLockBinder<A>(accInit?: A): PartialPointSrcTgtTypedBinder<A>;
    keyUpBinder<A>(modifierAccepted: boolean, accInit?: A): PartialKeyTypedBinder<A>;
    keyDownBinder<A>(modifierAccepted: boolean, accInit?: A): PartialKeyTypedBinder<A>;
    keysDownBinder<A>(accInit?: A): PartialKeysTypedBinder<A>;
    keysTypeBinder<A>(accInit?: A): PartialKeysTypedBinder<A>;
    keyTypeBinder<A>(accInit?: A): PartialKeyTypedBinder<A>;
    mouseDownOrTouchStartBinder<A>(accInit?: A): PartialPointOrTouchTypedBinder<A>;
    tapsOrClicksBinder<A>(nbTap: number, accInit?: A): PartialPointsOrTapsTypedBinder<A>;
    longpressOrTouchBinder<A>(duration: number, accInit?: A): PartialPointOrTouchTypedBinder<A>;
    combine<IX extends Array<Interaction<InteractionData>>, A>(interactions: IX, accInit?: A): PartialThenBinder<IX, A>;
    undoRedoBinder(undo: Widget<HTMLButtonElement>, redo: Widget<HTMLButtonElement>, catchFn?: ((err: unknown) => void)): [
        Binding<Undo, Interaction<WidgetData<HTMLButtonElement>>, unknown>,
        Binding<Redo, Interaction<WidgetData<HTMLButtonElement>>, unknown>
    ];
    clear(): void;
    setBindingObserver(obs?: BindingsObserver): void;
    acceptVisitor(visitor: VisitorBinding): void;
}