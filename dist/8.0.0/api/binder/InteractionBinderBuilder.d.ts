import type { BaseBinderBuilder, Widget } from "./BaseBinderBuilder";
import type { WhenType } from "./When";
import type { RuleName, Severity } from "../checker/Checker";
import type { Interaction, InteractionDataType } from "../interaction/Interaction";
import type { InteractionData } from "../interaction/InteractionData";
import type { LogLevel } from "../logging/LogLevel";
export interface InteractionBinderBuilder<I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> extends BaseBinderBuilder {
    when(fn: (i: D, acc: Readonly<A>) => boolean, mode?: WhenType): InteractionBinderBuilder<I, A, D>;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): InteractionBinderBuilder<I, A, D>;
    onDynamic(node: Widget<Node>): InteractionBinderBuilder<I, A, D>;
    end(fn: () => void): InteractionBinderBuilder<I, A, D>;
    log(...level: ReadonlyArray<LogLevel>): InteractionBinderBuilder<I, A, D>;
    stopImmediatePropagation(): InteractionBinderBuilder<I, A, D>;
    preventDefault(): InteractionBinderBuilder<I, A, D>;
    catch(fn: (ex: unknown) => void): InteractionBinderBuilder<I, A, D>;
    name(name: string): InteractionBinderBuilder<I, A, D>;
    configureRules(ruleName: RuleName, severity: Severity): InteractionBinderBuilder<I, A, D>;
}
