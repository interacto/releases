import type { InteractionData } from "../interaction/InteractionData";
import type { BaseBinderBuilder, Widget } from "./BaseBinderBuilder";
import type { LogLevel } from "../logging/LogLevel";
import type { Interaction } from "../interaction/Interaction";
import type { WhenType } from "./When";
export interface InteractionBinderBuilder<I extends Interaction<D>, D extends InteractionData> extends BaseBinderBuilder {
    when(fn: (i: D) => boolean, mode?: WhenType): InteractionBinderBuilder<I, D>;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): InteractionBinderBuilder<I, D>;
    onDynamic(node: Widget<Node>): InteractionBinderBuilder<I, D>;
    end(fn: () => void): InteractionBinderBuilder<I, D>;
    log(...level: ReadonlyArray<LogLevel>): InteractionBinderBuilder<I, D>;
    stopImmediatePropagation(): InteractionBinderBuilder<I, D>;
    preventDefault(): InteractionBinderBuilder<I, D>;
    catch(fn: (ex: unknown) => void): InteractionBinderBuilder<I, D>;
    name(name: string): InteractionBinderBuilder<I, D>;
}
