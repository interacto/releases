import type { Widget } from "./BaseBinderBuilder";
import type { BaseUpdateBinderBuilder } from "./BaseUpdateBinderBuilder";
import type { InteractionBinderBuilder } from "./InteractionBinderBuilder";
import type { WhenType } from "./When";
import type { RuleName, Severity } from "../checker/Checker";
import type { Interaction, InteractionDataType } from "../interaction/Interaction";
import type { InteractionData } from "../interaction/InteractionData";
import type { LogLevel } from "../logging/LogLevel";
export interface InteractionUpdateBinderBuilder<I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> extends InteractionBinderBuilder<I, A, D>, BaseUpdateBinderBuilder {
    cancel(fn: (i: D, acc: A) => void): InteractionUpdateBinderBuilder<I, A, D>;
    endOrCancel(fn: (i: D, acc: A) => void): InteractionUpdateBinderBuilder<I, A, D>;
    when(fn: (i: D, acc: Readonly<A>) => boolean, mode?: WhenType): InteractionUpdateBinderBuilder<I, A, D>;
    end(fn: () => void): InteractionUpdateBinderBuilder<I, A, D>;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): InteractionUpdateBinderBuilder<I, A, D>;
    onDynamic(node: Widget<Node>): InteractionUpdateBinderBuilder<I, A, D>;
    log(...level: ReadonlyArray<LogLevel>): InteractionUpdateBinderBuilder<I, A, D>;
    stopImmediatePropagation(): InteractionUpdateBinderBuilder<I, A, D>;
    throttle(timeout: number): InteractionUpdateBinderBuilder<I, A, D>;
    continuousExecution(): InteractionUpdateBinderBuilder<I, A, D>;
    preventDefault(): InteractionUpdateBinderBuilder<I, A, D>;
    catch(fn: (ex: unknown) => void): InteractionUpdateBinderBuilder<I, A, D>;
    name(name: string): InteractionUpdateBinderBuilder<I, A, D>;
    configureRules(ruleName: RuleName, severity: Severity): InteractionUpdateBinderBuilder<I, A, D>;
}
