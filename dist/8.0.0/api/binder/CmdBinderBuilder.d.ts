import type { BaseBinderBuilder, Widget } from "./BaseBinderBuilder";
import type { WhenType } from "./When";
import type { RuleName, Severity } from "../checker/Checker";
import type { Command } from "../command/Command";
import type { LogLevel } from "../logging/LogLevel";
export interface CmdBinderBuilder<C extends Command> extends BaseBinderBuilder {
    first(fn: (c: C) => void): CmdBinderBuilder<C>;
    end(fn: (c: C) => void): CmdBinderBuilder<C>;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): CmdBinderBuilder<C>;
    onDynamic(node: Widget<Node>): CmdBinderBuilder<C>;
    when(fn: () => boolean, mode?: WhenType): CmdBinderBuilder<C>;
    log(...level: ReadonlyArray<LogLevel>): CmdBinderBuilder<C>;
    stopImmediatePropagation(): CmdBinderBuilder<C>;
    preventDefault(): CmdBinderBuilder<C>;
    catch(fn: (ex: unknown) => void): CmdBinderBuilder<C>;
    name(name: string): CmdBinderBuilder<C>;
    configureRules(ruleName: RuleName, severity: Severity): CmdBinderBuilder<C>;
}
