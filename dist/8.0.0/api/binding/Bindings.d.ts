import type { Binding } from "./Binding";
import type { BindingsObserver } from "./BindingsObserver";
import type { VisitorBinding } from "./VisitorBinding";
import type { EltRef, Widget } from "../binder/BaseBinderBuilder";
import type { BaseUpdateBinder } from "../binder/BaseUpdateBinder";
import type { InteractionBinder } from "../binder/InteractionBinder";
import type { InteractionUpdateBinder } from "../binder/InteractionUpdateBinder";
import type { KeyInteractionBinder } from "../binder/KeyInteractionBinder";
import type { KeyInteractionUpdateBinder } from "../binder/KeyInteractionUpdateBinder";
import type { Command } from "../command/Command";
import type { FourTouchData } from "../interaction/FourTouchData";
import type { Interaction, InteractionsDataTypes } from "../interaction/Interaction";
import type { InteractionData } from "../interaction/InteractionData";
import type { KeyData } from "../interaction/KeyData";
import type { KeysData } from "../interaction/KeysData";
import type { LineTouchData } from "../interaction/LineTouchData";
import type { MousePointsData } from "../interaction/MousePointsData";
import type { MultiTouchData } from "../interaction/MultiTouchData";
import type { PointData } from "../interaction/PointData";
import type { PointsData } from "../interaction/PointsData";
import type { RotationTouchData } from "../interaction/RotationTouchData";
import type { ScaleTouchData } from "../interaction/ScaleTouchData";
import type { ScrollData } from "../interaction/ScrollData";
import type { SrcTgtPointsData } from "../interaction/SrcTgtPointsData";
import type { TapsData } from "../interaction/TapsData";
import type { ThenData } from "../interaction/ThenData";
import type { ThreeTouchData } from "../interaction/ThreeTouchData";
import type { TouchData } from "../interaction/TouchData";
import type { GeneralTwoTouchData, TwoTouchData } from "../interaction/TwoTouchData";
import type { WheelData } from "../interaction/WheelData";
import type { WidgetData } from "../interaction/WidgetData";
import type { Logger } from "../logging/Logger";
import type { UndoHistoryBase } from "../undo/UndoHistoryBase";
export type PartialButtonTypedBinder<A = unknown> = InteractionBinder<Interaction<WidgetData<HTMLButtonElement>>, A>;
export type PartialInputTypedBinder<A = unknown> = InteractionBinder<Interaction<WidgetData<HTMLInputElement>>, A>;
export type PartialSelectTypedBinder<A = unknown> = InteractionBinder<Interaction<WidgetData<HTMLSelectElement>>, A>;
export type PartialSpinnerTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<WidgetData<HTMLInputElement>>, A>;
export type PartialAnchorTypedBinder<A = unknown> = InteractionBinder<Interaction<WidgetData<HTMLAnchorElement>>, A>;
export type PartialTextInputTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<WidgetData<HTMLInputElement | HTMLTextAreaElement>>, A>;
export type PartialRotateTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<RotationTouchData>, A>;
export type PartialScaleTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<ScaleTouchData>, A>;
export type PartialTwoPanTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<LineTouchData & TwoTouchData>, A>;
export type PartialTwoTouchTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<GeneralTwoTouchData>, A>;
export type PartialThreeTouchTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<ThreeTouchData>, A>;
export type PartialFourTouchTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<FourTouchData>, A>;
export type PartialTouchSrcTgtTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<SrcTgtPointsData<TouchData>>, A>;
export type PartialMultiTouchTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<MultiTouchData>, A>;
export type PartialTapsTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<TapsData>, A>;
export type PartialTouchTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<TouchData>, A>;
export type PartialPointTypedBinder<A = unknown> = InteractionBinder<Interaction<PointData>, A>;
export type PartialWheelTypedBinder<A = unknown> = InteractionBinder<Interaction<WheelData>, A>;
export type PartialScrollTypedBinder<A = unknown> = InteractionBinder<Interaction<ScrollData>, A>;
export type PartialUpdatePointTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<PointData>, A>;
export type PartialPointsTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<MousePointsData>, A>;
export type PartialPointSrcTgtTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<SrcTgtPointsData<PointData>>, A>;
export type PartialKeyTypedBinder<A = unknown> = KeyInteractionBinder<Interaction<KeyData>, A>;
export type PartialKeysTypedBinder<A = unknown> = KeyInteractionUpdateBinder<Interaction<KeysData>, A>;
export type PartialPointOrTouchTypedBinder<A = unknown> = InteractionBinder<Interaction<PointData | TouchData>, A>;
export type PartialPointsOrTapsTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<MousePointsData | PointsData<TouchData>>, A>;
export type PartialTouchMouseDnDTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<SrcTgtPointsData<PointData | TouchData>>, A>;
export type PartialThenBinder<XS extends Array<Interaction<InteractionData>>, A = unknown> = InteractionUpdateBinder<Interaction<ThenData<InteractionsDataTypes<XS>>>, A, ThenData<InteractionsDataTypes<XS>>>;
export declare abstract class Bindings<H extends UndoHistoryBase> {
    abstract readonly undoHistory: H;
    abstract readonly logger: Logger;
    abstract nodeBinder<A>(accInit?: A): BaseUpdateBinder;
    abstract buttonBinder<A>(accInit?: A): PartialButtonTypedBinder<A>;
    abstract checkboxBinder<A>(accInit?: A): PartialInputTypedBinder<A>;
    abstract colorPickerBinder<A>(accInit?: A): PartialInputTypedBinder<A>;
    abstract comboBoxBinder<A>(accInit?: A): PartialSelectTypedBinder<A>;
    abstract spinnerBinder<A>(accInit?: A): PartialSpinnerTypedBinder<A>;
    abstract dateBinder<A>(accInit?: A): PartialInputTypedBinder<A>;
    abstract hyperlinkBinder<A>(accInit?: A): PartialAnchorTypedBinder<A>;
    abstract textInputBinder<A>(timeout?: number, accInit?: A): PartialTextInputTypedBinder<A>;
    abstract touchDnDBinder<A>(cancellable: boolean, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    abstract reciprocalTouchDnDBinder<A>(handle: EltRef<SVGCircleElement>, spring: EltRef<SVGLineElement>, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    abstract multiTouchBinder<A>(nbTouches: number, accInit?: A): PartialMultiTouchTypedBinder<A>;
    abstract twoTouchBinder<A>(accInit?: A): PartialTwoTouchTypedBinder<A>;
    abstract threeTouchBinder<A>(accInit?: A): PartialThreeTouchTypedBinder<A>;
    abstract fourTouchBinder<A>(accInit?: A): PartialFourTouchTypedBinder<A>;
    abstract tapBinder<A>(nbTap: number, accInit?: A): PartialTapsTypedBinder<A>;
    abstract touchStartBinder<A>(accInit?: A): PartialTouchTypedBinder<A>;
    abstract longTouchBinder<A>(duration: number, accInit?: A): PartialTouchTypedBinder<A>;
    abstract panBinder<A>(cancellable: boolean, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    abstract panVerticalBinder<A>(pxTolerance: number, cancellable: boolean, minLength?: number, minVelocity?: number, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    abstract panHorizontalBinder<A>(pxTolerance: number, cancellable: boolean, minLength?: number, minVelocity?: number, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    abstract panLeftBinder<A>(pxTolerance: number, cancellable: boolean, minLength?: number, minVelocity?: number, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    abstract panRightBinder<A>(pxTolerance: number, cancellable: boolean, minLength?: number, minVelocity?: number, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    abstract panTopBinder<A>(pxTolerance: number, cancellable: boolean, minLength?: number, minVelocity?: number, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    abstract panBottomBinder<A>(pxTolerance: number, cancellable: boolean, minLength?: number, minVelocity?: number, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    abstract twoPanVerticalBinder<A>(pxTolerance: number, minLength?: number, minVelocity?: number, accInit?: A): PartialTwoPanTypedBinder<A>;
    abstract twoPanHorizontalBinder<A>(pxTolerance: number, minLength?: number, minVelocity?: number, accInit?: A): PartialTwoPanTypedBinder<A>;
    abstract twoPanLeftBinder<A>(pxTolerance: number, minLength?: number, minVelocity?: number, accInit?: A): PartialTwoPanTypedBinder<A>;
    abstract twoPanRightBinder<A>(pxTolerance: number, minLength?: number, minVelocity?: number, accInit?: A): PartialTwoPanTypedBinder<A>;
    abstract twoPanTopBinder<A>(pxTolerance: number, minLength?: number, minVelocity?: number, accInit?: A): PartialTwoPanTypedBinder<A>;
    abstract twoPanBottomBinder<A>(pxTolerance: number, minLength?: number, minVelocity?: number, accInit?: A): PartialTwoPanTypedBinder<A>;
    abstract rotateBinder<A>(pxTolerance: number, accInit?: A): PartialRotateTypedBinder<A>;
    abstract scaleBinder<A>(pxTolerance: number, accInit?: A): PartialScaleTypedBinder<A>;
    abstract clickBinder<A>(accInit?: A): PartialPointTypedBinder<A>;
    abstract wheelBinder<A>(accInit?: A): PartialWheelTypedBinder<A>;
    abstract dbleClickBinder<A>(accInit?: A): PartialUpdatePointTypedBinder<A>;
    abstract mouseDownBinder<A>(accInit?: A): PartialPointTypedBinder<A>;
    abstract mouseUpBinder<A>(accInit?: A): PartialPointTypedBinder<A>;
    abstract longMouseDownBinder<A>(duration: number, accInit?: A): PartialUpdatePointTypedBinder<A>;
    abstract clicksBinder<A>(nbClicks: number, accInit?: A): PartialPointsTypedBinder<A>;
    abstract mouseEnterBinder<A>(withBubbling: boolean, accInit?: A): PartialPointTypedBinder<A>;
    abstract mouseLeaveBinder<A>(withBubbling: boolean, accInit?: A): PartialPointTypedBinder<A>;
    abstract mouseMoveBinder<A>(accInit?: A): PartialPointTypedBinder<A>;
    abstract scrollBinder<A>(accInit?: A): PartialScrollTypedBinder<A>;
    abstract dndBinder<A>(cancellable: boolean, accInit?: A): PartialPointSrcTgtTypedBinder<A>;
    abstract reciprocalDndBinder<A>(handle: EltRef<SVGCircleElement>, spring: EltRef<SVGLineElement>, accInit?: A): PartialPointSrcTgtTypedBinder<A>;
    abstract dragLockBinder<A>(accInit?: A): PartialPointSrcTgtTypedBinder<A>;
    abstract keyDownBinder<A>(modifierAccepted: boolean, accInit?: A): PartialKeyTypedBinder<A>;
    abstract keysDownBinder<A>(accInit?: A): PartialKeysTypedBinder<A>;
    abstract keyUpBinder<A>(modifierAccepted: boolean, accInit?: A): PartialKeyTypedBinder<A>;
    abstract keysTypeBinder<A>(accInit?: A): PartialKeysTypedBinder<A>;
    abstract keyTypeBinder<A>(accInit?: A): PartialKeyTypedBinder<A>;
    abstract mouseDownOrTouchStartBinder<A>(accInit?: A): PartialPointOrTouchTypedBinder<A>;
    abstract tapsOrClicksBinder<A>(nbTap: number, accInit?: A): PartialPointsOrTapsTypedBinder<A>;
    abstract longpressOrTouchBinder<A>(duration: number, accInit?: A): PartialPointOrTouchTypedBinder<A>;
    abstract reciprocalMouseOrTouchDnD<A>(handle: EltRef<SVGCircleElement>, spring: EltRef<SVGLineElement>, accInit?: A): PartialTouchMouseDnDTypedBinder<A>;
    abstract undoRedoBinder(undo: Widget<HTMLButtonElement>, redo: Widget<HTMLButtonElement>, catchFn?: ((err: unknown) => void)): [
        Binding<Command, Interaction<WidgetData<HTMLButtonElement>>, unknown>,
        Binding<Command, Interaction<WidgetData<HTMLButtonElement>>, unknown>
    ];
    abstract combine<XS extends Array<Interaction<InteractionData>>, A>(interactions: XS, accInit?: A): PartialThenBinder<XS, A>;
    abstract clear(): void;
    abstract setBindingObserver(obs?: BindingsObserver): void;
    abstract acceptVisitor(visitor: VisitorBinding): void;
}
