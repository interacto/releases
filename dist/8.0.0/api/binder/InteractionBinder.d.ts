import type { Widget } from "./BaseBinderBuilder";
import type { InteractionBinderBuilder } from "./InteractionBinderBuilder";
import type { InteractionCmdBinder } from "./InteractionCmdBinder";
import type { WhenType } from "./When";
import type { RuleName, Severity } from "../checker/Checker";
import type { Command } from "../command/Command";
import type { Interaction, InteractionDataType } from "../interaction/Interaction";
import type { InteractionData } from "../interaction/InteractionData";
import type { LogLevel } from "../logging/LogLevel";
export interface InteractionBinder<I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> extends InteractionBinderBuilder<I, A, D> {
    when(fn: (i: D, acc: Readonly<A>) => boolean, mode?: WhenType): InteractionBinder<I, A, D>;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): InteractionBinder<I, A, D>;
    onDynamic(node: Widget<Node>): InteractionBinder<I, A, D>;
    log(...level: ReadonlyArray<LogLevel>): InteractionBinder<I, A, D>;
    end(fn: () => void): InteractionBinder<I, A, D>;
    stopImmediatePropagation(): InteractionBinder<I, A, D>;
    preventDefault(): InteractionBinder<I, A, D>;
    catch(fn: (ex: unknown) => void): InteractionBinder<I, A, D>;
    name(name: string): InteractionBinder<I, A, D>;
    configureRules(ruleName: RuleName, severity: Severity): InteractionBinder<I, A, D>;
    toProduce<C extends Command>(fn: (i: D) => C): InteractionCmdBinder<C, I, A, D>;
    toProduceAnon(fn: () => void): InteractionCmdBinder<Command, I, A, D>;
}
