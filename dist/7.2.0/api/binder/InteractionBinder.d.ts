import type { InteractionData } from "../interaction/InteractionData";
import type { InteractionBinderBuilder } from "./InteractionBinderBuilder";
import type { LogLevel } from "../logging/LogLevel";
import type { Command } from "../command/Command";
import type { InteractionCmdBinder } from "./InteractionCmdBinder";
import type { Interaction } from "../interaction/Interaction";
import type { Widget } from "./BaseBinderBuilder";
import type { AnonCmd } from "../../impl/command/AnonCmd";
import type { WhenType } from "./When";
export interface InteractionBinder<I extends Interaction<D>, D extends InteractionData> extends InteractionBinderBuilder<I, D> {
    when(fn: (i: D) => boolean, mode?: WhenType): InteractionBinder<I, D>;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): InteractionBinder<I, D>;
    onDynamic(node: Widget<Node>): InteractionBinder<I, D>;
    log(...level: ReadonlyArray<LogLevel>): InteractionBinder<I, D>;
    end(fn: () => void): InteractionBinder<I, D>;
    stopImmediatePropagation(): InteractionBinder<I, D>;
    preventDefault(): InteractionBinder<I, D>;
    catch(fn: (ex: unknown) => void): InteractionBinder<I, D>;
    name(name: string): InteractionBinder<I, D>;
    toProduce<C extends Command>(fn: (i: D) => C): InteractionCmdBinder<C, I, D>;
    toProduceAnon(fn: () => void): InteractionCmdBinder<AnonCmd, I, D>;
}
