import type { Command } from "../command/Command";
import type { InteractionData } from "../interaction/InteractionData";
import type { CmdBinderBuilder } from "./CmdBinderBuilder";
import type { InteractionBinderBuilder } from "./InteractionBinderBuilder";
import type { LogLevel } from "../logging/LogLevel";
import type { Binding } from "../binding/Binding";
import type { Interaction } from "../interaction/Interaction";
import type { Widget } from "./BaseBinderBuilder";
import type { WhenType } from "./When";
export interface InteractionCmdBinder<C extends Command, I extends Interaction<D>, D extends InteractionData> extends CmdBinderBuilder<C>, InteractionBinderBuilder<I, D> {
    first(fn: (c: C, i: D) => void): InteractionCmdBinder<C, I, D>;
    ifHadEffects(fn: (c: C, i: D) => void): InteractionCmdBinder<C, I, D>;
    ifHadNoEffect(fn: (c: C, i: D) => void): InteractionCmdBinder<C, I, D>;
    ifCannotExecute(fn: (c: C, i: D) => void): InteractionCmdBinder<C, I, D>;
    end(fn: (c: C, i: D) => void): InteractionCmdBinder<C, I, D>;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): InteractionCmdBinder<C, I, D>;
    onDynamic(node: Widget<Node>): InteractionCmdBinder<C, I, D>;
    log(...level: ReadonlyArray<LogLevel>): InteractionCmdBinder<C, I, D>;
    when(fn: (i: D) => boolean, mode?: WhenType): InteractionCmdBinder<C, I, D>;
    stopImmediatePropagation(): InteractionCmdBinder<C, I, D>;
    preventDefault(): InteractionCmdBinder<C, I, D>;
    catch(fn: (ex: unknown) => void): InteractionCmdBinder<C, I, D>;
    name(name: string): InteractionCmdBinder<C, I, D>;
    bind(): Binding<C, I, D>;
}
