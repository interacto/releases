import type { Widget } from "./BaseBinderBuilder";
import type { InteractionCmdBinder } from "./InteractionCmdBinder";
import type { KeyInteractionBinderBuilder } from "./KeyInteractionBinderBuilder";
import type { WhenType } from "./When";
import type { Binding } from "../binding/Binding";
import type { RuleName, Severity } from "../checker/Checker";
import type { Command } from "../command/Command";
import type { Interaction, InteractionDataType } from "../interaction/Interaction";
import type { InteractionData } from "../interaction/InteractionData";
import type { LogLevel } from "../logging/LogLevel";
export interface KeyInteractionCmdBinder<C extends Command, I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> extends KeyInteractionBinderBuilder<I, A, D>, InteractionCmdBinder<C, I, A, D> {
    first(fn: (c: C, i: D, acc: A) => void): KeyInteractionCmdBinder<C, I, A, D>;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): KeyInteractionCmdBinder<C, I, A, D>;
    onDynamic(node: Widget<Node>): KeyInteractionCmdBinder<C, I, A, D>;
    log(...level: ReadonlyArray<LogLevel>): KeyInteractionCmdBinder<C, I, A, D>;
    when(fn: (i: D, acc: Readonly<A>) => boolean, mode?: WhenType): KeyInteractionCmdBinder<C, I, A, D>;
    ifHadEffects(fn: (c: C, i: D, acc: A) => void): KeyInteractionCmdBinder<C, I, A, D>;
    ifHadNoEffect(fn: (c: C, i: D, acc: A) => void): KeyInteractionCmdBinder<C, I, A, D>;
    ifCannotExecute(fn: (c: C, i: D, acc: A) => void): KeyInteractionCmdBinder<C, I, A, D>;
    end(fn: (c: C, i: D, acc: A) => void): KeyInteractionCmdBinder<C, I, A, D>;
    with(isCode: boolean, ...keysOrCodes: ReadonlyArray<string>): KeyInteractionCmdBinder<C, I, A, D>;
    stopImmediatePropagation(): KeyInteractionCmdBinder<C, I, A, D>;
    preventDefault(): KeyInteractionCmdBinder<C, I, A, D>;
    catch(fn: (ex: unknown) => void): KeyInteractionCmdBinder<C, I, A, D>;
    name(name: string): KeyInteractionCmdBinder<C, I, A, D>;
    configureRules(ruleName: RuleName, severity: Severity): KeyInteractionCmdBinder<C, I, A, D>;
    bind(): Binding<C, I, A, D>;
}
