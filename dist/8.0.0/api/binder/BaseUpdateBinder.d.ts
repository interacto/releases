import type { BaseBinder } from "./BaseBinder";
import type { Widget } from "./BaseBinderBuilder";
import type { BaseUpdateBinderBuilder } from "./BaseUpdateBinderBuilder";
import type { CmdUpdateBinder } from "./CmdUpdateBinder";
import type { InteractionUpdateBinder } from "./InteractionUpdateBinder";
import type { WhenType } from "./When";
import type { RuleName, Severity } from "../checker/Checker";
import type { Command } from "../command/Command";
import type { Interaction, InteractionDataType } from "../interaction/Interaction";
import type { InteractionData } from "../interaction/InteractionData";
import type { LogLevel } from "../logging/LogLevel";
export interface BaseUpdateBinder extends BaseUpdateBinderBuilder, BaseBinder {
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): BaseUpdateBinder;
    onDynamic(node: Widget<Node>): BaseUpdateBinder;
    when(fn: () => boolean, mode?: WhenType): BaseUpdateBinder;
    end(fn: () => void): BaseUpdateBinder;
    log(...level: ReadonlyArray<LogLevel>): BaseUpdateBinder;
    continuousExecution(): BaseUpdateBinder;
    throttle(timeout: number): BaseUpdateBinder;
    toProduce<C extends Command>(fn: () => C): CmdUpdateBinder<C>;
    toProduceAnon(fn: () => void): CmdUpdateBinder<Command>;
    usingInteraction<I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>>(fn: () => I): InteractionUpdateBinder<I, A, D>;
    stopImmediatePropagation(): BaseUpdateBinder;
    preventDefault(): BaseUpdateBinder;
    catch(fn: (ex: unknown) => void): BaseUpdateBinder;
    name(name: string): BaseUpdateBinder;
    configureRules(ruleName: RuleName, severity: Severity): BaseUpdateBinder;
}
