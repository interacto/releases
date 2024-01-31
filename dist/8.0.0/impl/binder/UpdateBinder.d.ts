import { Binder } from "./Binder";
import type { Widget } from "../../api/binder/BaseBinderBuilder";
import type { CmdUpdateBinder } from "../../api/binder/CmdUpdateBinder";
import type { InteractionCmdUpdateBinder } from "../../api/binder/InteractionCmdUpdateBinder";
import type { WhenType } from "../../api/binder/When";
import type { Binding } from "../../api/binding/Binding";
import type { BindingsObserver } from "../../api/binding/BindingsObserver";
import type { RuleName, Severity } from "../../api/checker/Checker";
import type { Command } from "../../api/command/Command";
import type { Interaction, InteractionDataType } from "../../api/interaction/Interaction";
import type { InteractionData } from "../../api/interaction/InteractionData";
import type { Logger } from "../../api/logging/Logger";
import type { LogLevel } from "../../api/logging/LogLevel";
import type { UndoHistoryBase } from "../../api/undo/UndoHistoryBase";
export declare class UpdateBinder<C extends Command, I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> extends Binder<C, I, A, D> implements CmdUpdateBinder<C>, InteractionCmdUpdateBinder<C, I, A, D> {
    protected thenFn?: (c: C, i: D, acc: A) => void;
    protected cancelFn?: (i: D, acc: A) => void;
    protected endOrCancelFn?: (i: D, acc: A) => void;
    protected continuousCmdExecution: boolean;
    protected throttleTimeout: number;
    protected thenFnArray: Array<(c: C, i: D, acc: A) => void>;
    protected cancelFnArray: Array<(i: D, acc: A) => void>;
    protected endOrCancelFnArray: Array<(i: D, acc: A) => void>;
    constructor(undoHistory: UndoHistoryBase, logger: Logger, observer?: BindingsObserver, binder?: Partial<UpdateBinder<C, I, A, D>>, acc?: A);
    protected copyFnArraysUpdate(): void;
    then(fn: (c: C, i: D, acc: A) => void): UpdateBinder<C, I, A, D>;
    continuousExecution(): UpdateBinder<C, I, A, D>;
    cancel(fn: (i: D, acc: A) => void): UpdateBinder<C, I, A, D>;
    endOrCancel(fn: (i: D, acc: A) => void): UpdateBinder<C, I, A, D>;
    throttle(timeout: number): UpdateBinder<C, I, A, D>;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): UpdateBinder<C, I, A, D>;
    onDynamic(node: Widget<Node>): UpdateBinder<C, I, A, D>;
    first(fn: (c: C, i: D, acc: A) => void): UpdateBinder<C, I, A, D>;
    when(fn: (i: D, acc: Readonly<A>) => boolean, mode?: WhenType): UpdateBinder<C, I, A, D>;
    ifHadEffects(fn: (c: C, i: D, acc: A) => void): UpdateBinder<C, I, A, D>;
    ifHadNoEffect(fn: (c: C, i: D, acc: A) => void): UpdateBinder<C, I, A, D>;
    ifCannotExecute(fn: (c: C, i: D, acc: A) => void): UpdateBinder<C, I, A, D>;
    end(fn: (c: C, i: D, acc: A) => void): UpdateBinder<C, I, A, D>;
    log(...level: ReadonlyArray<LogLevel>): UpdateBinder<C, I, A, D>;
    stopImmediatePropagation(): UpdateBinder<C, I, A, D>;
    preventDefault(): UpdateBinder<C, I, A, D>;
    catch(fn: (ex: unknown) => void): UpdateBinder<C, I, A, D>;
    name(name: string): UpdateBinder<C, I, A, D>;
    configureRules(ruleName: RuleName, severity: Severity): UpdateBinder<C, I, A, D>;
    usingInteraction<I2 extends Interaction<D2>, A2, D2 extends InteractionData = InteractionDataType<I2>>(fn: () => I2): UpdateBinder<C, I2, A2, D2>;
    toProduce<C2 extends Command>(fn: (i: D) => C2): UpdateBinder<C2, I, A, D>;
    toProduceAnon(fn: () => void): UpdateBinder<Command, I, A, D>;
    protected duplicate(): UpdateBinder<C, I, A, D>;
    bind(): Binding<C, I, A, D>;
}
