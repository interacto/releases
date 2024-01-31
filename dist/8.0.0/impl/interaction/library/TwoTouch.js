import { XTouchDnD } from "./XTouch";
import { InteractionBuilderImpl } from "../InteractionBuilderImpl";
import { RotationTouchDataImpl } from "../RotationTouchDataImpl";
import { ScaleTouchDataImpl } from "../ScaleTouchDataImpl";
export function rotate(logger, pxTolerance) {
    return new InteractionBuilderImpl(name => new XTouchDnD(2, logger, new RotationTouchDataImpl(), name, undefined, true))
        .then(data => data.touch1.diffClientX < pxTolerance && data.touch1.diffClientY < pxTolerance)
        .name(rotate.name)
        .build();
}
export function scale(logger, pxTolerance) {
    return new InteractionBuilderImpl(name => new XTouchDnD(2, logger, new ScaleTouchDataImpl(), name, undefined, true))
        .then(data => data.scalingRatio(pxTolerance) !== 0)
        .name(scale.name)
        .build();
}
