import type { BaseUpdateBinderBuilder } from "./BaseUpdateBinderBuilder";
import type { LogLevel } from "../logging/LogLevel";
import type { Command } from "../command/Command";
import type { InteractionData } from "../interaction/InteractionData";
import type { CmdUpdateBinder } from "./CmdUpdateBinder";
import type { InteractionUpdateBinder } from "./InteractionUpdateBinder";
import type { BaseBinder } from "./BaseBinder";
import type { Interaction } from "../interaction/Interaction";
import type { Widget } from "./BaseBinderBuilder";
import type { AnonCmd } from "../../impl/command/AnonCmd";
import type { WhenType } from "./When";
export interface BaseUpdateBinder extends BaseUpdateBinderBuilder, BaseBinder {
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): BaseUpdateBinder;
    onDynamic(node: Widget<Node>): BaseUpdateBinder;
    when(fn: () => boolean, mode?: WhenType): BaseUpdateBinder;
    end(fn: () => void): BaseUpdateBinder;
    log(...level: ReadonlyArray<LogLevel>): BaseUpdateBinder;
    continuousExecution(): BaseUpdateBinder;
    throttle(timeout: number): BaseUpdateBinder;
    toProduce<C extends Command>(fn: () => C): CmdUpdateBinder<C>;
    toProduceAnon(fn: () => void): CmdUpdateBinder<AnonCmd>;
    usingInteraction<I extends Interaction<D>, D extends InteractionData>(fn: () => I): InteractionUpdateBinder<I, D>;
    stopImmediatePropagation(): BaseUpdateBinder;
    preventDefault(): BaseUpdateBinder;
    catch(fn: (ex: unknown) => void): BaseUpdateBinder;
    name(name: string): BaseUpdateBinder;
}
