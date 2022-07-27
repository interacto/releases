import type { InteractionData } from "../interaction/InteractionData";
import type { LogLevel } from "../logging/LogLevel";
import type { Command } from "../command/Command";
import type { KeyInteractionCmdUpdateBinder } from "./KeyInteractionCmdUpdateBinder";
import type { InteractionUpdateBinderBuilder } from "./InteractionUpdateBinderBuilder";
import type { KeyBinderBuilder } from "./KeyBinderBuilder";
import type { Interaction } from "../interaction/Interaction";
import type { Widget } from "./BaseBinderBuilder";
import type { AnonCmd } from "../../impl/command/AnonCmd";
import type { WhenType } from "./When";
export interface KeyInteractionUpdateBinder<I extends Interaction<D>, D extends InteractionData> extends InteractionUpdateBinderBuilder<I, D>, KeyBinderBuilder {
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): KeyInteractionUpdateBinder<I, D>;
    onDynamic(node: Widget<Node>): KeyInteractionUpdateBinder<I, D>;
    log(...level: ReadonlyArray<LogLevel>): KeyInteractionUpdateBinder<I, D>;
    when(fn: (i: D) => boolean, mode?: WhenType): KeyInteractionUpdateBinder<I, D>;
    continuousExecution(): KeyInteractionUpdateBinder<I, D>;
    throttle(timeout: number): KeyInteractionUpdateBinder<I, D>;
    with(isCode: boolean, ...keysOrCodes: ReadonlyArray<string>): KeyInteractionUpdateBinder<I, D>;
    stopImmediatePropagation(): KeyInteractionUpdateBinder<I, D>;
    preventDefault(): KeyInteractionUpdateBinder<I, D>;
    cancel(fn: (i: D) => void): KeyInteractionUpdateBinder<I, D>;
    endOrCancel(fn: (i: D) => void): KeyInteractionUpdateBinder<I, D>;
    catch(fn: (ex: unknown) => void): KeyInteractionUpdateBinder<I, D>;
    name(name: string): KeyInteractionUpdateBinder<I, D>;
    toProduce<C extends Command>(fn: (i: D) => C): KeyInteractionCmdUpdateBinder<C, I, D>;
    toProduceAnon(fn: () => void): KeyInteractionCmdUpdateBinder<AnonCmd, I, D>;
}
