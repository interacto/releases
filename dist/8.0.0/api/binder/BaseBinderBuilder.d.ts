import type { WhenType } from "./When";
import type { RuleName, Severity } from "../checker/Checker";
import type { LogLevel } from "../logging/LogLevel";
export interface EltRef<T> {
    nativeElement: T;
}
export declare function isEltRef(obj: unknown): obj is EltRef<EventTarget>;
export type Widget<T> = EltRef<T> | T;
export interface BaseBinderBuilder {
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): BaseBinderBuilder;
    onDynamic(node: Widget<Node>): BaseBinderBuilder;
    when(fn: () => boolean, mode?: WhenType): BaseBinderBuilder;
    end(fn: () => void): BaseBinderBuilder;
    log(...level: ReadonlyArray<LogLevel>): BaseBinderBuilder;
    stopImmediatePropagation(): BaseBinderBuilder;
    preventDefault(): BaseBinderBuilder;
    catch(fn: (ex: unknown) => void): BaseBinderBuilder;
    name(name: string): BaseBinderBuilder;
    configureRules(ruleName: RuleName, severity: Severity): BaseBinderBuilder;
}
