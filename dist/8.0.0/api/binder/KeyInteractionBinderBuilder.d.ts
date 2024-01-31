import type { Widget } from "./BaseBinderBuilder";
import type { InteractionBinderBuilder } from "./InteractionBinderBuilder";
import type { KeyBinderBuilder } from "./KeyBinderBuilder";
import type { WhenType } from "./When";
import type { RuleName, Severity } from "../checker/Checker";
import type { Interaction, InteractionDataType } from "../interaction/Interaction";
import type { InteractionData } from "../interaction/InteractionData";
import type { LogLevel } from "../logging/LogLevel";
export interface KeyInteractionBinderBuilder<I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> extends InteractionBinderBuilder<I, A, D>, KeyBinderBuilder {
    when(fn: (i: D, acc: Readonly<A>) => boolean, mode?: WhenType): KeyInteractionBinderBuilder<I, A, D>;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): KeyInteractionBinderBuilder<I, A, D>;
    onDynamic(node: Widget<Node>): KeyInteractionBinderBuilder<I, A, D>;
    log(...level: ReadonlyArray<LogLevel>): KeyInteractionBinderBuilder<I, A, D>;
    end(fn: () => void): KeyInteractionBinderBuilder<I, A, D>;
    with(isCode: boolean, ...keysOrCodes: ReadonlyArray<string>): KeyInteractionBinderBuilder<I, A, D>;
    stopImmediatePropagation(): KeyInteractionBinderBuilder<I, A, D>;
    preventDefault(): KeyInteractionBinderBuilder<I, A, D>;
    catch(fn: (ex: unknown) => void): KeyInteractionBinderBuilder<I, A, D>;
    name(name: string): KeyInteractionBinderBuilder<I, A, D>;
    configureRules(ruleName: RuleName, severity: Severity): KeyInteractionBinderBuilder<I, A, D>;
}
