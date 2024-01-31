import type { Widget } from "./BaseBinderBuilder";
import type { CmdBinderBuilder } from "./CmdBinderBuilder";
import type { InteractionBinderBuilder } from "./InteractionBinderBuilder";
import type { WhenType } from "./When";
import type { Binding } from "../binding/Binding";
import type { RuleName, Severity } from "../checker/Checker";
import type { Command } from "../command/Command";
import type { Interaction, InteractionDataType } from "../interaction/Interaction";
import type { InteractionData } from "../interaction/InteractionData";
import type { LogLevel } from "../logging/LogLevel";
export interface InteractionCmdBinder<C extends Command, I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> extends CmdBinderBuilder<C>, InteractionBinderBuilder<I, A, D> {
    first(fn: (c: C, i: D, acc: A) => void): InteractionCmdBinder<C, I, A, D>;
    ifHadEffects(fn: (c: C, i: D, acc: A) => void): InteractionCmdBinder<C, I, A, D>;
    ifHadNoEffect(fn: (c: C, i: D, acc: A) => void): InteractionCmdBinder<C, I, A, D>;
    ifCannotExecute(fn: (c: C, i: D, acc: A) => void): InteractionCmdBinder<C, I, A, D>;
    end(fn: (c: C, i: D, acc: A) => void): InteractionCmdBinder<C, I, A, D>;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): InteractionCmdBinder<C, I, A, D>;
    onDynamic(node: Widget<Node>): InteractionCmdBinder<C, I, A, D>;
    log(...level: ReadonlyArray<LogLevel>): InteractionCmdBinder<C, I, A, D>;
    when(fn: (i: D, acc: Readonly<A>) => boolean, mode?: WhenType): InteractionCmdBinder<C, I, A, D>;
    stopImmediatePropagation(): InteractionCmdBinder<C, I, A, D>;
    preventDefault(): InteractionCmdBinder<C, I, A, D>;
    catch(fn: (ex: unknown) => void): InteractionCmdBinder<C, I, A, D>;
    name(name: string): InteractionCmdBinder<C, I, A, D>;
    configureRules(ruleName: RuleName, severity: Severity): InteractionCmdBinder<C, I, A, D>;
    bind(): Binding<C, I, A, D>;
}
