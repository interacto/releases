import type { Widget } from "./BaseBinderBuilder";
import type { CmdUpdateBinderBuilder } from "./CmdUpdateBinderBuilder";
import type { InteractionCmdUpdateBinder } from "./InteractionCmdUpdateBinder";
import type { WhenType } from "./When";
import type { RuleName, Severity } from "../checker/Checker";
import type { Command } from "../command/Command";
import type { Interaction, InteractionDataType } from "../interaction/Interaction";
import type { InteractionData } from "../interaction/InteractionData";
import type { LogLevel } from "../logging/LogLevel";
export interface CmdUpdateBinder<C extends Command> extends CmdUpdateBinderBuilder<C> {
    then(fn: (c: C) => void): CmdUpdateBinder<C>;
    continuousExecution(): CmdUpdateBinder<C>;
    throttle(timeout: number): CmdUpdateBinder<C>;
    first(fn: (c: C) => void): CmdUpdateBinder<C>;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): CmdUpdateBinder<C>;
    onDynamic(node: Widget<Node>): CmdUpdateBinder<C>;
    when(fn: () => boolean, mode?: WhenType): CmdUpdateBinder<C>;
    log(...level: ReadonlyArray<LogLevel>): CmdUpdateBinder<C>;
    end(fn: (c: C) => void): CmdUpdateBinder<C>;
    usingInteraction<I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>>(fn: () => I): InteractionCmdUpdateBinder<C, I, A, D>;
    stopImmediatePropagation(): CmdUpdateBinder<C>;
    preventDefault(): CmdUpdateBinder<C>;
    catch(fn: (ex: unknown) => void): CmdUpdateBinder<C>;
    name(name: string): CmdUpdateBinder<C>;
    configureRules(ruleName: RuleName, severity: Severity): CmdUpdateBinder<C>;
}
