import type { Widget } from "./BaseBinderBuilder";
import type { InteractionCmdUpdateBinder } from "./InteractionCmdUpdateBinder";
import type { InteractionUpdateBinderBuilder } from "./InteractionUpdateBinderBuilder";
import type { WhenType } from "./When";
import type { RuleName, Severity } from "../checker/Checker";
import type { Command } from "../command/Command";
import type { Interaction, InteractionDataType } from "../interaction/Interaction";
import type { InteractionData } from "../interaction/InteractionData";
import type { LogLevel } from "../logging/LogLevel";
export interface InteractionUpdateBinder<I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> extends InteractionUpdateBinderBuilder<I, A, D> {
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): InteractionUpdateBinder<I, A, D>;
    onDynamic(node: Widget<Node>): InteractionUpdateBinder<I, A, D>;
    log(...level: ReadonlyArray<LogLevel>): InteractionUpdateBinder<I, A, D>;
    when(fn: (i: D, acc: Readonly<A>) => boolean, mode?: WhenType): InteractionUpdateBinder<I, A, D>;
    end(fn: () => void): InteractionUpdateBinder<I, A, D>;
    cancel(fn: (i: D, acc: A) => void): InteractionUpdateBinder<I, A, D>;
    endOrCancel(fn: (i: D, acc: A) => void): InteractionUpdateBinder<I, A, D>;
    stopImmediatePropagation(): InteractionUpdateBinder<I, A, D>;
    preventDefault(): InteractionUpdateBinder<I, A, D>;
    throttle(timeout: number): InteractionUpdateBinder<I, A, D>;
    continuousExecution(): InteractionUpdateBinder<I, A, D>;
    catch(fn: (ex: unknown) => void): InteractionUpdateBinder<I, A, D>;
    name(name: string): InteractionUpdateBinder<I, A, D>;
    configureRules(ruleName: RuleName, severity: Severity): InteractionUpdateBinder<I, A, D>;
    toProduce<C extends Command>(fn: (i: D) => C): InteractionCmdUpdateBinder<C, I, A, D>;
    toProduceAnon(fn: () => void): InteractionCmdUpdateBinder<Command, I, A, D>;
}
