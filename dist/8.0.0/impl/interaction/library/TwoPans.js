import { XTouchDnD } from "./XTouch";
import { InteractionBuilderImpl } from "../InteractionBuilderImpl";
import { TwoPanDataImpl } from "../TwoPanDataImpl";
export function twoHPan(logger, pxTolerance, minLength, minVelocity) {
    return new InteractionBuilderImpl(name => new XTouchDnD(2, logger, new TwoPanDataImpl(), name, undefined, true))
        .firstAndThen(data => data.isHorizontal(pxTolerance))
        .end(data => (minLength === undefined || Math.abs(data.diffScreenX) >= minLength) &&
        (minVelocity === undefined || data.velocity("horiz") >= minVelocity))
        .name(twoHPan.name)
        .build();
}
export function twoVPan(logger, pxTolerance, minLength, minVelocity) {
    return new InteractionBuilderImpl(name => new XTouchDnD(2, logger, new TwoPanDataImpl(), name, undefined, true))
        .firstAndThen(data => data.isVertical(pxTolerance))
        .end(data => (minLength === undefined || Math.abs(data.diffScreenY) >= minLength) &&
        (minVelocity === undefined || data.velocity("horiz") >= minVelocity))
        .name(twoVPan.name)
        .build();
}
export function twoLeftPan(logger, pxTolerance, minLength, minVelocity) {
    return new InteractionBuilderImpl(name => new XTouchDnD(2, logger, new TwoPanDataImpl(), name, undefined, true))
        .firstAndThen(data => data.isLeft(pxTolerance))
        .end(data => (minLength === undefined || Math.abs(data.diffScreenX) >= minLength) &&
        (minVelocity === undefined || data.velocity("horiz") >= minVelocity))
        .name(twoLeftPan.name)
        .build();
}
export function twoRightPan(logger, pxTolerance, minLength, minVelocity) {
    return new InteractionBuilderImpl(name => new XTouchDnD(2, logger, new TwoPanDataImpl(), name, undefined, true))
        .firstAndThen(data => data.isRight(pxTolerance))
        .end(data => (minLength === undefined || Math.abs(data.diffScreenX) >= minLength) &&
        (minVelocity === undefined || data.velocity("horiz") >= minVelocity))
        .name(twoRightPan.name)
        .build();
}
export function twoTopPan(logger, pxTolerance, minLength, minVelocity) {
    return new InteractionBuilderImpl(name => new XTouchDnD(2, logger, new TwoPanDataImpl(), name, undefined, true))
        .firstAndThen(data => data.isTop(pxTolerance))
        .end(data => (minLength === undefined || Math.abs(data.diffScreenY) >= minLength) &&
        (minVelocity === undefined || data.velocity("horiz") >= minVelocity))
        .name(twoTopPan.name)
        .build();
}
export function twoBottomPan(logger, pxTolerance, minLength, minVelocity) {
    return new InteractionBuilderImpl(name => new XTouchDnD(2, logger, new TwoPanDataImpl(), name, undefined, true))
        .firstAndThen(data => data.isBottom(pxTolerance))
        .end(data => (minLength === undefined || Math.abs(data.diffScreenY) >= minLength) &&
        (minVelocity === undefined || data.velocity("horiz") >= minVelocity))
        .name(twoBottomPan.name)
        .build();
}
