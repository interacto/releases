import type { BaseBinderBuilder, Widget } from "./BaseBinderBuilder";
import type { WhenType } from "./When";
import type { RuleName, Severity } from "../checker/Checker";
import type { LogLevel } from "../logging/LogLevel";
export interface BaseUpdateBinderBuilder extends BaseBinderBuilder {
    continuousExecution(): BaseUpdateBinderBuilder;
    throttle(timeout: number): BaseUpdateBinderBuilder;
    when(fn: () => boolean, mode?: WhenType): BaseUpdateBinderBuilder;
    end(fn: () => void): BaseUpdateBinderBuilder;
    log(...level: ReadonlyArray<LogLevel>): BaseUpdateBinderBuilder;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): BaseUpdateBinderBuilder;
    onDynamic(node: Widget<Node>): BaseUpdateBinderBuilder;
    stopImmediatePropagation(): BaseUpdateBinderBuilder;
    preventDefault(): BaseUpdateBinderBuilder;
    catch(fn: (ex: unknown) => void): BaseUpdateBinderBuilder;
    name(name: string): BaseUpdateBinderBuilder;
    configureRules(ruleName: RuleName, severity: Severity): BaseUpdateBinderBuilder;
}
