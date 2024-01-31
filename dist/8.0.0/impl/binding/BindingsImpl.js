import { Bindings } from "../../api/binding/Bindings";
import { DwellSpringAnimation } from "../animation/DwellSpringAnimation";
import { KeysBinder } from "../binder/KeysBinder";
import { UpdateBinder } from "../binder/UpdateBinder";
import { Redo } from "../command/library/Redo";
import { Undo } from "../command/library/Undo";
import { BoxChecked } from "../interaction/library/BoxChecked";
import { ButtonPressed } from "../interaction/library/ButtonPressed";
import { Click } from "../interaction/library/Click";
import { Clicks } from "../interaction/library/Clicks";
import { ColorPicked } from "../interaction/library/ColorPicked";
import { ComboBoxSelected } from "../interaction/library/ComboBoxSelected";
import { DatePicked } from "../interaction/library/DatePicked";
import { DnD } from "../interaction/library/DnD";
import { DoubleClick } from "../interaction/library/DoubleClick";
import { DragLock } from "../interaction/library/DragLock";
import { HyperLinkClicked } from "../interaction/library/HyperLinkClicked";
import { KeyDown } from "../interaction/library/KeyDown";
import { KeysDown } from "../interaction/library/KeysDown";
import { KeysTyped } from "../interaction/library/KeysTyped";
import { KeyTyped } from "../interaction/library/KeyTyped";
import { KeyUp } from "../interaction/library/KeyUp";
import { LongMouseDown } from "../interaction/library/LongMouseDown";
import { LongTouch } from "../interaction/library/LongTouch";
import { MouseDown } from "../interaction/library/MouseDown";
import { MouseEnter } from "../interaction/library/MouseEnter";
import { MouseLeave } from "../interaction/library/MouseLeave";
import { MouseMove } from "../interaction/library/MouseMove";
import { MouseUp } from "../interaction/library/MouseUp";
import { MultiTouch } from "../interaction/library/MultiTouch";
import { bottomPan, hPan, leftPan, rightPan, topPan, vPan } from "../interaction/library/Pans";
import { Scroll } from "../interaction/library/Scroll";
import { SpinnerChanged } from "../interaction/library/SpinnerChanged";
import { Tap } from "../interaction/library/Tap";
import { TextInputChanged } from "../interaction/library/TextInputChanged";
import { TouchDnD } from "../interaction/library/TouchDnD";
import { TouchStart } from "../interaction/library/TouchStart";
import { twoBottomPan, twoHPan, twoLeftPan, twoRightPan, twoTopPan, twoVPan } from "../interaction/library/TwoPans";
import { rotate, scale } from "../interaction/library/TwoTouch";
import { Wheel } from "../interaction/library/Wheel";
import { ThreeTouchDnD, FourTouchDnD, twoTouch } from "../interaction/library/XTouch";
import { Or } from "../interaction/Or";
import { Then } from "../interaction/Then";
import { LoggerImpl } from "../logging/LoggerImpl";
export class BindingsImpl extends Bindings {
    observer;
    undoHistoryData;
    logger;
    constructor(history, logger) {
        super();
        this.undoHistoryData = history;
        this.logger = logger ?? new LoggerImpl();
    }
    setLinterRules(...rules) {
        this.observer?.checker.setLinterRules(...rules);
    }
    get undoHistory() {
        return this.undoHistoryData;
    }
    nodeBinder(accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit);
    }
    buttonBinder(accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new ButtonPressed(this.logger));
    }
    checkboxBinder(accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new BoxChecked(this.logger));
    }
    colorPickerBinder(accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new ColorPicked(this.logger));
    }
    comboBoxBinder(accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new ComboBoxSelected(this.logger));
    }
    spinnerBinder(accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new SpinnerChanged(this.logger));
    }
    dateBinder(accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new DatePicked(this.logger));
    }
    hyperlinkBinder(accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new HyperLinkClicked(this.logger));
    }
    textInputBinder(timeout, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new TextInputChanged(this.logger, timeout));
    }
    touchDnDBinder(cancellable, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new TouchDnD(this.logger, cancellable));
    }
    touchStartBinder(accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new TouchStart(this.logger));
    }
    reciprocalTouchDnDBinder(handle, spring, accInit) {
        const anim = new DwellSpringAnimation(handle, spring);
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new TouchDnD(this.logger, true))
            .on(handle)
            .then((_c, i) => {
            anim.process(i);
        })
            .endOrCancel(() => {
            anim.end();
        });
    }
    reciprocalMouseOrTouchDnD(handle, spring, accInit) {
        const anim = new DwellSpringAnimation(handle, spring);
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new Or(new TouchDnD(this.logger, true), new DnD(true, this.logger), this.logger))
            .on(handle)
            .then((_c, i) => {
            anim.process(i);
        })
            .endOrCancel(() => {
            anim.end();
        });
    }
    multiTouchBinder(nbTouches, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new MultiTouch(nbTouches, false, this.logger));
    }
    twoTouchBinder(accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(twoTouch(this.logger));
    }
    threeTouchBinder(accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new ThreeTouchDnD(this.logger));
    }
    fourTouchBinder(accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new FourTouchDnD(this.logger));
    }
    tapBinder(nbTap, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new Tap(nbTap, this.logger));
    }
    longTouchBinder(duration, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new LongTouch(duration, this.logger));
    }
    panBinder(cancellable, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new TouchDnD(this.logger, cancellable));
    }
    panVerticalBinder(pxTolerance, cancellable, minLength, minVelocity, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(vPan(this.logger, cancellable, pxTolerance, minLength, minVelocity));
    }
    panHorizontalBinder(pxTolerance, cancellable, minLength, minVelocity, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(hPan(this.logger, cancellable, pxTolerance, minLength, minVelocity));
    }
    panLeftBinder(pxTolerance, cancellable, minLength, minVelocity, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(leftPan(this.logger, cancellable, pxTolerance, minLength, minVelocity));
    }
    panRightBinder(pxTolerance, cancellable, minLength, minVelocity, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(rightPan(this.logger, cancellable, pxTolerance, minLength, minVelocity));
    }
    panTopBinder(pxTolerance, cancellable, minLength, minVelocity, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(topPan(this.logger, cancellable, pxTolerance, minLength, minVelocity));
    }
    panBottomBinder(pxTolerance, cancellable, minLength, minVelocity, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(bottomPan(this.logger, cancellable, pxTolerance, minLength, minVelocity));
    }
    twoPanVerticalBinder(pxTolerance, minLength, minVelocity, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(twoVPan(this.logger, pxTolerance, minLength, minVelocity));
    }
    twoPanHorizontalBinder(pxTolerance, minLength, minVelocity, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(twoHPan(this.logger, pxTolerance, minLength, minVelocity));
    }
    twoPanLeftBinder(pxTolerance, minLength, minVelocity, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(twoLeftPan(this.logger, pxTolerance, minLength, minVelocity));
    }
    twoPanRightBinder(pxTolerance, minLength, minVelocity, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(twoRightPan(this.logger, pxTolerance, minLength, minVelocity));
    }
    twoPanTopBinder(pxTolerance, minLength, minVelocity, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(twoTopPan(this.logger, pxTolerance, minLength, minVelocity));
    }
    twoPanBottomBinder(pxTolerance, minLength, minVelocity, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(twoBottomPan(this.logger, pxTolerance, minLength, minVelocity));
    }
    rotateBinder(pxTolerance, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(rotate(this.logger, pxTolerance));
    }
    scaleBinder(pxTolerance, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(scale(this.logger, pxTolerance));
    }
    clickBinder(accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new Click(this.logger));
    }
    dbleClickBinder(accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new DoubleClick(this.logger));
    }
    mouseUpBinder(accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new MouseUp(this.logger));
    }
    mouseDownBinder(accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new MouseDown(this.logger));
    }
    longMouseDownBinder(duration, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new LongMouseDown(duration, this.logger));
    }
    clicksBinder(nbClicks, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new Clicks(nbClicks, this.logger));
    }
    mouseLeaveBinder(withBubbling, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new MouseLeave(withBubbling, this.logger));
    }
    mouseEnterBinder(withBubbling, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new MouseEnter(withBubbling, this.logger));
    }
    mouseMoveBinder(accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new MouseMove(this.logger));
    }
    wheelBinder(accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new Wheel(this.logger));
    }
    scrollBinder(accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new Scroll(this.logger));
    }
    dndBinder(cancellable, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new DnD(cancellable, this.logger));
    }
    reciprocalDndBinder(handle, spring, accInit) {
        const anim = new DwellSpringAnimation(handle, spring);
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new DnD(true, this.logger))
            .on(handle)
            .then((_c, i) => {
            anim.process(i);
        })
            .endOrCancel(() => {
            anim.end();
        });
    }
    dragLockBinder(accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new DragLock(this.logger));
    }
    keyUpBinder(modifierAccepted, accInit) {
        return new KeysBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new KeyUp(this.logger, modifierAccepted));
    }
    keyDownBinder(modifierAccepted, accInit) {
        return new KeysBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new KeyDown(this.logger, modifierAccepted));
    }
    keysDownBinder(accInit) {
        return new KeysBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new KeysDown(this.logger));
    }
    keysTypeBinder(accInit) {
        return new KeysBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new KeysTyped(this.logger));
    }
    keyTypeBinder(accInit) {
        return new KeysBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new KeyTyped(this.logger));
    }
    mouseDownOrTouchStartBinder(accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new Or(new MouseDown(this.logger), new TouchStart(this.logger), this.logger));
    }
    tapsOrClicksBinder(nbTap, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new Or(new Tap(nbTap, this.logger), new Clicks(nbTap, this.logger), this.logger));
    }
    longpressOrTouchBinder(duration, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new Or(new LongMouseDown(duration, this.logger), new LongTouch(duration, this.logger), this.logger));
    }
    combine(interactions, accInit) {
        return new UpdateBinder(this.undoHistory, this.logger, this.observer, undefined, accInit)
            .usingInteraction(() => new Then(interactions, this.logger));
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
    acceptVisitor(visitor) {
        visitor.visitBindings(this);
    }
}
