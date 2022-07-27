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
import { LoggerImpl } from "../logging/LoggerImpl";
import { Wheel } from "../interaction/library/Wheel";
import { KeyUp } from "../interaction/library/KeyUp";
import { MouseUp } from "../interaction/library/MouseUp";
import { DwellSpringAnimation } from "../animation/DwellSpringAnimation";
export class BindingsImpl extends Bindings {
    constructor(history, logger) {
        super();
        this.undoHistoryData = history;
        this.logger = logger ?? new LoggerImpl();
    }
    get undoHistory() {
        return this.undoHistoryData;
    }
    nodeBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer);
    }
    buttonBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new ButtonPressed(this.logger));
    }
    checkboxBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new BoxChecked(this.logger));
    }
    colorPickerBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new ColorPicked(this.logger));
    }
    comboBoxBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new ComboBoxSelected(this.logger));
    }
    spinnerBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new SpinnerChanged(this.logger));
    }
    dateBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new DatePicked(this.logger));
    }
    hyperlinkBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new HyperLinkClicked(this.logger));
    }
    textInputBinder(timeout) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new TextInputChanged(this.logger, timeout));
    }
    touchDnDBinder(cancellable) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new TouchDnD(this.logger, cancellable));
    }
    reciprocalTouchDnDBinder(handle, spring) {
        const anim = new DwellSpringAnimation(handle, spring);
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new TouchDnD(this.logger, true))
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
            .usingInteraction(() => new MultiTouch(nbTouches, false, this.logger));
    }
    tapBinder(nbTap) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new Tap(nbTap, this.logger));
    }
    longTouchBinder(duration) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new LongTouch(duration, this.logger));
    }
    swipeBinder(horizontal, minVelocity, minLength, nbTouches, pxTolerance) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new MultiTouch(nbTouches, true, this.logger))
            .when(i => (horizontal ? i.isHorizontal(pxTolerance) : i.isVertical(pxTolerance)))
            .when(i => (horizontal ? Math.abs(i.touches[0].diffScreenX) >= minLength : Math.abs(i.touches[0].diffScreenY) >= minLength))
            .when(i => i.touches[0].velocity * 1000 >= minVelocity);
    }
    panBinder(horizontal, minLength, nbTouches, pxTolerance) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new MultiTouch(nbTouches, true, this.logger))
            .when(i => (horizontal ? i.isHorizontal(pxTolerance) : i.isVertical(pxTolerance)))
            .when(i => (horizontal ? Math.abs(i.touches[0].diffScreenX) >= minLength : Math.abs(i.touches[0].diffScreenY) >= minLength));
    }
    pinchBinder(pxTolerance) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new MultiTouch(2, false, this.logger))
            .when(i => i.pinchFactor(pxTolerance) !== undefined);
    }
    clickBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new Click(this.logger));
    }
    dbleClickBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new DoubleClick(this.logger));
    }
    mouseUpBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new MouseUp(this.logger));
    }
    mouseDownBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new MouseDown(this.logger));
    }
    longMouseDownBinder(duration) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new LongMouseDown(duration, this.logger));
    }
    clicksBinder(nbClicks) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new Clicks(nbClicks, this.logger));
    }
    mouseLeaveBinder(withBubbling) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new MouseLeave(withBubbling, this.logger));
    }
    mouseEnterBinder(withBubbling) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new MouseEnter(withBubbling, this.logger));
    }
    mouseMoveBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new MouseMove(this.logger));
    }
    wheelBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new Wheel(this.logger));
    }
    scrollBinder() {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new Scroll(this.logger));
    }
    dndBinder(cancellable) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new DnD(cancellable, this.logger));
    }
    reciprocalDndBinder(handle, spring) {
        const anim = new DwellSpringAnimation(handle, spring);
        return new UpdateBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new DnD(true, this.logger))
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
            .usingInteraction(() => new DragLock(this.logger));
    }
    keyUpBinder(modifierAccepted) {
        return new KeysBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new KeyUp(this.logger, modifierAccepted));
    }
    keyDownBinder(modifierAccepted) {
        return new KeysBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new KeyDown(this.logger, modifierAccepted));
    }
    keysDownBinder() {
        return new KeysBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new KeysDown(this.logger));
    }
    keysTypeBinder() {
        return new KeysBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new KeysTyped(this.logger));
    }
    keyTypeBinder() {
        return new KeysBinder(this.undoHistory, this.logger, this.observer)
            .usingInteraction(() => new KeyTyped(this.logger));
    }
    undoRedoBinder(undo, redo, catchFn = (() => { })) {
        return [
            this.buttonBinder()
                .on(undo)
                .toProduce(() => new Undo(this.undoHistory))
                .catch(catchFn)
                .bind(),
            this.buttonBinder()
                .on(redo)
                .toProduce(() => new Redo(this.undoHistory))
                .catch(catchFn)
                .bind()
        ];
    }
    clear() {
        this.observer?.clearObservedBindings();
        this.undoHistory.clear();
    }
    setBindingObserver(obs) {
        this.observer?.clearObservedBindings();
        this.observer = obs;
    }
}
