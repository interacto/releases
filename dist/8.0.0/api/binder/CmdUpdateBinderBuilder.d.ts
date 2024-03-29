import type { Widget } from "./BaseBinderBuilder";
import type { BaseUpdateBinderBuilder } from "./BaseUpdateBinderBuilder";
import type { CmdBinderBuilder } from "./CmdBinderBuilder";
import type { WhenType } from "./When";
import type { RuleName, Severity } from "../checker/Checker";
import type { Command } from "../command/Command";
import type { LogLevel } from "../logging/LogLevel";
export interface CmdUpdateBinderBuilder<C extends Command> extends CmdBinderBuilder<C>, BaseUpdateBinderBuilder {
    then(fn: (c: C) => void): CmdUpdateBinderBuilder<C>;
    continuousExecution(): CmdUpdateBinderBuilder<C>;
    throttle(timeout: number): CmdUpdateBinderBuilder<C>;
    first(fn: (c: C) => void): CmdUpdateBinderBuilder<C>;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): CmdUpdateBinderBuilder<C>;
    onDynamic(node: Widget<Node>): CmdUpdateBinderBuilder<C>;
    end(fn: (c: C) => void): CmdUpdateBinderBuilder<C>;
    when(fn: () => boolean, mode?: WhenType): CmdUpdateBinderBuilder<C>;
    log(...level: ReadonlyArray<LogLevel>): CmdUpdateBinderBuilder<C>;
    stopImmediatePropagation(): CmdUpdateBinderBuilder<C>;
    preventDefault(): CmdUpdateBinderBuilder<C>;
    catch(fn: (ex: unknown) => void): CmdUpdateBinderBuilder<C>;
    name(name: string): CmdUpdateBinderBuilder<C>;
    configureRules(ruleName: RuleName, severity: Severity): CmdUpdateBinderBuilder<C>;
}
