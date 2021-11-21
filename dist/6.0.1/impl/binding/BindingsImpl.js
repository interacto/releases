import { ButtonPressed } from "../interaction/library/ButtonPressed";
import { UpdateBinder } from "../binder/UpdateBinder";
import { BoxChecked } from "../interaction/library/BoxChecked";
import { ColorPicked } from "../interaction/library/ColorPicked";
import { ComboBoxSelected } from "../interaction/library/ComboBoxSelected";
import { SpinnerChanged } from "../interaction/library/SpinnerChanged";
import { DatePicked } from "../interaction/library/DatePicked";
import { TextInputChanged } from "../interaction/library/TextInputChanged";
import { MultiTouch } from "../interaction/library/MultiTouch";
import { Tap } from "../interaction/library/Tap";
import { LongTouch } from "../interaction/library/LongTouch";
import { Click } from "../interaction/library/Click";
import { MouseDown } from "../interaction/library/MouseDown";
import { DnD } from "../interaction/library/DnD";
import { DoubleClick } from "../interaction/library/DoubleClick";
import { DragLock } from "../interaction/library/DragLock";
import { HyperLinkClicked } from "../interaction/library/HyperLinkClicked";
import { KeyDown } from "../interaction/library/KeyDown";
import { KeysDown } from "../interaction/library/KeysDown";
import { KeysTyped } from "../interaction/library/KeysTyped";
import { KeyTyped } from "../interaction/library/KeyTyped";
import { Scroll } from "../interaction/library/Scroll";
import { KeysBinder } from "../binder/KeysBinder";
import { TouchDnD } from "../interaction/library/TouchDnD";
import { LongMouseDown } from "../interaction/library/LongMouseDown";
import { Clicks } from "../interaction/library/Clicks";
import { MouseLeave } from "../interaction/library/MouseLeave";
import { MouseEnter } from "../interaction/library/MouseEnter";
import { MouseMove } from "../interaction/library/MouseMove";
import { Undo } from "../command/library/Undo";
import { Redo } from "../command/library/Redo";
import { Bindings } from "../../api/binding/Bindings";
import { UndoHistoryImpl } from "../undo/UndoHistoryImpl";
import { LoggerImpl } from "../logging/LoggerImpl";
import { Wheel } from "../interaction/library/Wheel";
import { KeyUp } from "../interaction/library/KeyUp";
import { MouseUp } from "../interaction/library/MouseUp";
import { DwellSpringAnimation } from "../animation/DwellSpringAnimation";
export class BindingsImpl extends Bindings {
    constructor(history, logger) {
        super();
        this.undoHistoryData = history !== null && history !== void 0 ? history : new UndoHistoryImpl();
        this.logger = logger !== null && logger !== void 0 ? logger : new LoggerImpl();
    }
    get undoHistory() {
        return this.undoHistoryData;
    }
    nodeBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer);
    }
    buttonBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new ButtonPressed());
    }
    checkboxBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new BoxChecked());
    }
    colorPickerBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new ColorPicked());
    }
    comboBoxBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new ComboBoxSelected());
    }
    spinnerBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new SpinnerChanged());
    }
    dateBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new DatePicked());
    }
    hyperlinkBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new HyperLinkClicked());
    }
    textInputBinder(timeout) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new TextInputChanged(timeout));
    }
    touchDnDBinder(cancellable) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new TouchDnD(cancellable));
    }
    reciprocalTouchDnDBinder(handle, spring) {
        const anim = new DwellSpringAnimation(handle, spring);
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new TouchDnD(true))
            .on(handle)
            .then((_, i) => {
            anim.process(i);
        })
            .endOrCancel(() => {
            anim.end();
        });
    }
    multiTouchBinder(nbTouches) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new MultiTouch(nbTouches, false));
    }
    tapBinder(nbTap) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new Tap(nbTap));
    }
    longTouchBinder(duration) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new LongTouch(duration));
    }
    swipeBinder(horizontal, minVelocity, minLength, nbTouches, pxTolerance) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new MultiTouch(nbTouches, true))
            .when(i => (horizontal ? i.isHorizontal(pxTolerance) : i.isVertical(pxTolerance)))
            .when(i => (horizontal ? Math.abs(i.touches[0].diffScreenX) >= minLength : Math.abs(i.touches[0].diffScreenY) >= minLength))
            .when(i => i.touches[0].velocity * 1000 >= minVelocity);
    }
    panBinder(horizontal, minLength, nbTouches, pxTolerance) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new MultiTouch(nbTouches, true))
            .when(i => (horizontal ? i.isHorizontal(pxTolerance) : i.isVertical(pxTolerance)))
            .when(i => (horizontal ? Math.abs(i.touches[0].diffScreenX) >= minLength : Math.abs(i.touches[0].diffScreenY) >= minLength));
    }
    pinchBinder(pxTolerance) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new MultiTouch(2, false))
            .when(i => i.pinchFactor(pxTolerance) !== undefined);
    }
    clickBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new Click());
    }
    dbleClickBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new DoubleClick());
    }
    mouseUpBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new MouseUp());
    }
    mouseDownBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new MouseDown());
    }
    longMouseDownBinder(duration) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new LongMouseDown(duration));
    }
    clicksBinder(nbClicks) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new Clicks(nbClicks));
    }
    mouseLeaveBinder(withBubbling) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new MouseLeave(withBubbling));
    }
    mouseEnterBinder(withBubbling) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new MouseEnter(withBubbling));
    }
    mouseMoveBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new MouseMove());
    }
    wheelBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new Wheel());
    }
    scrollBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new Scroll());
    }
    dndBinder(cancellable) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new DnD(cancellable));
    }
    reciprocalDndBinder(handle, spring) {
        const anim = new DwellSpringAnimation(handle, spring);
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new DnD(true))
            .on(handle)
            .then((_, i) => {
            anim.process(i);
        })
            .endOrCancel(() => {
            anim.end();
        });
    }
    dragLockBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new DragLock());
    }
    keyUpBinder(modifierAccepted) {
        return new KeysBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new KeyUp(modifierAccepted));
    }
    keyDownBinder(modifierAccepted) {
        return new KeysBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new KeyDown(modifierAccepted));
    }
    keysDownBinder() {
        return new KeysBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new KeysDown());
    }
    keysTypeBinder() {
        return new KeysBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new KeysTyped());
    }
    keyTypeBinder() {
        return new KeysBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new KeyTyped());
    }
    undoRedoBinder(undo, redo) {
        return [
            this.buttonBinder()
                .on(undo)
                .toProduce(() => new Undo(this.undoHistory))
                .bind(),
            this.buttonBinder()
                .on(redo)
                .toProduce(() => new Redo(this.undoHistory))
                .bind()
        ];
    }
    clear() {
        var _a;
        (_a = this.observer) === null || _a === void 0 ? void 0 : _a.clearObservedBindings();
        this.undoHistory.clear();
    }
    setBindingObserver(obs) {
        var _a;
        (_a = this.observer) === null || _a === void 0 ? void 0 : _a.clearObservedBindings();
        this.observer = obs;
    }
}
