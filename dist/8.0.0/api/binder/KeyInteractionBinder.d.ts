import type { Widget } from "./BaseBinderBuilder";
import type { KeyInteractionBinderBuilder } from "./KeyInteractionBinderBuilder";
import type { KeyInteractionCmdBinder } from "./KeyInteractionCmdBinder";
import type { WhenType } from "./When";
import type { RuleName, Severity } from "../checker/Checker";
import type { Command } from "../command/Command";
import type { Interaction, InteractionDataType } from "../interaction/Interaction";
import type { InteractionData } from "../interaction/InteractionData";
import type { LogLevel } from "../logging/LogLevel";
export interface KeyInteractionBinder<I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> extends KeyInteractionBinderBuilder<I, A, D> {
    when(fn: (i: D, acc: Readonly<A>) => boolean, mode?: WhenType): KeyInteractionBinder<I, A, D>;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): KeyInteractionBinder<I, A, D>;
    onDynamic(node: Widget<Node>): KeyInteractionBinder<I, A, D>;
    log(...level: ReadonlyArray<LogLevel>): KeyInteractionBinder<I, A, D>;
    end(fn: () => void): KeyInteractionBinder<I, A, D>;
    with(isCode: boolean, ...keysOrCodes: ReadonlyArray<string>): KeyInteractionBinder<I, A, D>;
    stopImmediatePropagation(): KeyInteractionBinder<I, A, D>;
    preventDefault(): KeyInteractionBinder<I, A, D>;
    catch(fn: (ex: unknown) => void): KeyInteractionBinder<I, A, D>;
    name(name: string): KeyInteractionBinder<I, A, D>;
    configureRules(ruleName: RuleName, severity: Severity): KeyInteractionBinder<I, A, D>;
    toProduce<C extends Command>(fn: (i: D) => C): KeyInteractionCmdBinder<C, I, A, D>;
    toProduceAnon(fn: () => void): KeyInteractionCmdBinder<Command, I, A, D>;
}
