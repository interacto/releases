import { TouchDnD } from "./TouchDnD";
import { InteractionBuilderImpl } from "../InteractionBuilderImpl";
export function hPan(logger, cancellable, pxTolerance, minLength, minVelocity) {
    return new InteractionBuilderImpl(name => new TouchDnD(logger, cancellable, undefined, name))
        .firstAndThen(data => data.isHorizontal(pxTolerance))
        .end(data => (minLength === undefined || Math.abs(data.diffScreenX) >= minLength) &&
        (minVelocity === undefined || data.velocity("horiz") >= minVelocity))
        .name(hPan.name)
        .build();
}
export function vPan(logger, cancellable, pxTolerance, minLength, minVelocity) {
    return new InteractionBuilderImpl(name => new TouchDnD(logger, cancellable, undefined, name))
        .firstAndThen(data => data.isVertical(pxTolerance))
        .end(data => (minLength === undefined || Math.abs(data.diffScreenY) >= minLength) &&
        (minVelocity === undefined || data.velocity("vert") >= minVelocity))
        .name(vPan.name)
        .build();
}
export function leftPan(logger, cancellable, pxTolerance, minLength, minVelocity) {
    return new InteractionBuilderImpl(name => new TouchDnD(logger, cancellable, undefined, name))
        .firstAndThen(data => data.isLeft(pxTolerance))
        .end(data => (minLength === undefined || Math.abs(data.diffScreenX) >= minLength) &&
        (minVelocity === undefined || data.velocity("horiz") >= minVelocity))
        .name(leftPan.name)
        .build();
}
export function rightPan(logger, cancellable, pxTolerance, minLength, minVelocity) {
    return new InteractionBuilderImpl(name => new TouchDnD(logger, cancellable, undefined, name))
        .firstAndThen(data => data.isRight(pxTolerance))
        .end(data => (minLength === undefined || Math.abs(data.diffScreenX) >= minLength) &&
        (minVelocity === undefined || data.velocity("horiz") >= minVelocity))
        .name(rightPan.name)
        .build();
}
export function topPan(logger, cancellable, pxTolerance, minLength, minVelocity) {
    return new InteractionBuilderImpl(name => new TouchDnD(logger, cancellable, undefined, name))
        .firstAndThen(data => data.isTop(pxTolerance))
        .end(data => (minLength === undefined || Math.abs(data.diffScreenY) >= minLength) &&
        (minVelocity === undefined || data.velocity("vert") >= minVelocity))
        .name(topPan.name)
        .build();
}
export function bottomPan(logger, cancellable, pxTolerance, minLength, minVelocity) {
    return new InteractionBuilderImpl(name => new TouchDnD(logger, cancellable, undefined, name))
        .firstAndThen(data => data.isBottom(pxTolerance))
        .end(data => (minLength === undefined || Math.abs(data.diffScreenY) >= minLength) &&
        (minVelocity === undefined || data.velocity("vert") >= minVelocity))
        .name(bottomPan.name)
        .build();
}
