import type { InteractionData } from "../interaction/InteractionData";
import type { KeyInteractionBinderBuilder } from "./KeyInteractionBinderBuilder";
import type { LogLevel } from "../logging/LogLevel";
import type { Command } from "../command/Command";
import type { KeyInteractionCmdBinder } from "./KeyInteractionCmdBinder";
import type { Interaction } from "../interaction/Interaction";
import type { Widget } from "./BaseBinderBuilder";
import type { AnonCmd } from "../../impl/command/AnonCmd";
import type { WhenType } from "./When";
export interface KeyInteractionBinder<I extends Interaction<D>, D extends InteractionData> extends KeyInteractionBinderBuilder<I, D> {
    when(fn: (i: D) => boolean, mode?: WhenType): KeyInteractionBinder<I, D>;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): KeyInteractionBinder<I, D>;
    onDynamic(node: Widget<Node>): KeyInteractionBinder<I, D>;
    log(...level: ReadonlyArray<LogLevel>): KeyInteractionBinder<I, D>;
    end(fn: () => void): KeyInteractionBinder<I, D>;
    with(isCode: boolean, ...keysOrCodes: ReadonlyArray<string>): KeyInteractionBinder<I, D>;
    stopImmediatePropagation(): KeyInteractionBinder<I, D>;
    preventDefault(): KeyInteractionBinder<I, D>;
    catch(fn: (ex: unknown) => void): KeyInteractionBinder<I, D>;
    name(name: string): KeyInteractionBinder<I, D>;
    toProduce<C extends Command>(fn: (i: D) => C): KeyInteractionCmdBinder<C, I, D>;
    toProduceAnon(fn: () => void): KeyInteractionCmdBinder<AnonCmd, I, D>;
}
