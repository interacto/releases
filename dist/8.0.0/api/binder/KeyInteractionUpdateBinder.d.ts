import type { Widget } from "./BaseBinderBuilder";
import type { InteractionUpdateBinderBuilder } from "./InteractionUpdateBinderBuilder";
import type { KeyBinderBuilder } from "./KeyBinderBuilder";
import type { KeyInteractionCmdUpdateBinder } from "./KeyInteractionCmdUpdateBinder";
import type { WhenType } from "./When";
import type { RuleName, Severity } from "../checker/Checker";
import type { Command } from "../command/Command";
import type { Interaction, InteractionDataType } from "../interaction/Interaction";
import type { InteractionData } from "../interaction/InteractionData";
import type { LogLevel } from "../logging/LogLevel";
export interface KeyInteractionUpdateBinder<I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> extends InteractionUpdateBinderBuilder<I, A, D>, KeyBinderBuilder {
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): KeyInteractionUpdateBinder<I, A, D>;
    onDynamic(node: Widget<Node>): KeyInteractionUpdateBinder<I, A, D>;
    log(...level: ReadonlyArray<LogLevel>): KeyInteractionUpdateBinder<I, A, D>;
    when(fn: (i: D, acc: Readonly<A>) => boolean, mode?: WhenType): KeyInteractionUpdateBinder<I, A, D>;
    continuousExecution(): KeyInteractionUpdateBinder<I, A, D>;
    throttle(timeout: number): KeyInteractionUpdateBinder<I, A, D>;
    with(isCode: boolean, ...keysOrCodes: ReadonlyArray<string>): KeyInteractionUpdateBinder<I, A, D>;
    stopImmediatePropagation(): KeyInteractionUpdateBinder<I, A, D>;
    preventDefault(): KeyInteractionUpdateBinder<I, A, D>;
    cancel(fn: (i: D, acc: A) => void): KeyInteractionUpdateBinder<I, A, D>;
    endOrCancel(fn: (i: D, acc: A) => void): KeyInteractionUpdateBinder<I, A, D>;
    catch(fn: (ex: unknown) => void): KeyInteractionUpdateBinder<I, A, D>;
    name(name: string): KeyInteractionUpdateBinder<I, A, D>;
    configureRules(ruleName: RuleName, severity: Severity): KeyInteractionUpdateBinder<I, A, D>;
    toProduce<C extends Command>(fn: (i: D) => C): KeyInteractionCmdUpdateBinder<C, I, A, D>;
    toProduceAnon(fn: () => void): KeyInteractionCmdUpdateBinder<Command, I, A, D>;
}
