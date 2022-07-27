import type { InteractionData } from "../interaction/InteractionData";
import type { InteractionBinderBuilder } from "./InteractionBinderBuilder";
import type { LogLevel } from "../logging/LogLevel";
import type { Interaction } from "../interaction/Interaction";
import type { Widget } from "./BaseBinderBuilder";
import type { BaseUpdateBinderBuilder } from "./BaseUpdateBinderBuilder";
import type { WhenType } from "./When";
export interface InteractionUpdateBinderBuilder<I extends Interaction<D>, D extends InteractionData> extends InteractionBinderBuilder<I, D>, BaseUpdateBinderBuilder {
    cancel(fn: (i: D) => void): InteractionUpdateBinderBuilder<I, D>;
    endOrCancel(fn: (i: D) => void): InteractionUpdateBinderBuilder<I, D>;
    when(fn: (i: D) => boolean, mode?: WhenType): InteractionUpdateBinderBuilder<I, D>;
    end(fn: () => void): InteractionUpdateBinderBuilder<I, D>;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): InteractionUpdateBinderBuilder<I, D>;
    onDynamic(node: Widget<Node>): InteractionUpdateBinderBuilder<I, D>;
    log(...level: ReadonlyArray<LogLevel>): InteractionUpdateBinderBuilder<I, D>;
    stopImmediatePropagation(): InteractionUpdateBinderBuilder<I, D>;
    throttle(timeout: number): InteractionUpdateBinderBuilder<I, D>;
    continuousExecution(): InteractionUpdateBinderBuilder<I, D>;
    preventDefault(): InteractionUpdateBinderBuilder<I, D>;
    catch(fn: (ex: unknown) => void): InteractionUpdateBinderBuilder<I, D>;
    name(name: string): InteractionUpdateBinderBuilder<I, D>;
}
