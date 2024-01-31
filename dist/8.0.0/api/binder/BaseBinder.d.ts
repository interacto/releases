import type { BaseBinderBuilder, Widget } from "./BaseBinderBuilder";
import type { CmdBinder } from "./CmdBinder";
import type { InteractionBinder } from "./InteractionBinder";
import type { WhenType } from "./When";
import type { LogLevel } from "../../interacto";
import type { RuleName, Severity } from "../checker/Checker";
import type { Command } from "../command/Command";
import type { Interaction, InteractionDataType } from "../interaction/Interaction";
import type { InteractionData } from "../interaction/InteractionData";
export interface BaseBinder extends BaseBinderBuilder {
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): BaseBinder;
    onDynamic(node: Widget<Node>): BaseBinder;
    when(whenPredicate: () => boolean, mode?: WhenType): BaseBinder;
    end(fn: () => void): BaseBinder;
    log(...level: ReadonlyArray<LogLevel>): BaseBinder;
    catch(fn: (ex: unknown) => void): BaseBinder;
    name(name: string): BaseBinder;
    configureRules(ruleName: RuleName, severity: Severity): BaseBinder;
    toProduce<C extends Command>(fn: () => C): CmdBinder<C>;
    toProduceAnon(fn: () => void): CmdBinder<Command>;
    usingInteraction<I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>>(fn: () => I): InteractionBinder<I, A, D>;
}
