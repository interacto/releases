import { Observable, Subject } from 'rxjs';

type WhenType = "end" | "nonStrict" | "strict" | "strictStart" | "strictThen" | "then";
declare function isWhenAtStart(type: WhenType): boolean;
declare function isWhenAtThen(type: WhenType): boolean;
declare function isWhenAtEnd(type: WhenType): boolean;
declare function isWhenStrict(type: WhenType): boolean;
interface When<D, A> {
    fn: (i: D, acc: Readonly<A>) => boolean;
    type: WhenType;
}

interface Command {
    flush(): void;
    execute(): Promise<boolean> | boolean;
    canExecute(): boolean;
    hadEffect(): boolean;
    done(): void;
    isDone(): boolean;
    cancel(): void;
    getStatus(): CmdStatus;
}
type CmdStatus = "cancelled" | "created" | "done" | "executed" | "flushed";

interface InteractionData {
}

interface FSMHandler {
    fsmStarts?(): void;
    fsmUpdates?(): void;
    fsmStops?(): void;
    fsmCancels?(): void;
    fsmError?(err: unknown): void;
    preFsmStart?(): void;
    preFsmUpdate?(): void;
    preFsmStop?(): void;
}

interface State {
    readonly name: string;
    readonly fsm: FSM;
    checkStartingState(): void;
    uninstall(): void;
    acceptVisitor(visitor: VisitorFSM): void;
}

interface InputState extends State {
    enter(): void;
}

declare const mouseEventTypes: readonly ["mousedown", "mouseup", "mousemove", "mouseover", "mouseout", "mouseenter", "mouseleave", "click", "auxclick"];
declare const touchEventTypes: readonly ["touchstart", "touchend", "touchmove"];
declare const keyEventTypes: readonly ["keydown", "keyup"];
declare const eventTypes: readonly ["mousedown", "mouseup", "mousemove", "mouseover", "mouseout", "mouseenter", "mouseleave", "click", "auxclick", "touchstart", "touchend", "touchmove", "keydown", "keyup", "input", "scroll", "change", "wheel"];
type EventType = typeof eventTypes[number];
type MouseEventType = typeof mouseEventTypes[number];
type TouchEventType = typeof touchEventTypes[number];
type KeyEventType = typeof keyEventTypes[number];

interface Transition<E extends Event> {
    readonly target: InputState;
    execute(event: Event): InputState | undefined;
    guard(event: E): boolean;
    accept(event: Event): event is E;
    acceptVisitor(visitor: VisitorFSM): void;
    getAcceptedEvents(): ReadonlySet<EventType>;
    uninstall(): void;
}

interface OutputState extends State {
    readonly transitions: ReadonlyArray<Transition<Event>>;
    exit(): void;
    process(event: Event): boolean;
    addTransition(tr: Transition<Event>): void;
}
declare function isOutputStateType(obj: State | undefined): obj is OutputState;

interface FSM {
    readonly states: ReadonlyArray<State>;
    currentState: OutputState;
    readonly currentStateObservable: Observable<[OutputState, OutputState]>;
    readonly initState: OutputState;
    readonly startingState: State;
    readonly started: boolean;
    inner: boolean;
    currentSubFSM: FSM | undefined;
    log: boolean;
    process(event: Event): boolean;
    onStarting(): void;
    onUpdating(): void;
    onCancelling(): void;
    onTerminating(): void;
    onError(err: unknown): void;
    onTimeout(): void;
    stopCurrentTimeout(): void;
    enterStdState(state: InputState & OutputState): void;
    addHandler(handler: FSMHandler): void;
    removeHandler(handler: FSMHandler): void;
    reinit(): void;
    fullReinit(): void;
    uninstall(): void;
    acceptVisitor(visitor: VisitorFSM): void;
}

interface ConcurrentFSM<F extends FSM> extends FSM {
    getAllConccurFSMs(): ReadonlyArray<F>;
}

interface VisitorFSM {
    visitFSM(fsm: FSM): void;
    visitAndConcurrentFSM(fsm: ConcurrentFSM<FSM>): void;
    visitXOrConcurrentFSM(fsm: ConcurrentFSM<FSM>): void;
    visitState(state: OutputState & State): void;
    visitInitState(state: OutputState & State): void;
    visitCancellingState(state: InputState & State): void;
    visitTerminalState(state: InputState & State): void;
    visitTransition(transition: Transition<Event>): void;
    visitTimeoutTransition(transition: Transition<Event>): void;
}

interface VisitorInteraction extends VisitorFSM {
    visitInteraction(interaction: Interaction<InteractionData>): void;
}

type InteractionDataType<T> = T extends Interaction<infer D> ? D : never;
type InteractionsDataTypes<A extends Array<Interaction<any>>> = {
    [K in keyof A]: A[K] extends Interaction<infer T> ? T : never;
};
interface Interaction<D extends InteractionData> {
    stopImmediatePropagation: boolean;
    preventDefault: boolean;
    readonly fsm: FSM;
    data: D;
    readonly name: string;
    readonly registeredNodes: ReadonlySet<unknown>;
    readonly dynamicRegisteredNodes: ReadonlySet<unknown>;
    isRunning(): boolean;
    isActivated(): boolean;
    setActivated(activated: boolean): void;
    log(log: boolean): void;
    registerToNodes(widgets: ReadonlyArray<unknown>): void;
    registerToNodeChildren(elementToObserve: Node): void;
    setThrottleTimeout(timeout: number): void;
    fullReinit(): void;
    reinit(): void;
    reinitData(): void;
    uninstall(): void;
    acceptVisitor(visitor: VisitorInteraction): void;
}

interface BindingsObserver {
    observeBinding(binding: Binding<Command, Interaction<InteractionData>, unknown>): void;
    clearObservedBindings(): void;
    readonly checker: Checker;
}

type LogLevel = "binding" | "command" | "interaction" | "usage";

interface BaseUpdateBinderBuilder extends BaseBinderBuilder {
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

interface CmdBinderBuilder<C extends Command> extends BaseBinderBuilder {
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

interface CmdUpdateBinderBuilder<C extends Command> extends CmdBinderBuilder<C>, BaseUpdateBinderBuilder {
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

interface InteractionBinderBuilder<I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> extends BaseBinderBuilder {
    when(fn: (i: D, acc: Readonly<A>) => boolean, mode?: WhenType): InteractionBinderBuilder<I, A, D>;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): InteractionBinderBuilder<I, A, D>;
    onDynamic(node: Widget<Node>): InteractionBinderBuilder<I, A, D>;
    end(fn: () => void): InteractionBinderBuilder<I, A, D>;
    log(...level: ReadonlyArray<LogLevel>): InteractionBinderBuilder<I, A, D>;
    stopImmediatePropagation(): InteractionBinderBuilder<I, A, D>;
    preventDefault(): InteractionBinderBuilder<I, A, D>;
    catch(fn: (ex: unknown) => void): InteractionBinderBuilder<I, A, D>;
    name(name: string): InteractionBinderBuilder<I, A, D>;
    configureRules(ruleName: RuleName, severity: Severity): InteractionBinderBuilder<I, A, D>;
}

interface InteractionCmdBinder<C extends Command, I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> extends CmdBinderBuilder<C>, InteractionBinderBuilder<I, A, D> {
    first(fn: (c: C, i: D, acc: A) => void): InteractionCmdBinder<C, I, A, D>;
    ifHadEffects(fn: (c: C, i: D, acc: A) => void): InteractionCmdBinder<C, I, A, D>;
    ifHadNoEffect(fn: (c: C, i: D, acc: A) => void): InteractionCmdBinder<C, I, A, D>;
    ifCannotExecute(fn: (c: C, i: D, acc: A) => void): InteractionCmdBinder<C, I, A, D>;
    end(fn: (c: C, i: D, acc: A) => void): InteractionCmdBinder<C, I, A, D>;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): InteractionCmdBinder<C, I, A, D>;
    onDynamic(node: Widget<Node>): InteractionCmdBinder<C, I, A, D>;
    log(...level: ReadonlyArray<LogLevel>): InteractionCmdBinder<C, I, A, D>;
    when(fn: (i: D, acc: Readonly<A>) => boolean, mode?: WhenType): InteractionCmdBinder<C, I, A, D>;
    stopImmediatePropagation(): InteractionCmdBinder<C, I, A, D>;
    preventDefault(): InteractionCmdBinder<C, I, A, D>;
    catch(fn: (ex: unknown) => void): InteractionCmdBinder<C, I, A, D>;
    name(name: string): InteractionCmdBinder<C, I, A, D>;
    configureRules(ruleName: RuleName, severity: Severity): InteractionCmdBinder<C, I, A, D>;
    bind(): Binding<C, I, A, D>;
}

interface InteractionUpdateBinderBuilder<I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> extends InteractionBinderBuilder<I, A, D>, BaseUpdateBinderBuilder {
    cancel(fn: (i: D, acc: A) => void): InteractionUpdateBinderBuilder<I, A, D>;
    endOrCancel(fn: (i: D, acc: A) => void): InteractionUpdateBinderBuilder<I, A, D>;
    when(fn: (i: D, acc: Readonly<A>) => boolean, mode?: WhenType): InteractionUpdateBinderBuilder<I, A, D>;
    end(fn: () => void): InteractionUpdateBinderBuilder<I, A, D>;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): InteractionUpdateBinderBuilder<I, A, D>;
    onDynamic(node: Widget<Node>): InteractionUpdateBinderBuilder<I, A, D>;
    log(...level: ReadonlyArray<LogLevel>): InteractionUpdateBinderBuilder<I, A, D>;
    stopImmediatePropagation(): InteractionUpdateBinderBuilder<I, A, D>;
    throttle(timeout: number): InteractionUpdateBinderBuilder<I, A, D>;
    continuousExecution(): InteractionUpdateBinderBuilder<I, A, D>;
    preventDefault(): InteractionUpdateBinderBuilder<I, A, D>;
    catch(fn: (ex: unknown) => void): InteractionUpdateBinderBuilder<I, A, D>;
    name(name: string): InteractionUpdateBinderBuilder<I, A, D>;
    configureRules(ruleName: RuleName, severity: Severity): InteractionUpdateBinderBuilder<I, A, D>;
}

interface InteractionCmdUpdateBinder<C extends Command, I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> extends InteractionCmdBinder<C, I, A, D>, CmdUpdateBinderBuilder<C>, InteractionUpdateBinderBuilder<I, A, D> {
    then(fn: ((c: C, i: D, acc: A) => void) | ((c: C) => void)): InteractionCmdUpdateBinder<C, I, A, D>;
    continuousExecution(): InteractionCmdUpdateBinder<C, I, A, D>;
    throttle(timeout: number): InteractionCmdUpdateBinder<C, I, A, D>;
    first(fn: (c: C, i: D, acc: A) => void): InteractionCmdUpdateBinder<C, I, A, D>;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): InteractionCmdUpdateBinder<C, I, A, D>;
    onDynamic(node: Widget<Node>): InteractionCmdUpdateBinder<C, I, A, D>;
    log(...level: ReadonlyArray<LogLevel>): InteractionCmdUpdateBinder<C, I, A, D>;
    cancel(fn: (i: D, acc: A) => void): InteractionCmdUpdateBinder<C, I, A, D>;
    endOrCancel(fn: (i: D, acc: A) => void): InteractionCmdUpdateBinder<C, I, A, D>;
    when(fn: (i: D, acc: Readonly<A>) => boolean, mode?: WhenType): InteractionCmdUpdateBinder<C, I, A, D>;
    ifHadEffects(fn: (c: C, i: D, acc: A) => void): InteractionCmdUpdateBinder<C, I, A, D>;
    ifHadNoEffect(fn: (c: C, i: D, acc: A) => void): InteractionCmdUpdateBinder<C, I, A, D>;
    ifCannotExecute(fn: (c: C, i: D, acc: A) => void): InteractionCmdUpdateBinder<C, I, A, D>;
    end(fn: (c: C, i: D, acc: A) => void): InteractionCmdUpdateBinder<C, I, A, D>;
    stopImmediatePropagation(): InteractionCmdUpdateBinder<C, I, A, D>;
    preventDefault(): InteractionCmdUpdateBinder<C, I, A, D>;
    catch(fn: (ex: unknown) => void): InteractionCmdUpdateBinder<C, I, A, D>;
    name(name: string): InteractionCmdUpdateBinder<C, I, A, D>;
    configureRules(ruleName: RuleName, severity: Severity): InteractionCmdUpdateBinder<C, I, A, D>;
    bind(): Binding<C, I, A, D>;
}

interface CmdUpdateBinder<C extends Command> extends CmdUpdateBinderBuilder<C> {
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

interface InteractionUpdateBinder<I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> extends InteractionUpdateBinderBuilder<I, A, D> {
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): InteractionUpdateBinder<I, A, D>;
    onDynamic(node: Widget<Node>): InteractionUpdateBinder<I, A, D>;
    log(...level: ReadonlyArray<LogLevel>): InteractionUpdateBinder<I, A, D>;
    when(fn: (i: D, acc: Readonly<A>) => boolean, mode?: WhenType): InteractionUpdateBinder<I, A, D>;
    end(fn: () => void): InteractionUpdateBinder<I, A, D>;
    cancel(fn: (i: D, acc: A) => void): InteractionUpdateBinder<I, A, D>;
    endOrCancel(fn: (i: D, acc: A) => void): InteractionUpdateBinder<I, A, D>;
    stopImmediatePropagation(): InteractionUpdateBinder<I, A, D>;
    preventDefault(): InteractionUpdateBinder<I, A, D>;
    throttle(timeout: number): InteractionUpdateBinder<I, A, D>;
    continuousExecution(): InteractionUpdateBinder<I, A, D>;
    catch(fn: (ex: unknown) => void): InteractionUpdateBinder<I, A, D>;
    name(name: string): InteractionUpdateBinder<I, A, D>;
    configureRules(ruleName: RuleName, severity: Severity): InteractionUpdateBinder<I, A, D>;
    toProduce<C extends Command>(fn: (i: D) => C): InteractionCmdUpdateBinder<C, I, A, D>;
    toProduceAnon(fn: () => void): InteractionCmdUpdateBinder<Command, I, A, D>;
}

interface BaseUpdateBinder extends BaseUpdateBinderBuilder, BaseBinder {
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

interface InteractionBinder<I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> extends InteractionBinderBuilder<I, A, D> {
    when(fn: (i: D, acc: Readonly<A>) => boolean, mode?: WhenType): InteractionBinder<I, A, D>;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): InteractionBinder<I, A, D>;
    onDynamic(node: Widget<Node>): InteractionBinder<I, A, D>;
    log(...level: ReadonlyArray<LogLevel>): InteractionBinder<I, A, D>;
    end(fn: () => void): InteractionBinder<I, A, D>;
    stopImmediatePropagation(): InteractionBinder<I, A, D>;
    preventDefault(): InteractionBinder<I, A, D>;
    catch(fn: (ex: unknown) => void): InteractionBinder<I, A, D>;
    name(name: string): InteractionBinder<I, A, D>;
    configureRules(ruleName: RuleName, severity: Severity): InteractionBinder<I, A, D>;
    toProduce<C extends Command>(fn: (i: D) => C): InteractionCmdBinder<C, I, A, D>;
    toProduceAnon(fn: () => void): InteractionCmdBinder<Command, I, A, D>;
}

interface KeyBinderBuilder {
    with(isCode: boolean, ...keysOrCodes: ReadonlyArray<string>): KeyBinderBuilder;
}

interface KeyInteractionBinderBuilder<I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> extends InteractionBinderBuilder<I, A, D>, KeyBinderBuilder {
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

interface KeyInteractionCmdBinder<C extends Command, I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> extends KeyInteractionBinderBuilder<I, A, D>, InteractionCmdBinder<C, I, A, D> {
    first(fn: (c: C, i: D, acc: A) => void): KeyInteractionCmdBinder<C, I, A, D>;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): KeyInteractionCmdBinder<C, I, A, D>;
    onDynamic(node: Widget<Node>): KeyInteractionCmdBinder<C, I, A, D>;
    log(...level: ReadonlyArray<LogLevel>): KeyInteractionCmdBinder<C, I, A, D>;
    when(fn: (i: D, acc: Readonly<A>) => boolean, mode?: WhenType): KeyInteractionCmdBinder<C, I, A, D>;
    ifHadEffects(fn: (c: C, i: D, acc: A) => void): KeyInteractionCmdBinder<C, I, A, D>;
    ifHadNoEffect(fn: (c: C, i: D, acc: A) => void): KeyInteractionCmdBinder<C, I, A, D>;
    ifCannotExecute(fn: (c: C, i: D, acc: A) => void): KeyInteractionCmdBinder<C, I, A, D>;
    end(fn: (c: C, i: D, acc: A) => void): KeyInteractionCmdBinder<C, I, A, D>;
    with(isCode: boolean, ...keysOrCodes: ReadonlyArray<string>): KeyInteractionCmdBinder<C, I, A, D>;
    stopImmediatePropagation(): KeyInteractionCmdBinder<C, I, A, D>;
    preventDefault(): KeyInteractionCmdBinder<C, I, A, D>;
    catch(fn: (ex: unknown) => void): KeyInteractionCmdBinder<C, I, A, D>;
    name(name: string): KeyInteractionCmdBinder<C, I, A, D>;
    configureRules(ruleName: RuleName, severity: Severity): KeyInteractionCmdBinder<C, I, A, D>;
    bind(): Binding<C, I, A, D>;
}

interface KeyInteractionBinder<I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> extends KeyInteractionBinderBuilder<I, A, D> {
    when(fn: (i: D, acc: Readonly<A>) => boolean, mode?: WhenType): KeyInteractionBinder<I, A, D>;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): KeyInteractionBinder<I, A, D>;
    onDynamic(node: Widget<Node>): KeyInteractionBinder<I, A, D>;
    log(...level: ReadonlyArray<LogLevel>): KeyInteractionBinder<I, A, D>;
    end(fn: () => void): KeyInteractionBinder<I, A, D>;
    with(isCode: boolean, ...keysOrCodes: ReadonlyArray<string>): KeyInteractionBinder<I, A, D>;
    stopImmediatePropagation(): KeyInteractionBinder<I, A, D>;
    preventDefault(): KeyInteractionBinder<I, A, D>;
    catch(fn: (ex: unknown) => void): KeyInteractionBinder<I, A, D>;
    name(name: string): KeyInteractionBinder<I, A, D>;
    configureRules(ruleName: RuleName, severity: Severity): KeyInteractionBinder<I, A, D>;
    toProduce<C extends Command>(fn: (i: D) => C): KeyInteractionCmdBinder<C, I, A, D>;
    toProduceAnon(fn: () => void): KeyInteractionCmdBinder<Command, I, A, D>;
}

interface KeyInteractionCmdUpdateBinder<C extends Command, I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> extends KeyInteractionBinderBuilder<I, A, D>, InteractionUpdateBinder<I, A, D> {
    with(isCode: boolean, ...keysOrCodes: ReadonlyArray<string>): KeyInteractionCmdUpdateBinder<C, I, A, D>;
    then(fn: ((c: C, i: D, acc: A) => void) | ((c: C) => void)): KeyInteractionCmdUpdateBinder<C, I, A, D>;
    continuousExecution(): KeyInteractionCmdUpdateBinder<C, I, A, D>;
    throttle(timeout: number): KeyInteractionCmdUpdateBinder<C, I, A, D>;
    first(fn: (c: C, i: D, acc: A) => void): KeyInteractionCmdUpdateBinder<C, I, A, D>;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): KeyInteractionCmdUpdateBinder<C, I, A, D>;
    onDynamic(node: Widget<Node>): KeyInteractionCmdUpdateBinder<C, I, A, D>;
    log(...level: ReadonlyArray<LogLevel>): KeyInteractionCmdUpdateBinder<C, I, A, D>;
    cancel(fn: (i: D, acc: A) => void): KeyInteractionCmdUpdateBinder<C, I, A, D>;
    endOrCancel(fn: (i: D, acc: A) => void): KeyInteractionCmdUpdateBinder<C, I, A, D>;
    when(fn: (i: D, acc: Readonly<A>) => boolean, mode?: WhenType): KeyInteractionCmdUpdateBinder<C, I, A, D>;
    ifHadEffects(fn: (c: C, i: D, acc: A) => void): KeyInteractionCmdUpdateBinder<C, I, A, D>;
    ifHadNoEffect(fn: (c: C, i: D, acc: A) => void): KeyInteractionCmdUpdateBinder<C, I, A, D>;
    ifCannotExecute(fn: (c: C, i: D, acc: A) => void): KeyInteractionCmdUpdateBinder<C, I, A, D>;
    end(fn: (c: C, i: D, acc: A) => void): KeyInteractionCmdUpdateBinder<C, I, A, D>;
    stopImmediatePropagation(): KeyInteractionCmdUpdateBinder<C, I, A, D>;
    preventDefault(): KeyInteractionCmdUpdateBinder<C, I, A, D>;
    catch(fn: (ex: unknown) => void): KeyInteractionCmdUpdateBinder<C, I, A, D>;
    name(name: string): KeyInteractionCmdUpdateBinder<C, I, A, D>;
    configureRules(ruleName: RuleName, severity: Severity): KeyInteractionCmdUpdateBinder<C, I, A, D>;
    bind(): Binding<C, I, A, D>;
}

interface KeyInteractionUpdateBinder<I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> extends InteractionUpdateBinderBuilder<I, A, D>, KeyBinderBuilder {
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): KeyInteractionUpdateBinder<I, A, D>;
    onDynamic(node: Widget<Node>): KeyInteractionUpdateBinder<I, A, D>;
    log(...level: ReadonlyArray<LogLevel>): KeyInteractionUpdateBinder<I, A, D>;
    when(fn: (i: D, acc: Readonly<A>) => boolean, mode?: WhenType): KeyInteractionUpdateBinder<I, A, D>;
    continuousExecution(): KeyInteractionUpdateBinder<I, A, D>;
    throttle(timeout: number): KeyInteractionUpdateBinder<I, A, D>;
    with(isCode: boolean, ...keysOrCodes: ReadonlyArray<string>): KeyInteractionUpdateBinder<I, A, D>;
    stopImmediatePropagation(): KeyInteractionUpdateBinder<I, A, D>;
    preventDefault(): KeyInteractionUpdateBinder<I, A, D>;
    cancel(fn: (i: D, acc: A) => void): KeyInteractionUpdateBinder<I, A, D>;
    endOrCancel(fn: (i: D, acc: A) => void): KeyInteractionUpdateBinder<I, A, D>;
    catch(fn: (ex: unknown) => void): KeyInteractionUpdateBinder<I, A, D>;
    name(name: string): KeyInteractionUpdateBinder<I, A, D>;
    configureRules(ruleName: RuleName, severity: Severity): KeyInteractionUpdateBinder<I, A, D>;
    toProduce<C extends Command>(fn: (i: D) => C): KeyInteractionCmdUpdateBinder<C, I, A, D>;
    toProduceAnon(fn: () => void): KeyInteractionCmdUpdateBinder<Command, I, A, D>;
}

interface UnitInteractionData extends InteractionData {
    readonly timeStamp: number;
    readonly target: EventTarget | null;
    readonly currentTarget: EventTarget | null;
}

interface EventModifierData extends UnitInteractionData {
    readonly altKey: boolean;
    readonly ctrlKey: boolean;
    readonly metaKey: boolean;
    readonly shiftKey: boolean;
}

interface PointBaseData extends EventModifierData {
    readonly clientX: number;
    readonly clientY: number;
    readonly pageX: number;
    readonly pageY: number;
    readonly screenX: number;
    readonly screenY: number;
}

interface SrcTgtPointsData<T extends PointBaseData> extends InteractionData {
    readonly src: T;
    readonly tgt: T;
    readonly diffClientX: number;
    readonly diffClientY: number;
    readonly diffPageX: number;
    readonly diffPageY: number;
    readonly diffScreenX: number;
    readonly diffScreenY: number;
    readonly duration: number;
    velocity(direction: "all" | "horiz" | "vert"): number;
    isVertical(pxTolerance: number): boolean;
    isHorizontal(pxTolerance: number): boolean;
    isLeft(pxTolerance: number): boolean;
    isRight(pxTolerance: number): boolean;
    isTop(pxTolerance: number): boolean;
    isBottom(pxTolerance: number): boolean;
}

interface TouchData extends PointBaseData, UnitInteractionData {
    readonly force: number;
    readonly identifier: number;
    readonly pageX: number;
    readonly pageY: number;
    readonly radiusX: number;
    readonly radiusY: number;
    readonly rotationAngle: number;
    readonly allTouches: ReadonlyArray<TouchData>;
}

interface LineTouchData {
    isVertical(pxTolerance: number): boolean;
    isHorizontal(pxTolerance: number): boolean;
    isLeft(pxTolerance: number): boolean;
    isRight(pxTolerance: number): boolean;
    isTop(pxTolerance: number): boolean;
    isBottom(pxTolerance: number): boolean;
}

interface MultiTouchData extends InteractionData {
    readonly touches: ReadonlyArray<SrcTgtPointsData<TouchData>>;
    velocity(direction: "all" | "horiz" | "vert"): number;
}

interface RotationTouchData extends TwoTouchData {
    rotationAngle: number;
}

interface ScaleTouchData extends TwoTouchData {
    scalingRatio(pxTolerance: number): number;
}

interface TwoTouchData extends MultiTouchData {
    readonly touch1: SrcTgtPointsData<TouchData>;
    readonly touch2: SrcTgtPointsData<TouchData>;
    readonly diffClientX: number;
    readonly diffClientY: number;
    readonly diffPageX: number;
    readonly diffPageY: number;
    readonly diffScreenX: number;
    readonly diffScreenY: number;
}
type GeneralTwoTouchData = LineTouchData & RotationTouchData & ScaleTouchData;

interface ThreeTouchData extends TwoTouchData {
    readonly touch3: SrcTgtPointsData<TouchData>;
}

interface FourTouchData extends ThreeTouchData {
    readonly touch4: SrcTgtPointsData<TouchData>;
}

interface KeyData extends UnitInteractionData, EventModifierData {
    readonly code: string;
    readonly key: string;
    readonly location: number;
    readonly repeat: boolean;
}

interface KeysData extends InteractionData {
    readonly keys: ReadonlyArray<KeyData>;
}

interface PointData extends PointBaseData {
    readonly button: number;
    readonly buttons: number;
    readonly movementX: number;
    readonly movementY: number;
    readonly offsetX: number;
    readonly offsetY: number;
    readonly relatedTarget: EventTarget | null;
}

interface PointsData<D extends PointBaseData> extends InteractionData {
    readonly points: ReadonlyArray<D>;
}

interface MousePointsData extends PointsData<PointData> {
    readonly currentPosition: PointData | undefined;
}

interface ScrollData extends UnitInteractionData {
    readonly scrollX: number;
    readonly scrollY: number;
}

type TapsData = PointsData<TouchData>;

interface ThenData<DX extends Array<unknown>> {
    readonly dx: DX;
}

interface WheelData extends PointData {
    readonly deltaX: number;
    readonly deltaY: number;
    readonly deltaZ: number;
    readonly deltaMode: number;
}

interface WidgetData<T> extends InteractionData {
    readonly widget: T | undefined;
}

interface Logger {
    writeConsole: boolean;
    serverAddress: string | undefined;
    readonly frontVersion: string | undefined;
    readonly sessionID: string;
    logInteractionMsg(msg: string, interactionName?: string): void;
    logBindingMsg(msg: string, bindingName?: string): void;
    logBindingStart(bindingName: string): void;
    logBindingEnd(bindingName: string, cancelled: boolean): void;
    logCmdMsg(msg: string, cmdName?: string): void;
    logInteractionErr(msg: string, ex: unknown, interactionName?: string): void;
    logBindingErr(msg: string, ex: unknown, bindingName?: string): void;
    logCmdErr(msg: string, ex: unknown, cmdName?: string): void;
}

type PrimitiveUndoableSnapshot = HTMLElement | SVGElement | string;
type UndoableSnapshot = PrimitiveUndoableSnapshot | Promise<PrimitiveUndoableSnapshot> | undefined;
interface Undoable {
    undo(): void;
    redo(): void;
    getUndoName(): string;
    getVisualSnapshot(): UndoableSnapshot;
}
declare function isUndoableType(obj: unknown): obj is Undoable;

interface UndoHistoryBase {
    undo(): void;
    redo(): void;
    clear(): void;
    add(undoable: Undoable): void;
    getLastUndo(): Undoable | undefined;
    getLastRedo(): Undoable | undefined;
    getLastUndoMessage(): string | undefined;
    getLastRedoMessage(): string | undefined;
    getLastOrEmptyUndoMessage(): string;
    getLastOrEmptyRedoMessage(): string;
    undosObservable(): Observable<Undoable | undefined>;
    redosObservable(): Observable<Undoable | undefined>;
}

type PartialButtonTypedBinder<A = unknown> = InteractionBinder<Interaction<WidgetData<HTMLButtonElement>>, A>;
type PartialInputTypedBinder<A = unknown> = InteractionBinder<Interaction<WidgetData<HTMLInputElement>>, A>;
type PartialSelectTypedBinder<A = unknown> = InteractionBinder<Interaction<WidgetData<HTMLSelectElement>>, A>;
type PartialSpinnerTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<WidgetData<HTMLInputElement>>, A>;
type PartialAnchorTypedBinder<A = unknown> = InteractionBinder<Interaction<WidgetData<HTMLAnchorElement>>, A>;
type PartialTextInputTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<WidgetData<HTMLInputElement | HTMLTextAreaElement>>, A>;
type PartialRotateTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<RotationTouchData>, A>;
type PartialScaleTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<ScaleTouchData>, A>;
type PartialTwoPanTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<LineTouchData & TwoTouchData>, A>;
type PartialTwoTouchTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<GeneralTwoTouchData>, A>;
type PartialThreeTouchTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<ThreeTouchData>, A>;
type PartialFourTouchTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<FourTouchData>, A>;
type PartialTouchSrcTgtTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<SrcTgtPointsData<TouchData>>, A>;
type PartialMultiTouchTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<MultiTouchData>, A>;
type PartialTapsTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<TapsData>, A>;
type PartialTouchTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<TouchData>, A>;
type PartialPointTypedBinder<A = unknown> = InteractionBinder<Interaction<PointData>, A>;
type PartialWheelTypedBinder<A = unknown> = InteractionBinder<Interaction<WheelData>, A>;
type PartialScrollTypedBinder<A = unknown> = InteractionBinder<Interaction<ScrollData>, A>;
type PartialUpdatePointTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<PointData>, A>;
type PartialPointsTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<MousePointsData>, A>;
type PartialPointSrcTgtTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<SrcTgtPointsData<PointData>>, A>;
type PartialKeyTypedBinder<A = unknown> = KeyInteractionBinder<Interaction<KeyData>, A>;
type PartialKeysTypedBinder<A = unknown> = KeyInteractionUpdateBinder<Interaction<KeysData>, A>;
type PartialPointOrTouchTypedBinder<A = unknown> = InteractionBinder<Interaction<PointData | TouchData>, A>;
type PartialPointsOrTapsTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<MousePointsData | PointsData<TouchData>>, A>;
type PartialTouchMouseDnDTypedBinder<A = unknown> = InteractionUpdateBinder<Interaction<SrcTgtPointsData<PointData | TouchData>>, A>;
type PartialThenBinder<XS extends Array<Interaction<InteractionData>>, A = unknown> = InteractionUpdateBinder<Interaction<ThenData<InteractionsDataTypes<XS>>>, A, ThenData<InteractionsDataTypes<XS>>>;
declare abstract class Bindings<H extends UndoHistoryBase> {
    abstract readonly undoHistory: H;
    abstract readonly logger: Logger;
    abstract nodeBinder<A>(accInit?: A): BaseUpdateBinder;
    abstract buttonBinder<A>(accInit?: A): PartialButtonTypedBinder<A>;
    abstract checkboxBinder<A>(accInit?: A): PartialInputTypedBinder<A>;
    abstract colorPickerBinder<A>(accInit?: A): PartialInputTypedBinder<A>;
    abstract comboBoxBinder<A>(accInit?: A): PartialSelectTypedBinder<A>;
    abstract spinnerBinder<A>(accInit?: A): PartialSpinnerTypedBinder<A>;
    abstract dateBinder<A>(accInit?: A): PartialInputTypedBinder<A>;
    abstract hyperlinkBinder<A>(accInit?: A): PartialAnchorTypedBinder<A>;
    abstract textInputBinder<A>(timeout?: number, accInit?: A): PartialTextInputTypedBinder<A>;
    abstract touchDnDBinder<A>(cancellable: boolean, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    abstract reciprocalTouchDnDBinder<A>(handle: EltRef<SVGCircleElement>, spring: EltRef<SVGLineElement>, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    abstract multiTouchBinder<A>(nbTouches: number, accInit?: A): PartialMultiTouchTypedBinder<A>;
    abstract twoTouchBinder<A>(accInit?: A): PartialTwoTouchTypedBinder<A>;
    abstract threeTouchBinder<A>(accInit?: A): PartialThreeTouchTypedBinder<A>;
    abstract fourTouchBinder<A>(accInit?: A): PartialFourTouchTypedBinder<A>;
    abstract tapBinder<A>(nbTap: number, accInit?: A): PartialTapsTypedBinder<A>;
    abstract touchStartBinder<A>(accInit?: A): PartialTouchTypedBinder<A>;
    abstract longTouchBinder<A>(duration: number, accInit?: A): PartialTouchTypedBinder<A>;
    abstract panBinder<A>(cancellable: boolean, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    abstract panVerticalBinder<A>(pxTolerance: number, cancellable: boolean, minLength?: number, minVelocity?: number, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    abstract panHorizontalBinder<A>(pxTolerance: number, cancellable: boolean, minLength?: number, minVelocity?: number, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    abstract panLeftBinder<A>(pxTolerance: number, cancellable: boolean, minLength?: number, minVelocity?: number, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    abstract panRightBinder<A>(pxTolerance: number, cancellable: boolean, minLength?: number, minVelocity?: number, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    abstract panTopBinder<A>(pxTolerance: number, cancellable: boolean, minLength?: number, minVelocity?: number, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    abstract panBottomBinder<A>(pxTolerance: number, cancellable: boolean, minLength?: number, minVelocity?: number, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    abstract twoPanVerticalBinder<A>(pxTolerance: number, minLength?: number, minVelocity?: number, accInit?: A): PartialTwoPanTypedBinder<A>;
    abstract twoPanHorizontalBinder<A>(pxTolerance: number, minLength?: number, minVelocity?: number, accInit?: A): PartialTwoPanTypedBinder<A>;
    abstract twoPanLeftBinder<A>(pxTolerance: number, minLength?: number, minVelocity?: number, accInit?: A): PartialTwoPanTypedBinder<A>;
    abstract twoPanRightBinder<A>(pxTolerance: number, minLength?: number, minVelocity?: number, accInit?: A): PartialTwoPanTypedBinder<A>;
    abstract twoPanTopBinder<A>(pxTolerance: number, minLength?: number, minVelocity?: number, accInit?: A): PartialTwoPanTypedBinder<A>;
    abstract twoPanBottomBinder<A>(pxTolerance: number, minLength?: number, minVelocity?: number, accInit?: A): PartialTwoPanTypedBinder<A>;
    abstract rotateBinder<A>(pxTolerance: number, accInit?: A): PartialRotateTypedBinder<A>;
    abstract scaleBinder<A>(pxTolerance: number, accInit?: A): PartialScaleTypedBinder<A>;
    abstract clickBinder<A>(accInit?: A): PartialPointTypedBinder<A>;
    abstract wheelBinder<A>(accInit?: A): PartialWheelTypedBinder<A>;
    abstract dbleClickBinder<A>(accInit?: A): PartialUpdatePointTypedBinder<A>;
    abstract mouseDownBinder<A>(accInit?: A): PartialPointTypedBinder<A>;
    abstract mouseUpBinder<A>(accInit?: A): PartialPointTypedBinder<A>;
    abstract longMouseDownBinder<A>(duration: number, accInit?: A): PartialUpdatePointTypedBinder<A>;
    abstract clicksBinder<A>(nbClicks: number, accInit?: A): PartialPointsTypedBinder<A>;
    abstract mouseEnterBinder<A>(withBubbling: boolean, accInit?: A): PartialPointTypedBinder<A>;
    abstract mouseLeaveBinder<A>(withBubbling: boolean, accInit?: A): PartialPointTypedBinder<A>;
    abstract mouseMoveBinder<A>(accInit?: A): PartialPointTypedBinder<A>;
    abstract scrollBinder<A>(accInit?: A): PartialScrollTypedBinder<A>;
    abstract dndBinder<A>(cancellable: boolean, accInit?: A): PartialPointSrcTgtTypedBinder<A>;
    abstract reciprocalDndBinder<A>(handle: EltRef<SVGCircleElement>, spring: EltRef<SVGLineElement>, accInit?: A): PartialPointSrcTgtTypedBinder<A>;
    abstract dragLockBinder<A>(accInit?: A): PartialPointSrcTgtTypedBinder<A>;
    abstract keyDownBinder<A>(modifierAccepted: boolean, accInit?: A): PartialKeyTypedBinder<A>;
    abstract keysDownBinder<A>(accInit?: A): PartialKeysTypedBinder<A>;
    abstract keyUpBinder<A>(modifierAccepted: boolean, accInit?: A): PartialKeyTypedBinder<A>;
    abstract keysTypeBinder<A>(accInit?: A): PartialKeysTypedBinder<A>;
    abstract keyTypeBinder<A>(accInit?: A): PartialKeyTypedBinder<A>;
    abstract mouseDownOrTouchStartBinder<A>(accInit?: A): PartialPointOrTouchTypedBinder<A>;
    abstract tapsOrClicksBinder<A>(nbTap: number, accInit?: A): PartialPointsOrTapsTypedBinder<A>;
    abstract longpressOrTouchBinder<A>(duration: number, accInit?: A): PartialPointOrTouchTypedBinder<A>;
    abstract reciprocalMouseOrTouchDnD<A>(handle: EltRef<SVGCircleElement>, spring: EltRef<SVGLineElement>, accInit?: A): PartialTouchMouseDnDTypedBinder<A>;
    abstract undoRedoBinder(undo: Widget<HTMLButtonElement>, redo: Widget<HTMLButtonElement>, catchFn?: ((err: unknown) => void)): [
        Binding<Command, Interaction<WidgetData<HTMLButtonElement>>, unknown>,
        Binding<Command, Interaction<WidgetData<HTMLButtonElement>>, unknown>
    ];
    abstract combine<XS extends Array<Interaction<InteractionData>>, A>(interactions: XS, accInit?: A): PartialThenBinder<XS, A>;
    abstract clear(): void;
    abstract setBindingObserver(obs?: BindingsObserver): void;
    abstract acceptVisitor(visitor: VisitorBinding): void;
}

interface VisitorBinding extends VisitorInteraction {
    visitBinding(binding: Binding<Command, Interaction<InteractionData>, unknown>): void;
    visitBindings(bindings: Bindings<UndoHistoryBase>): void;
}

interface Binding<C extends Command, I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> {
    readonly name: string;
    logUsage: boolean;
    logBinding: boolean;
    logCmd: boolean;
    readonly accumulator: A;
    readonly interaction: I;
    readonly command: C | undefined;
    readonly linterRules: ReadonlyMap<RuleName, Severity>;
    activated: boolean;
    readonly running: boolean;
    readonly continuousCmdExecution: boolean;
    readonly timesEnded: number;
    readonly timesCancelled: number;
    readonly produces: Observable<C>;
    isWhenDefined(): boolean;
    uninstallBinding(): void;
    acceptVisitor(visitor: VisitorBinding): void;
}

type RuleName = "included" | "same-data" | "same-interactions";
type Severity = "err" | "ignore" | "warn";
type LinterRule = [name: RuleName, severity: Severity];
interface Checker {
    setLinterRules(...rules: ReadonlyArray<LinterRule>): void;
    checkRules(binding: Binding<Command, Interaction<InteractionData>, unknown>, binds: ReadonlyArray<Binding<Command, Interaction<InteractionData>, unknown>>): void;
    checkSameInteractions(binding: Binding<Command, Interaction<InteractionData>, unknown>, binds: ReadonlyArray<Binding<Command, Interaction<InteractionData>, unknown>>): void;
    checkSameData(binding: Binding<Command, Interaction<InteractionData>, unknown>, binds: ReadonlyArray<Binding<Command, Interaction<InteractionData>, unknown>>): void;
    checkIncluded(binding: Binding<Command, Interaction<InteractionData>, unknown>, binds: ReadonlyArray<Binding<Command, Interaction<InteractionData>, unknown>>): void;
}

interface EltRef<T> {
    nativeElement: T;
}
declare function isEltRef(obj: unknown): obj is EltRef<EventTarget>;
type Widget<T> = EltRef<T> | T;
interface BaseBinderBuilder {
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

interface CmdBinder<C extends Command> extends CmdBinderBuilder<C> {
    first(fn: (c: C) => void): CmdBinder<C>;
    end(fn: (c: C) => void): CmdBinder<C>;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): CmdBinder<C>;
    onDynamic(node: Widget<Node>): CmdBinder<C>;
    when(fn: () => boolean, mode?: WhenType): CmdBinder<C>;
    log(...level: ReadonlyArray<LogLevel>): CmdBinder<C>;
    usingInteraction<I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>>(fn: () => I): InteractionCmdBinder<C, I, A, D>;
    stopImmediatePropagation(): CmdBinder<C>;
    preventDefault(): CmdBinder<C>;
    catch(fn: (ex: unknown) => void): CmdBinder<C>;
    name(name: string): CmdBinder<C>;
    configureRules(ruleName: RuleName, severity: Severity): CmdBinder<C>;
}

interface BaseBinder extends BaseBinderBuilder {
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

interface InteractionBuilder<I extends Interaction<D>, D extends InteractionData = InteractionDataType<I>> {
    first(predicate: (i: D) => boolean): this;
    then(predicate: (i: D) => boolean): this;
    firstAndThen(predicate: (i: D) => boolean): this;
    end(predicate: (i: D) => boolean): this;
    name(name: string): this;
    build(): () => I;
}

interface UndoableTreeNode {
    lastChildUndone: UndoableTreeNode | undefined;
    readonly id: number;
    readonly undoable: Undoable;
    readonly parent: UndoableTreeNode | undefined;
    readonly children: Array<UndoableTreeNode>;
    readonly visualSnapshot: UndoableSnapshot;
    undo(): void;
    redo(): void;
}
interface UndoableTreeNodeDTO {
    readonly id: number;
    readonly undoable: unknown;
    readonly children: ReadonlyArray<UndoableTreeNodeDTO>;
}
interface TreeUndoHistoryDTO {
    readonly path: ReadonlyArray<number>;
    readonly roots: ReadonlyArray<UndoableTreeNodeDTO>;
}
declare abstract class TreeUndoHistory implements UndoHistoryBase {
    abstract get keepPath(): boolean;
    abstract get path(): ReadonlyArray<number>;
    abstract get root(): UndoableTreeNode;
    abstract get undoableNodes(): Array<UndoableTreeNode | undefined>;
    abstract get currentNode(): UndoableTreeNode;
    abstract goTo(id: number): void;
    abstract delete(id: number): void;
    abstract getPositions(): Map<number, number>;
    abstract add(undoable: Undoable): void;
    abstract clear(): void;
    abstract getLastOrEmptyRedoMessage(): string;
    abstract getLastOrEmptyUndoMessage(): string;
    abstract getLastRedo(): Undoable | undefined;
    abstract getLastRedoMessage(): string | undefined;
    abstract getLastUndo(): Undoable | undefined;
    abstract getLastUndoMessage(): string | undefined;
    abstract redo(): void;
    abstract redosObservable(): Observable<Undoable | undefined>;
    abstract undo(): void;
    abstract undosObservable(): Observable<Undoable | undefined>;
    abstract export(fn: (undoable: Undoable) => unknown): TreeUndoHistoryDTO;
    abstract import(dtoHistory: TreeUndoHistoryDTO, fn: (dtoUndoable: unknown) => Undoable): void;
}

declare abstract class UndoHistory implements UndoHistoryBase {
    abstract add(undoable: Undoable): void;
    abstract clear(): void;
    abstract undo(): void;
    abstract redo(): void;
    abstract getUndo(): ReadonlyArray<Undoable>;
    abstract getRedo(): ReadonlyArray<Undoable>;
    abstract undosObservable(): Observable<Undoable | undefined>;
    abstract redosObservable(): Observable<Undoable | undefined>;
    abstract getLastUndo(): Undoable | undefined;
    abstract getLastRedo(): Undoable | undefined;
    abstract getLastUndoMessage(): string | undefined;
    abstract getLastRedoMessage(): string | undefined;
    abstract getLastOrEmptyUndoMessage(): string;
    abstract getLastOrEmptyRedoMessage(): string;
    abstract getSizeMax(): number;
    abstract setSizeMax(max: number): void;
}

declare class DwellSpringAnimation {
    private displaySpring;
    private interval;
    private positionSpring;
    private readonly radius;
    private readonly handle;
    private readonly spring;
    constructor(handle: Readonly<EltRef<SVGCircleElement>>, spring: Readonly<EltRef<SVGLineElement>>);
    process(i: SrcTgtPointsData<PointData | TouchData>): void;
    end(): void;
}

declare abstract class Binder<C extends Command, I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> implements CmdBinder<C>, InteractionBinder<I, A, D>, InteractionCmdBinder<C, I, A, D> {
    protected firstFn?: (c: C, i: D, acc: A) => void;
    protected produceFn?: (i: D | undefined) => C;
    protected widgets: ReadonlyArray<unknown>;
    protected dynamicNodes: ReadonlyArray<Node>;
    protected usingFn?: () => I;
    protected hadEffectsFn?: (c: C, i: D, acc: A) => void;
    protected hadNoEffectFn?: (c: C, i: D, acc: A) => void;
    protected cannotExecFn?: (c: C, i: D, acc: A) => void;
    protected endFn?: (c: C, i: D, acc: A) => void;
    protected onErrFn?: (ex: unknown) => void;
    protected logLevels: ReadonlyArray<LogLevel>;
    protected stopPropagation: boolean;
    protected prevDefault: boolean;
    protected bindingName: string | undefined;
    protected observer: BindingsObserver | undefined;
    protected undoHistory: UndoHistoryBase;
    protected logger: Logger;
    protected whenFnArray: Array<When<D, A>>;
    protected firstFnArray: Array<(c: C, i: D, acc: A) => void>;
    protected endFnArray: Array<(c: C, i: D, acc: A) => void>;
    protected hadEffectsFnArray: Array<(c: C, i: D, acc: A) => void>;
    protected hadNoEffectFnArray: Array<(c: C, i: D, acc: A) => void>;
    protected cannotExecFnArray: Array<(c: C, i: D, acc: A) => void>;
    protected onErrFnArray: Array<(ex: unknown) => void>;
    protected accInit: A | undefined;
    protected linterRules: Map<RuleName, Severity>;
    protected constructor(undoHistory: UndoHistoryBase, logger: Logger, observer?: BindingsObserver, binder?: Partial<Binder<C, I, A, D>>, acc?: A);
    protected abstract duplicate(): Binder<C, I, A, D>;
    protected copyFnArrays(): void;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): Binder<C, I, A, D>;
    onDynamic(node: Widget<Node>): Binder<C, I, A, D>;
    first(fn: (c: C, i: D, acc: A) => void): Binder<C, I, A, D>;
    when(fn: (i: D, acc: Readonly<A>) => boolean, mode?: WhenType): Binder<C, I, A, D>;
    ifHadEffects(fn: (c: C, i: D, acc: A) => void): Binder<C, I, A, D>;
    ifHadNoEffect(fn: (c: C, i: D, acc: A) => void): Binder<C, I, A, D>;
    ifCannotExecute(fn: (c: C, i: D, acc: A) => void): Binder<C, I, A, D>;
    end(fn: (c: C, i: D, acc: A) => void): Binder<C, I, A, D>;
    log(...level: ReadonlyArray<LogLevel>): Binder<C, I, A, D>;
    stopImmediatePropagation(): Binder<C, I, A, D>;
    preventDefault(): Binder<C, I, A, D>;
    catch(fn: (ex: unknown) => void): Binder<C, I, A, D>;
    name(name: string): Binder<C, I, A, D>;
    configureRules(ruleName: RuleName, severity: Severity): Binder<C, I, A, D>;
    usingInteraction<I2 extends Interaction<D2>, A2, D2 extends InteractionData = InteractionDataType<I2>>(fn: () => I2): Binder<C, I2, A2, D2>;
    toProduce<C2 extends Command>(fn: (i: D) => C2): Binder<C2, I, A, D>;
    toProduceAnon(fn: () => void): Binder<Command, I, A, D>;
    abstract bind(): Binding<C, I, A, D>;
}

declare class UpdateBinder<C extends Command, I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> extends Binder<C, I, A, D> implements CmdUpdateBinder<C>, InteractionCmdUpdateBinder<C, I, A, D> {
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

declare class KeysBinder<C extends Command, I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> extends UpdateBinder<C, I, A, D> implements KeyInteractionCmdUpdateBinder<C, I, A, D> {
    private keysOrCodes;
    private isCode;
    constructor(undoHistory: UndoHistoryBase, logger: Logger, observer?: BindingsObserver, binder?: Partial<KeysBinder<C, I, A, D>>, acc?: A);
    private completeWhenWithKeysPredicates;
    with(isCode: boolean, ...keysOrCodes: ReadonlyArray<string>): KeysBinder<C, I, A, D>;
    on<W>(widget: ReadonlyArray<Widget<W>> | Widget<W>, ...widgets: ReadonlyArray<Widget<W>>): KeysBinder<C, I, A, D>;
    onDynamic(node: Widget<Node>): KeysBinder<C, I, A, D>;
    first(fn: (c: C, i: D, acc: A) => void): KeysBinder<C, I, A, D>;
    when(fn: (() => boolean) | ((i: D, acc: Readonly<A>) => boolean), mode?: WhenType): KeysBinder<C, I, A, D>;
    ifHadEffects(fn: (c: C, i: D, acc: A) => void): KeysBinder<C, I, A, D>;
    ifHadNoEffect(fn: (c: C, i: D, acc: A) => void): KeysBinder<C, I, A, D>;
    ifCannotExecute(fn: (c: C, i: D, acc: A) => void): KeysBinder<C, I, A, D>;
    end(fn: (c: C, i: D, acc: A) => void): KeysBinder<C, I, A, D>;
    log(...level: ReadonlyArray<LogLevel>): KeysBinder<C, I, A, D>;
    stopImmediatePropagation(): KeysBinder<C, I, A, D>;
    preventDefault(): KeysBinder<C, I, A, D>;
    then(fn: ((c: C, i: D, acc: A) => void) | ((c: C) => void)): KeysBinder<C, I, A, D>;
    continuousExecution(): KeysBinder<C, I, A, D>;
    throttle(timeout: number): KeysBinder<C, I, A, D>;
    cancel(fn: (i: D, acc: A) => void): KeysBinder<C, I, A, D>;
    endOrCancel(fn: (i: D, acc: A) => void): KeysBinder<C, I, A, D>;
    catch(fn: (ex: unknown) => void): KeysBinder<C, I, A, D>;
    name(name: string): KeysBinder<C, I, A, D>;
    configureRules(ruleName: RuleName, severity: Severity): KeysBinder<C, I, A, D>;
    toProduce<C2 extends Command>(fn: (i: D) => C2): KeysBinder<C2, I, A, D>;
    toProduceAnon(fn: () => void): KeysBinder<Command, I, A, D>;
    usingInteraction<I2 extends Interaction<D2>, A2, D2 extends InteractionData = InteractionDataType<I2>>(fn: () => I2): KeysBinder<C, I2, A2, D2>;
    protected duplicate(): KeysBinder<C, I, A, D>;
    bind(): Binding<C, I, A, D>;
}

declare class BindingImpl<C extends Command, I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> implements Binding<C, I, A, D> {
    protected _name: string | undefined;
    protected _timeEnded: number;
    protected _timeCancelled: number;
    protected _activated: boolean;
    protected readonly _interaction: I;
    accumulator: A;
    readonly linterRules: ReadonlyMap<RuleName, Severity>;
    protected _cmd: C | undefined;
    readonly continuousCmdExecution: boolean;
    protected readonly cmdProducer: (i?: D) => C;
    protected readonly cmdsProduced: Subject<C>;
    protected readonly accumulatorInit: A | undefined;
    protected undoHistory: UndoHistoryBase;
    protected logger: Logger;
    logBinding: boolean;
    logCmd: boolean;
    logUsage: boolean;
    constructor(continuousExecution: boolean, interaction: I, cmdProducer: (i?: D) => C, widgets: ReadonlyArray<unknown>, undoHistory: UndoHistoryBase, logger: Logger, linterRules: ReadonlyMap<RuleName, Severity>, name?: string, accInit?: A);
    private reinitAccumulator;
    get name(): string;
    protected whenStart(): boolean;
    protected whenUpdate(): boolean;
    protected whenStop(): boolean;
    clearEvents(): void;
    protected createCommand(): C | undefined;
    isWhenDefined(): boolean;
    catch(_err: unknown): void;
    first(): void;
    then(): void;
    end(): void;
    cancel(): void;
    endOrCancel(): void;
    ifCmdHadNoEffect(): void;
    ifCmdHadEffects(): void;
    ifCannotExecuteCmd(): void;
    get interaction(): I;
    get command(): C | undefined;
    get activated(): boolean;
    set activated(activated: boolean);
    get running(): boolean;
    protected fsmError(err: unknown): void;
    protected fsmCancels(): void;
    private cancelContinousWithEffectsCmd;
    protected fsmStarts(): void;
    protected fsmUpdates(): void;
    private continuousExecutionOnFSMUpdate;
    protected fsmStops(): void;
    private executeCommandOnFSMStop;
    private createAndInitCommand;
    private afterCmdExecuted;
    uninstallBinding(): void;
    get produces(): Observable<C>;
    get timesEnded(): number;
    get timesCancelled(): number;
    acceptVisitor(visitor: VisitorBinding): void;
}

declare class AnonBinding<C extends Command, I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> extends BindingImpl<C, I, A, D> {
    private readonly firstFn;
    private readonly thenFn;
    private readonly whenFn;
    private readonly cancelFn;
    private readonly endOrCancelFn;
    private readonly hadEffectsFn;
    private readonly hadNoEffectFn;
    private readonly cannotExecFn;
    private readonly onEndFn;
    private readonly onErrFn;
    constructor(continuousExec: boolean, interaction: I, undoHistory: UndoHistoryBase, logger: Logger, cmdSupplierFn: (d: D | undefined) => C, widgets: ReadonlyArray<unknown>, dynamicNodes: ReadonlyArray<Node>, loggers: ReadonlyArray<LogLevel>, timeoutThrottle: number, stopPropagation: boolean, prevDefault: boolean, linterRules: ReadonlyMap<RuleName, Severity>, firstFn?: (c: C, i: D, acc: A) => void, thenFn?: (c: C, i: D, acc: A) => void, whenFn?: Array<When<D, A>>, endFn?: (c: C, i: D, acc: A) => void, cancelFn?: (i: D, acc: A) => void, endOrCancelFn?: (i: D, acc: A) => void, hadEffectsFn?: (c: C, i: D, acc: A) => void, hadNoEffectFn?: (c: C, i: D, acc: A) => void, cannotExecFn?: (c: C, i: D, acc: A) => void, onErrFn?: (ex: unknown) => void, name?: string, accInit?: A);
    private configureLoggers;
    first(): void;
    then(): void;
    end(): void;
    cancel(): void;
    endOrCancel(): void;
    ifCmdHadNoEffect(): void;
    ifCmdHadEffects(): void;
    ifCannotExecuteCmd(): void;
    protected whenStart(): boolean;
    protected whenUpdate(): boolean;
    protected whenStop(): boolean;
    private whenChecker;
    private executeWhen;
    catch(err: unknown): void;
    isWhenDefined(): boolean;
}

declare class BindingsContext implements BindingsObserver {
    private readonly binds;
    private readonly disposables;
    private readonly cmds;
    readonly checker: Checker;
    constructor();
    observeBinding(binding: Binding<Command, Interaction<InteractionData>, unknown>): void;
    clearObservedBindings(): void;
    get bindings(): ReadonlyArray<Binding<Command, Interaction<InteractionData>, unknown>>;
    get commands(): ReadonlyArray<Command>;
    getCmd<C extends Command>(index: number): C | undefined;
    getCmdsProducedBy(binding: Binding<Command, Interaction<InteractionData>, unknown>): ReadonlyArray<Command>;
}

declare abstract class CommandBase implements Command {
    protected status: CmdStatus;
    constructor();
    flush(): void;
    protected createMemento(): void;
    execute(): Promise<boolean> | boolean;
    protected abstract execution(): Promise<void> | void;
    hadEffect(): boolean;
    done(): void;
    isDone(): boolean;
    cancel(): void;
    getStatus(): CmdStatus;
    canExecute(): boolean;
}

declare class Redo extends CommandBase {
    protected readonly history: UndoHistoryBase;
    constructor(undoHistory: UndoHistoryBase);
    canExecute(): boolean;
    protected execution(): void;
}

declare class Undo extends CommandBase {
    protected readonly history: UndoHistoryBase;
    constructor(undoHistory: UndoHistoryBase);
    canExecute(): boolean;
    protected execution(): void;
}

declare class BindingsImpl<H extends UndoHistoryBase> extends Bindings<H> {
    protected observer: BindingsObserver | undefined;
    protected readonly undoHistoryData: H;
    readonly logger: Logger;
    constructor(history: H, logger?: Logger);
    setLinterRules(...rules: ReadonlyArray<LinterRule>): void;
    get undoHistory(): H;
    nodeBinder<A>(accInit?: A): BaseUpdateBinder;
    buttonBinder<A>(accInit?: A): PartialButtonTypedBinder<A>;
    checkboxBinder<A>(accInit?: A): PartialInputTypedBinder<A>;
    colorPickerBinder<A>(accInit?: A): PartialInputTypedBinder<A>;
    comboBoxBinder<A>(accInit?: A): PartialSelectTypedBinder<A>;
    spinnerBinder<A>(accInit?: A): PartialSpinnerTypedBinder<A>;
    dateBinder<A>(accInit?: A): PartialInputTypedBinder<A>;
    hyperlinkBinder<A>(accInit?: A): PartialAnchorTypedBinder<A>;
    textInputBinder<A>(timeout?: number, accInit?: A): PartialTextInputTypedBinder<A>;
    touchDnDBinder<A>(cancellable: boolean, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    touchStartBinder<A>(accInit?: A): PartialTouchTypedBinder<A>;
    reciprocalTouchDnDBinder<A>(handle: EltRef<SVGCircleElement>, spring: EltRef<SVGLineElement>, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    reciprocalMouseOrTouchDnD<A>(handle: EltRef<SVGCircleElement>, spring: EltRef<SVGLineElement>, accInit?: A): PartialTouchMouseDnDTypedBinder<A>;
    multiTouchBinder<A>(nbTouches: number, accInit?: A): PartialMultiTouchTypedBinder<A>;
    twoTouchBinder<A>(accInit?: A): PartialTwoTouchTypedBinder<A>;
    threeTouchBinder<A>(accInit?: A): PartialThreeTouchTypedBinder<A>;
    fourTouchBinder<A>(accInit?: A): PartialFourTouchTypedBinder<A>;
    tapBinder<A>(nbTap: number, accInit?: A): PartialTapsTypedBinder<A>;
    longTouchBinder<A>(duration: number, accInit?: A): PartialTouchTypedBinder<A>;
    panBinder<A>(cancellable: boolean, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    panVerticalBinder<A>(pxTolerance: number, cancellable: boolean, minLength?: number, minVelocity?: number, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    panHorizontalBinder<A>(pxTolerance: number, cancellable: boolean, minLength?: number, minVelocity?: number, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    panLeftBinder<A>(pxTolerance: number, cancellable: boolean, minLength?: number, minVelocity?: number, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    panRightBinder<A>(pxTolerance: number, cancellable: boolean, minLength?: number, minVelocity?: number, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    panTopBinder<A>(pxTolerance: number, cancellable: boolean, minLength?: number, minVelocity?: number, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    panBottomBinder<A>(pxTolerance: number, cancellable: boolean, minLength?: number, minVelocity?: number, accInit?: A): PartialTouchSrcTgtTypedBinder<A>;
    twoPanVerticalBinder<A>(pxTolerance: number, minLength?: number, minVelocity?: number, accInit?: A): PartialTwoPanTypedBinder<A>;
    twoPanHorizontalBinder<A>(pxTolerance: number, minLength?: number, minVelocity?: number, accInit?: A): PartialTwoPanTypedBinder<A>;
    twoPanLeftBinder<A>(pxTolerance: number, minLength?: number, minVelocity?: number, accInit?: A): PartialTwoPanTypedBinder<A>;
    twoPanRightBinder<A>(pxTolerance: number, minLength?: number, minVelocity?: number, accInit?: A): PartialTwoPanTypedBinder<A>;
    twoPanTopBinder<A>(pxTolerance: number, minLength?: number, minVelocity?: number, accInit?: A): PartialTwoPanTypedBinder<A>;
    twoPanBottomBinder<A>(pxTolerance: number, minLength?: number, minVelocity?: number, accInit?: A): PartialTwoPanTypedBinder<A>;
    rotateBinder<A>(pxTolerance: number, accInit?: A): PartialRotateTypedBinder<A>;
    scaleBinder<A>(pxTolerance: number, accInit?: A): PartialScaleTypedBinder<A>;
    clickBinder<A>(accInit?: A): PartialPointTypedBinder<A>;
    dbleClickBinder<A>(accInit?: A): PartialUpdatePointTypedBinder<A>;
    mouseUpBinder<A>(accInit?: A): PartialPointTypedBinder<A>;
    mouseDownBinder<A>(accInit?: A): PartialPointTypedBinder<A>;
    longMouseDownBinder<A>(duration: number, accInit?: A): PartialUpdatePointTypedBinder<A>;
    clicksBinder<A>(nbClicks: number, accInit?: A): PartialPointsTypedBinder<A>;
    mouseLeaveBinder<A>(withBubbling: boolean, accInit?: A): PartialPointTypedBinder<A>;
    mouseEnterBinder<A>(withBubbling: boolean, accInit?: A): PartialPointTypedBinder<A>;
    mouseMoveBinder<A>(accInit?: A): PartialPointTypedBinder<A>;
    wheelBinder<A>(accInit?: A): PartialWheelTypedBinder<A>;
    scrollBinder<A>(accInit?: A): PartialScrollTypedBinder<A>;
    dndBinder<A>(cancellable: boolean, accInit?: A): PartialPointSrcTgtTypedBinder<A>;
    reciprocalDndBinder<A>(handle: EltRef<SVGCircleElement>, spring: EltRef<SVGLineElement>, accInit?: A): PartialPointSrcTgtTypedBinder<A>;
    dragLockBinder<A>(accInit?: A): PartialPointSrcTgtTypedBinder<A>;
    keyUpBinder<A>(modifierAccepted: boolean, accInit?: A): PartialKeyTypedBinder<A>;
    keyDownBinder<A>(modifierAccepted: boolean, accInit?: A): PartialKeyTypedBinder<A>;
    keysDownBinder<A>(accInit?: A): PartialKeysTypedBinder<A>;
    keysTypeBinder<A>(accInit?: A): PartialKeysTypedBinder<A>;
    keyTypeBinder<A>(accInit?: A): PartialKeyTypedBinder<A>;
    mouseDownOrTouchStartBinder<A>(accInit?: A): PartialPointOrTouchTypedBinder<A>;
    tapsOrClicksBinder<A>(nbTap: number, accInit?: A): PartialPointsOrTapsTypedBinder<A>;
    longpressOrTouchBinder<A>(duration: number, accInit?: A): PartialPointOrTouchTypedBinder<A>;
    combine<IX extends Array<Interaction<InteractionData>>, A>(interactions: IX, accInit?: A): PartialThenBinder<IX, A>;
    undoRedoBinder(undo: Widget<HTMLButtonElement>, redo: Widget<HTMLButtonElement>, catchFn?: ((err: unknown) => void)): [
        Binding<Undo, Interaction<WidgetData<HTMLButtonElement>>, unknown>,
        Binding<Redo, Interaction<WidgetData<HTMLButtonElement>>, unknown>
    ];
    clear(): void;
    setBindingObserver(obs?: BindingsObserver): void;
    acceptVisitor(visitor: VisitorBinding): void;
}

declare class MustBeUndoableCmdError extends Error {
    constructor(cmdProducer: unknown);
}

declare class CheckerImpl implements Checker {
    private readonly linterRules;
    private readonly cacheIncluded;
    constructor();
    setLinterRules(...rules: ReadonlyArray<LinterRule>): void;
    checkRules(binding: Binding<Command, Interaction<InteractionData>, unknown>, binds: ReadonlyArray<Binding<Command, Interaction<InteractionData>, unknown>>): void;
    checkSameInteractions(binding: Binding<Command, Interaction<InteractionData>, unknown>, binds: ReadonlyArray<Binding<Command, Interaction<InteractionData>, unknown>>): void;
    checkSameData(binding: Binding<Command, Interaction<InteractionData>, unknown>, binds: ReadonlyArray<Binding<Command, Interaction<InteractionData>, unknown>>): void;
    checkIncluded(binding: Binding<Command, Interaction<InteractionData>, unknown>, binds: ReadonlyArray<Binding<Command, Interaction<InteractionData>, unknown>>): void;
    private checkRule;
    private isIncluded;
    private getSameDataSeverity;
    private getSameInteractionSeverity;
    private getIncludedSeverity;
    private isWidgetSetsIntersecting;
    private printLinterMsg;
    private fillCacheIncluded;
}

declare class AnonCmd extends CommandBase {
    private readonly exec;
    constructor(fct: () => void);
    canExecute(): boolean;
    protected execution(): void;
}

declare abstract class UndoableCommand extends CommandBase implements Undoable {
    getUndoName(): string;
    getVisualSnapshot(): UndoableSnapshot;
    abstract redo(): void;
    abstract undo(): void;
}

declare class FocusHTMLElement extends CommandBase {
    private readonly element;
    constructor(elt: unknown);
    protected execution(): void;
    canExecute(): boolean;
}

declare class RedoNTimes extends CommandBase {
    protected readonly history: UndoHistory;
    protected readonly numberOfRedos: number;
    constructor(undoHistory: UndoHistory, numberOfRedos: number);
    canExecute(): boolean;
    protected execution(): void;
}

declare class SetProperty<T, S extends keyof T> extends UndoableCommand {
    protected readonly obj: T;
    protected readonly prop: S;
    newvalue: T[S];
    protected mementoValue: T[S] | undefined;
    constructor(obj: T, prop: S, newvalue: T[S]);
    protected createMemento(): void;
    protected execution(): void;
    redo(): void;
    undo(): void;
    getUndoName(): string;
}

declare class SetProperties<T> extends UndoableCommand {
    readonly obj: T;
    protected _newvalues: Partial<T>;
    readonly compositeCmds: Array<SetProperty<T, keyof T>>;
    constructor(obj: T, newvalues: Partial<T>);
    get newvalues(): Partial<T>;
    set newvalues(value: Partial<T>);
    execute(): Promise<boolean> | boolean;
    protected execution(): void;
    redo(): void;
    undo(): void;
}

declare class TransferArrayItem<T> extends UndoableCommand {
    protected _srcArray: Array<T>;
    protected _tgtArray: Array<T>;
    protected _srcIndex: number;
    protected _tgtIndex: number;
    protected readonly cmdName: string;
    constructor(srcArray: Array<T>, tgtArray: Array<T>, srcIndex: number, tgtIndex: number, cmdName: string);
    protected execution(): void;
    canExecute(): boolean;
    getUndoName(): string;
    redo(): void;
    undo(): void;
    get srcArray(): Array<T>;
    set srcArray(value: Array<T>);
    get tgtArray(): Array<T>;
    set tgtArray(value: Array<T>);
    get srcIndex(): number;
    set srcIndex(value: number);
    get tgtIndex(): number;
    set tgtIndex(value: number);
}

declare class UndoNTimes extends CommandBase {
    protected readonly history: UndoHistory;
    protected readonly numberOfUndos: number;
    constructor(undoHistory: UndoHistory, numberOfUndos: number);
    canExecute(): boolean;
    protected execution(): void;
}

declare abstract class TransitionBase<E extends Event> implements Transition<E> {
    readonly src: OutputState;
    readonly tgt: InputState;
    readonly action: (evt: E) => void;
    readonly guard: (evt: E) => boolean;
    protected constructor(srcState: OutputState, tgtState: InputState, action?: (evt: E) => void, guard?: (evt: E) => boolean);
    execute(event: Event): InputState | undefined;
    abstract accept(event: Event): event is E;
    acceptVisitor(visitor: VisitorFSM): void;
    abstract getAcceptedEvents(): ReadonlySet<EventType>;
    get target(): InputState;
    uninstall(): void;
}

declare class BoxCheckPressedTransition extends TransitionBase<InputEvent> {
    private static readonly acceptedEvents;
    constructor(srcState: OutputState, tgtState: InputState, action?: (evt: InputEvent) => void, guard?: (evt: InputEvent) => boolean);
    accept(event: Event): event is InputEvent;
    getAcceptedEvents(): ReadonlySet<EventType>;
}

declare class ButtonPressedTransition extends TransitionBase<InputEvent> {
    private static readonly acceptedEvents;
    constructor(srcState: OutputState, tgtState: InputState, action?: (evt: InputEvent) => void, guard?: (evt: InputEvent) => boolean);
    accept(evt: Event): evt is InputEvent;
    getAcceptedEvents(): ReadonlySet<EventType>;
}

declare class CancelFSMError extends Error {
    constructor();
}

declare abstract class StateBase implements State {
    readonly fsm: FSM;
    readonly name: string;
    protected constructor(stateMachine: FSM, stateName: string);
    checkStartingState(): void;
    uninstall(): void;
    abstract acceptVisitor(visitor: VisitorFSM): void;
}

declare class CancellingState extends StateBase implements InputState {
    constructor(stateMachine: FSM, stateName: string);
    enter(): void;
    uninstall(): void;
    acceptVisitor(visitor: VisitorFSM): void;
}

declare class MouseTransition extends TransitionBase<MouseEvent> {
    private readonly acceptedEvents;
    constructor(srcState: OutputState, tgtState: InputState, types: MouseEventType | ReadonlyArray<MouseEventType>, action?: (evt: MouseEvent) => void, guard?: (evt: MouseEvent) => boolean);
    accept(event: Event): event is MouseEvent;
    getAcceptedEvents(): ReadonlySet<EventType>;
}

declare class ClickTransition extends MouseTransition {
    constructor(srcState: OutputState, tgtState: InputState, action?: (evt: MouseEvent) => void, guard?: (evt: MouseEvent) => boolean);
}

declare class ColorPickedTransition extends TransitionBase<Event> {
    private static readonly acceptedEvents;
    constructor(srcState: OutputState, tgtState: InputState, action?: (evt: Event) => void, guard?: (evt: Event) => boolean);
    accept(event: Event): event is Event;
    getAcceptedEvents(): ReadonlySet<EventType>;
}

declare class ComboBoxTransition extends TransitionBase<Event> {
    private static readonly acceptedEvents;
    constructor(srcState: OutputState, tgtState: InputState, action?: (evt: Event) => void, guard?: (evt: Event) => boolean);
    accept(event: Event): event is Event;
    getAcceptedEvents(): ReadonlySet<EventType>;
}

declare abstract class OutputStateBase extends StateBase implements OutputState {
    protected readonly _transitions: Array<Transition<Event>>;
    protected constructor(stateMachine: FSM, stateName: string);
    process(event: Event): boolean;
    clearTransitions(): void;
    get transitions(): ReadonlyArray<Transition<Event>>;
    addTransition(tr: Transition<Event>): void;
    abstract exit(): void;
    uninstall(): void;
}

declare class InitState extends OutputStateBase {
    constructor(stateMachine: FSM, stateName: string);
    exit(): void;
    acceptVisitor(visitor: VisitorFSM): void;
}

declare class StdState extends OutputStateBase implements InputState {
    constructor(stateMachine: FSM, stateName: string);
    enter(): void;
    exit(): void;
    acceptVisitor(visitor: VisitorFSM): void;
}

declare class TerminalState extends StateBase implements InputState {
    constructor(stateMachine: FSM, stateName: string);
    enter(): void;
    acceptVisitor(visitor: VisitorFSM): void;
}

declare class TimeoutTransition extends TransitionBase<Event> {
    private readonly timeoutDuration;
    private readonly logger;
    private timeoutThread;
    private timeouted;
    constructor(srcState: OutputState, tgtState: InputState, timeout: () => number, logger?: Logger, action?: (evt: Event) => void);
    startTimeout(): void;
    stopTimeout(): void;
    accept(_event?: Event): _event is Event;
    execute(event?: Event): InputState | undefined;
    getAcceptedEvents(): ReadonlySet<EventType>;
    acceptVisitor(visitor: VisitorFSM): void;
}

interface FSMDataHandler {
    reinitData(): void;
}

declare class FSMImpl<T extends FSMDataHandler> implements FSM {
    protected _dataHandler: T | undefined;
    protected readonly logger: Logger;
    _log: boolean;
    inner: boolean;
    startingState: State;
    protected _started: boolean;
    readonly initState: InitState;
    protected _currentState: OutputState;
    protected readonly currentStatePublisher: Subject<[OutputState, OutputState]>;
    protected readonly _states: Array<State>;
    protected readonly handlers: Array<FSMHandler>;
    protected readonly eventsToProcess: Array<Event>;
    protected currentTimeout: TimeoutTransition | undefined;
    currentSubFSM: FSM | undefined;
    constructor(logger: Logger, dataHandler?: T);
    get currentState(): OutputState;
    set currentState(state: OutputState);
    get currentStateObservable(): Observable<[OutputState, OutputState]>;
    process(event: Event): boolean;
    private processEvent;
    acceptVisitor(visitor: VisitorFSM): void;
    get log(): boolean;
    set log(log: boolean);
    get dataHandler(): T | undefined;
    set dataHandler(dataHandler: T | undefined);
    private removeKeyEvent;
    enterStdState(state: InputState & OutputState): void;
    get started(): boolean;
    protected processRemainingEvents(): void;
    addRemaningEventsToProcess(event: Event): void;
    onError(err: unknown): void;
    onTerminating(): void;
    onCancelling(): void;
    onStarting(): void;
    onUpdating(): void;
    addStdState(name: string, startingState?: boolean): StdState;
    addTerminalState(name: string, startingState?: boolean): TerminalState;
    addCancellingState(name: string): CancellingState;
    private addState;
    reinit(): void;
    fullReinit(): void;
    onTimeout(): void;
    stopCurrentTimeout(): void;
    protected checkTimeoutTransition(): void;
    addHandler(handler: FSMHandler): void;
    removeHandler(handler: FSMHandler): void;
    protected notifyHandlerOnStart(): void;
    protected notifyHandlerOnUpdate(): void;
    notifyHandlerOnStop(): void;
    protected notifyHandlerOnCancel(): void;
    protected notifyHandlerOnError(err: unknown): void;
    get states(): ReadonlyArray<State>;
    getEventsToProcess(): ReadonlyArray<Event>;
    uninstall(): void;
}

declare class ConcurrentAndFSM<F extends FSM, T extends FSMDataHandler> extends FSMImpl<T> implements ConcurrentFSM<F> {
    private readonly _conccurFSMs;
    private readonly _secondaryFSMs;
    private readonly totalReinit;
    constructor(fsms: ReadonlyArray<F>, logger: Logger, secondaries?: ReadonlyArray<F>, totalReinit?: boolean, dataHandler?: T);
    getAllConccurFSMs(): ReadonlyArray<F>;
    get conccurFSMs(): ReadonlyArray<F>;
    get secondaryFSMs(): ReadonlyArray<FSM>;
    process(event: Event): boolean;
    acceptVisitor(visitor: VisitorFSM): void;
    get started(): boolean;
    set log(log: boolean);
    uninstall(): void;
    fullReinit(): void;
}

declare class ConcurrentXOrFSM<F extends FSM, T extends FSMDataHandler> extends FSMImpl<T> implements ConcurrentFSM<F> {
    private readonly _conccurFSMs;
    constructor(fsms: ReadonlyArray<F>, logger: Logger, dataHandler?: T);
    process(event: Event): boolean;
    getAllConccurFSMs(): ReadonlyArray<F>;
    get started(): boolean;
    set log(log: boolean);
    uninstall(): void;
    fullReinit(): void;
    reinit(): void;
    acceptVisitor(visitor: VisitorFSM): void;
}

declare class DatePickedTransition extends TransitionBase<Event> {
    private static readonly acceptedEvents;
    constructor(srcState: OutputState, tgtState: InputState, action?: (evt: Event) => void, guard?: (evt: Event) => boolean);
    accept(event: Event): event is Event;
    getAcceptedEvents(): ReadonlySet<EventType>;
}

declare class KeyTransition extends TransitionBase<KeyboardEvent> {
    private readonly acceptedEvents;
    constructor(srcState: OutputState, tgtState: InputState, keyType: KeyEventType, action?: (evt: KeyboardEvent) => void, guard?: (evt: KeyboardEvent) => boolean);
    accept(event: Event): event is KeyboardEvent;
    getAcceptedEvents(): ReadonlySet<EventType>;
}

declare class EscapeKeyPressureTransition extends KeyTransition {
    constructor(srcState: OutputState, tgtState: InputState, action?: (evt: KeyboardEvent) => void);
}

declare function getTouch(touches: TouchList, idToFind?: number): Touch | undefined;
declare function isButton(target: EventTarget): target is HTMLButtonElement;
declare function isCheckBox(target: EventTarget): target is HTMLInputElement;
declare function isColorChoice(target: EventTarget): target is HTMLInputElement;
declare function isComboBox(target: EventTarget): target is HTMLSelectElement;
declare function isDatePicker(target: EventTarget): target is HTMLInputElement;
declare function isSpinner(target: EventTarget): target is HTMLInputElement;
declare function isHyperLink(target: EventTarget): target is HTMLAnchorElement;
declare function isTextInput(target: EventTarget): target is HTMLInputElement | HTMLTextAreaElement;
declare function isKeyDownEvent(event: Event): event is KeyboardEvent;
declare function isKeyUpEvent(event: Event): event is KeyboardEvent;
declare enum KeyCode {
    escape = 27
}

declare class HyperLinkTransition extends TransitionBase<Event> {
    private static readonly acceptedEvents;
    constructor(srcState: OutputState, tgtState: InputState, action?: (evt: Event) => void, guard?: (evt: Event) => boolean);
    accept(event: Event): event is Event;
    getAcceptedEvents(): ReadonlySet<EventType>;
}

declare class NotFSM<H extends FSMDataHandler> extends ConcurrentAndFSM<FSM, H> {
    private readonly mainFSM;
    constructor(mainFSM: FSM, negFSM: FSM, logger: Logger);
}

declare class ScrollTransition extends TransitionBase<Event> {
    private static readonly acceptedEvents;
    constructor(srcState: OutputState, tgtState: InputState, action?: (evt: Event) => void, guard?: (evt: Event) => boolean);
    accept(event: Event): event is Event;
    getAcceptedEvents(): ReadonlySet<EventType>;
}

declare class SpinnerChangedTransition extends TransitionBase<Event> {
    private static readonly acceptedEvents;
    constructor(srcState: OutputState, tgtState: InputState, action?: (evt: Event) => void, guard?: (evt: Event) => boolean);
    accept(event: Event): event is Event;
    getAcceptedEvents(): ReadonlySet<EventType>;
}

declare class SubFSMTransition extends TransitionBase<Event> {
    private readonly subFSM;
    private readonly subFSMHandler;
    private subStateSubscription?;
    constructor(srcState: OutputState, tgtState: InputState, fsm: FSM, action?: (evt: Event) => void);
    private setUpFSMHandler;
    private unsetFSMHandler;
    private cancelsFSM;
    execute(event: Event): InputState | undefined;
    accept(event: Event): event is Event;
    private findTransition;
    getAcceptedEvents(): ReadonlySet<EventType>;
    uninstall(): void;
}

declare class TextInputChangedTransition extends TransitionBase<Event> {
    private static readonly acceptedEvents;
    constructor(srcState: OutputState, tgtState: InputState, action?: (evt: Event) => void, guard?: (evt: Event) => boolean);
    accept(event: Event): event is Event;
    getAcceptedEvents(): ReadonlySet<EventType>;
}

declare class ThenFSM<T extends FSMDataHandler> extends FSMImpl<T> {
    constructor(fsms: Array<FSM>, logger: Logger);
}

declare class TouchTransition extends TransitionBase<TouchEvent> {
    private readonly acceptedEvents;
    constructor(srcState: OutputState, tgtState: InputState, eventType: TouchEventType, action?: (evt: TouchEvent) => void, guard?: (evt: TouchEvent) => boolean);
    accept(evt: Event): evt is TouchEvent;
    getAcceptedEvents(): ReadonlySet<EventType>;
}

declare class VisitorFSMDepthFirst implements VisitorFSM {
    private readonly visited;
    constructor();
    visitAndConcurrentFSM(fsm: ConcurrentFSM<FSM>): void;
    visitXOrConcurrentFSM(fsm: ConcurrentFSM<FSM>): void;
    visitInitState(state: OutputState & State): void;
    visitState(state: OutputState & State): void;
    visitCancellingState(_state: InputState & State): void;
    visitTerminalState(_state: InputState & State): void;
    visitFSM(fsm: FSM): void;
    visitTransition(transition: Transition<Event>): void;
    visitTimeoutTransition(transition: Transition<Event>): void;
    clear(): void;
    protected alreadyVisited(state: State): boolean;
}

declare class WheelTransition extends TransitionBase<WheelEvent> {
    private static readonly acceptedEvents;
    constructor(srcState: OutputState, tgtState: InputState, action?: (evt: WheelEvent) => void, guard?: (evt: WheelEvent) => boolean);
    accept(event: Event): event is WheelEvent;
    getAcceptedEvents(): ReadonlySet<EventType>;
}

interface Flushable {
    flush(): void;
}

interface CancellablePromise extends Promise<void> {
    cancel: () => void;
}
type InteractionDataImplType<T> = T extends InteractionBase<any, infer DImpl, any> ? DImpl : never;
declare abstract class InteractionBase<D extends InteractionData, DImpl extends D & Flushable, F extends FSM> implements Interaction<D> {
    protected readonly _registeredNodes: Set<unknown>;
    protected readonly _dynamicRegisteredNodes: Set<unknown>;
    protected readonly _fsm: F;
    protected readonly _name: string;
    protected _log: boolean;
    protected readonly mutationObservers: Array<MutationObserver>;
    protected readonly _data: DImpl;
    protected readonly logger: Logger;
    private mouseHandler?;
    private touchHandler?;
    private keyHandler?;
    private uiHandler?;
    private actionHandler?;
    private readonly disposable;
    private stopImmediatePropag;
    private preventDef;
    protected activated: boolean;
    protected throttleTimeout: number;
    protected currentThrottling: CancellablePromise | undefined;
    protected latestThrottledEvent: Event | undefined;
    protected constructor(fsm: F, data: DImpl, logger: Logger, name: string);
    reinitData(): void;
    get data(): D;
    get name(): string;
    setThrottleTimeout(timeout: number): void;
    private createThrottleTimeout;
    private checkThrottlingEvent;
    protected updateEventsRegistered(newState: OutputState, oldState: OutputState): void;
    protected getCurrentAcceptedEvents(state: OutputState): ReadonlyArray<EventType>;
    private callBackMutationObserver;
    protected getEventTypesOf(state: OutputState): ReadonlySet<EventType>;
    registerToNodes(widgets: ReadonlyArray<unknown>): void;
    protected unregisterFromNodes(widgets: ReadonlyArray<unknown>): void;
    onNodeUnregistered(node: unknown): void;
    onNewNodeRegistered(node: unknown): void;
    registerToNodeChildren(elementToObserve: Node): void;
    protected registerEventToNode(eventType: EventType, node: unknown): void;
    protected unregisterEventToNode(eventType: EventType, node: unknown): void;
    protected registerActionHandlerClick(node: EventTarget): void;
    protected unregisterActionHandlerClick(node: EventTarget): void;
    protected registerActionHandlerInput(node: EventTarget): void;
    protected unregisterActionHandlerInput(node: EventTarget): void;
    protected getActionHandler(): EventListener;
    protected getMouseHandler(): EventListener;
    protected getTouchHandler(): EventListener;
    protected getKeyHandler(): EventListener;
    protected getUIHandler(): EventListener;
    isRunning(): boolean;
    fullReinit(): void;
    set stopImmediatePropagation(stop: boolean);
    get stopImmediatePropagation(): boolean;
    set preventDefault(prevent: boolean);
    get preventDefault(): boolean;
    processEvent(event: Event): void;
    private directEventProcess;
    log(log: boolean): void;
    isActivated(): boolean;
    setActivated(activated: boolean): void;
    get fsm(): F;
    reinit(): void;
    uninstall(): void;
    acceptVisitor(visitor: VisitorInteraction): void;
    get registeredNodes(): ReadonlySet<unknown>;
    get dynamicRegisteredNodes(): ReadonlySet<unknown>;
}

declare abstract class ConcurrentInteraction<D extends InteractionData, DImpl extends D & Flushable, F extends ConcurrentFSM<FSM>> extends InteractionBase<D, DImpl, F> {
    private readonly subscriptions;
    protected constructor(fsm: F, data: DImpl, logger: Logger, name: string);
    isRunning(): boolean;
    onNodeUnregistered(node: EventTarget): void;
    onNewNodeRegistered(node: EventTarget): void;
    getCurrentAcceptedEvents(_state?: OutputState): ReadonlyArray<EventType>;
    uninstall(): void;
}

declare abstract class SrcTgtDataBase<T extends PointBaseData, S extends Flushable & T> implements SrcTgtPointsData<T> {
    protected readonly srcData: S;
    protected readonly tgtData: S;
    protected constructor(src: S, tgt: S);
    get src(): T;
    get tgt(): T;
    get diffClientX(): number;
    get diffClientY(): number;
    get diffPageX(): number;
    get diffPageY(): number;
    get diffScreenX(): number;
    get diffScreenY(): number;
    get duration(): number;
    velocity(direction: "all" | "horiz" | "vert"): number;
    isHorizontal(pxTolerance: number): boolean;
    isVertical(pxTolerance: number): boolean;
    isLeft(pxTolerance: number): boolean;
    isRight(pxTolerance: number): boolean;
    isTop(pxTolerance: number): boolean;
    isBottom(pxTolerance: number): boolean;
    flush(): void;
}

declare abstract class InteractionDataBase implements UnitInteractionData, Flushable {
    protected currentTargetData: EventTarget | null;
    protected targetData: EventTarget | null;
    protected timeStampData: number;
    copy(data: UnitInteractionData): void;
    flush(): void;
    get currentTarget(): EventTarget | null;
    get target(): EventTarget | null;
    get timeStamp(): number;
}

declare abstract class PointingDataBase extends InteractionDataBase implements PointBaseData {
    protected clientXData: number;
    protected clientYData: number;
    protected pageXData: number;
    protected pageYData: number;
    protected screenXData: number;
    protected screenYData: number;
    protected altKeyData: boolean;
    protected ctrlKeyData: boolean;
    protected metaKeyData: boolean;
    protected shiftKeyData: boolean;
    flush(): void;
    copy(data: PointBaseData): void;
    get clientX(): number;
    get clientY(): number;
    get pageX(): number;
    get pageY(): number;
    get screenX(): number;
    get screenY(): number;
    get altKey(): boolean;
    get ctrlKey(): boolean;
    get metaKey(): boolean;
    get shiftKey(): boolean;
}

declare class TouchDataImpl extends PointingDataBase implements TouchData {
    private _allTouches;
    private forceData;
    private identifierData;
    private radiusXData;
    private radiusYData;
    private rotationAngleData;
    get allTouches(): ReadonlyArray<TouchData>;
    get force(): number;
    get identifier(): number;
    get radiusX(): number;
    get radiusY(): number;
    get rotationAngle(): number;
    copy(data: TouchData): void;
    flush(): void;
    static mergeTouchEventData(touch: Touch, evt: EventModifierData & UnitInteractionData, allTouches: Array<Touch>): TouchData;
    toPointData(): PointData;
}

declare class SrcTgtTouchDataImpl extends SrcTgtDataBase<TouchData, TouchDataImpl> {
    constructor();
    copySrc(data: Touch, evt: EventModifierData & UnitInteractionData, allTouches: Array<Touch>): void;
    copyTgt(data: Touch, evt: EventModifierData & UnitInteractionData, allTouches: Array<Touch>): void;
}

declare abstract class MultiTouchDataBase implements MultiTouchData {
    abstract readonly touches: ReadonlyArray<SrcTgtPointsData<TouchData>>;
    velocity(direction: "all" | "horiz" | "vert"): number;
}
declare class MultiTouchDataImpl extends MultiTouchDataBase implements Flushable {
    protected readonly touchesData: Map<number, SrcTgtTouchDataImpl>;
    constructor();
    get touches(): ReadonlyArray<SrcTgtPointsData<TouchData>>;
    addTouchData(data: SrcTgtTouchDataImpl): void;
    removeTouchData(id: number): void;
    flush(): void;
    setTouch(tp: Touch, evt: TouchEvent): void;
    isHorizontal(pxTolerance: number): boolean;
    isVertical(pxTolerance: number): boolean;
}

declare abstract class TwoTouchDataImpl extends MultiTouchDataBase implements TwoTouchData {
    protected readonly t1: SrcTgtTouchDataImpl;
    protected readonly t2: SrcTgtTouchDataImpl;
    protected constructor();
    get touch1(): SrcTgtPointsData<TouchData>;
    get touch2(): SrcTgtPointsData<TouchData>;
    get touches(): ReadonlyArray<SrcTgtPointsData<TouchData>>;
    flush(): void;
    initTouch(data: Touch, evt: EventModifierData & UnitInteractionData, allTouches: Array<Touch>): void;
    copyTouch(data: Touch, evt: EventModifierData & UnitInteractionData, allTouches: Array<Touch>): void;
    get diffClientX(): number;
    get diffClientY(): number;
    get diffPageX(): number;
    get diffPageY(): number;
    get diffScreenX(): number;
    get diffScreenY(): number;
}

declare class GeneralTwoTouchDataImpl extends TwoTouchDataImpl implements GeneralTwoTouchData {
    private readonly rotateData;
    private readonly panData;
    private readonly scaleData;
    constructor();
    isVertical(pxTolerance: number): boolean;
    isHorizontal(pxTolerance: number): boolean;
    isLeft(pxTolerance: number): boolean;
    isRight(pxTolerance: number): boolean;
    isTop(pxTolerance: number): boolean;
    isBottom(pxTolerance: number): boolean;
    get rotationAngle(): number;
    scalingRatio(pxTolerance: number): number;
}

declare class ThreeTouchDataImpl extends GeneralTwoTouchDataImpl implements ThreeTouchData {
    protected readonly t3: SrcTgtTouchDataImpl;
    constructor();
    get touch3(): SrcTgtPointsData<TouchData>;
    flush(): void;
    initTouch(data: Touch, evt: EventModifierData & UnitInteractionData, allTouches: Array<Touch>): void;
    copyTouch(data: Touch, evt: EventModifierData & UnitInteractionData, allTouches: Array<Touch>): void;
    isLeft(pxTolerance: number): boolean;
    isRight(pxTolerance: number): boolean;
    isTop(pxTolerance: number): boolean;
    isBottom(pxTolerance: number): boolean;
}

declare class FourTouchDataImpl extends ThreeTouchDataImpl implements FourTouchData {
    private readonly t4;
    constructor();
    get touch4(): SrcTgtPointsData<TouchData>;
    initTouch(data: Touch, evt: EventModifierData & UnitInteractionData, allTouches: Array<Touch>): void;
    copyTouch(data: Touch, evt: EventModifierData & UnitInteractionData, allTouches: Array<Touch>): void;
    flush(): void;
    isLeft(pxTolerance: number): boolean;
    isRight(pxTolerance: number): boolean;
    isTop(pxTolerance: number): boolean;
    isBottom(pxTolerance: number): boolean;
}

declare class InteractionBuilderImpl<I extends Interaction<D>, D extends InteractionData = InteractionDataType<I>> implements InteractionBuilder<I, D> {
    private readonly iCtor;
    private startPredicate;
    private thenPredicate;
    private endPredicate;
    private interactionName;
    constructor(interactionSupplier: (name?: string) => I);
    first(predicate: (i: D) => boolean): this;
    then(predicate: (i: D) => boolean): this;
    firstAndThen(predicate: (i: D) => boolean): this;
    end(predicate: (i: D) => boolean): this;
    name(name: string): this;
    build(): () => I;
    private process;
}

declare class KeyDataImpl extends InteractionDataBase implements KeyData, Flushable {
    private codeData;
    private keyData;
    private locationData;
    private repeatData;
    private altKeyData;
    private ctrlKeyData;
    private metaKeyData;
    private shiftKeyData;
    flush(): void;
    copy(data: KeyData): void;
    get altKey(): boolean;
    get code(): string;
    get ctrlKey(): boolean;
    get key(): string;
    get location(): number;
    get metaKey(): boolean;
    get repeat(): boolean;
    get shiftKey(): boolean;
}

declare class KeysDataImpl implements KeysData, Flushable {
    private readonly keysData;
    flush(): void;
    get keys(): ReadonlyArray<KeyData>;
    addKey(key: KeyData): void;
}

declare abstract class PointsDataImpl<D extends PointBaseData> implements PointsData<D> {
    protected readonly pointsData: Array<D>;
    constructor();
    get points(): ReadonlyArray<D>;
    addPoint(ptData: D): void;
    flush(): void;
}

declare class MousePointsDataImpl extends PointsDataImpl<PointData> {
    private currentPositionData;
    constructor();
    get currentPosition(): PointData | undefined;
    set currentPosition(position: PointData | undefined);
    get lastButton(): number | undefined;
    flush(): void;
}

declare class Not<I extends InteractionBase<DI & InteractionData, DI & DImpl & Flushable, FSM>, N extends Interaction<InteractionData>, DI = InteractionDataType<I>, DImpl = InteractionDataImplType<I>> extends ConcurrentInteraction<DI & InteractionData, DI & DImpl & Flushable, NotFSM<FSMDataHandler>> {
    private readonly mainInteraction;
    private readonly negInteraction;
    constructor(i1: I, not: N, logger: Logger, name: string);
    uninstall(): void;
    reinit(): void;
    fullReinit(): void;
    reinitData(): void;
}

declare class Or<I1 extends InteractionBase<D1, D1Impl, FSM>, I2 extends InteractionBase<D2, D2Impl, FSM>, D1 extends InteractionData = InteractionDataType<I1>, D2 extends InteractionData = InteractionDataType<I2>, D1Impl extends D1 & Flushable = InteractionDataImplType<I1>, D2Impl extends D2 & Flushable = InteractionDataImplType<I2>> extends ConcurrentInteraction<D1 | D2, D1Impl | D2Impl, ConcurrentXOrFSM<FSM, FSMDataHandler>> {
    private readonly i1;
    private readonly i2;
    constructor(i1: I1, i2: I2, logger: Logger);
    get data(): D1 | D2;
    uninstall(): void;
    reinit(): void;
    fullReinit(): void;
    reinitData(): void;
}

declare class PointDataImpl extends PointingDataBase implements PointData {
    protected buttonData: number;
    protected buttonsData: number;
    protected movementXData: number;
    protected movementYData: number;
    protected offsetXData: number;
    protected offsetYData: number;
    protected relatedTargetData: EventTarget | null;
    flush(): void;
    copy(data: PointData): void;
    get button(): number;
    get buttons(): number;
    get movementX(): number;
    get movementY(): number;
    get offsetX(): number;
    get offsetY(): number;
    get relatedTarget(): EventTarget | null;
}

declare class RotationTouchDataImpl extends TwoTouchDataImpl implements RotationTouchData {
    constructor();
    get rotationAngle(): number;
    private computeAngle;
}

declare class ScaleTouchDataImpl extends TwoTouchDataImpl implements ScaleTouchData {
    constructor();
    scalingRatio(pxTolerance: number): number;
    static project(vector1: [number, number], vector2: [number, number]): number;
    static distance(point1: [number, number], point2: [number, number]): number;
}

declare class ScrollDataImpl extends InteractionDataBase implements ScrollData, Flushable {
    protected scrollXData: number;
    protected scrollYData: number;
    flush(): void;
    get scrollX(): number;
    get scrollY(): number;
    setScrollData(event: Event): void;
}

declare class SrcTgtPointsDataImpl extends SrcTgtDataBase<PointData, PointDataImpl> {
    constructor();
    copySrc(data: PointData): void;
    copyTgt(data: PointData): void;
}

declare class TapDataImpl extends PointsDataImpl<TouchData> {
    constructor();
    get lastId(): number | undefined;
}

declare class ThenDataImpl<DX extends Array<Flushable>> implements ThenData<DX>, Flushable {
    readonly dx: DX;
    constructor(dx: DX);
    flush(): void;
}

declare class Then<IX extends Array<Interaction<InteractionData>>, DX extends Array<InteractionData> = InteractionsDataTypes<IX>> extends InteractionBase<ThenData<DX>, ThenDataImpl<Array<Flushable> & DX>, FSM> {
    private readonly ix;
    constructor(ix: IX, logger: Logger);
    uninstall(): void;
    reinit(): void;
    fullReinit(): void;
    reinitData(): void;
}

declare class TwoPanDataImpl extends TwoTouchDataImpl implements LineTouchData {
    constructor();
    isVertical(pxTolerance: number): boolean;
    isHorizontal(pxTolerance: number): boolean;
    isLeft(pxTolerance: number): boolean;
    isRight(pxTolerance: number): boolean;
    isTop(pxTolerance: number): boolean;
    isBottom(pxTolerance: number): boolean;
}

declare class WheelDataImpl extends PointDataImpl implements WheelData {
    private deltaModeData;
    private deltaXData;
    private deltaYData;
    private deltaZData;
    flush(): void;
    copy(data: WheelData): void;
    get deltaMode(): number;
    get deltaX(): number;
    get deltaY(): number;
    get deltaZ(): number;
}

declare class WidgetDataImpl<T> extends InteractionDataBase implements WidgetData<T>, Flushable {
    get widget(): T | undefined;
}

declare class BoxCheckedFSM extends FSMImpl<BoxCheckedHandler> {
    constructor(logger: Logger, dataHandler: BoxCheckedHandler);
}
interface BoxCheckedHandler extends FSMDataHandler {
    initToCheckHandler(event: Event): void;
}
declare class BoxChecked extends InteractionBase<WidgetData<HTMLInputElement>, WidgetDataImpl<HTMLInputElement>, BoxCheckedFSM> {
    constructor(logger: Logger, name?: string);
    onNewNodeRegistered(node: EventTarget): void;
    onNodeUnregistered(node: EventTarget): void;
}

interface ButtonPressedFSMHandler extends FSMDataHandler {
    initToPressedHandler(event: InputEvent): void;
}
declare class ButtonPressed extends InteractionBase<WidgetData<HTMLButtonElement>, WidgetDataImpl<HTMLButtonElement>, FSMImpl<ButtonPressedFSMHandler>> {
    constructor(logger: Logger, name?: string);
    onNewNodeRegistered(node: EventTarget): void;
    onNodeUnregistered(node: EventTarget): void;
}

interface ClickFSMHandler$1 extends FSMDataHandler {
    initToClicked(event: MouseEvent): void;
}
declare class ClickFSM extends FSMImpl<ClickFSMHandler$1> {
    private checkButton;
    constructor(logger: Logger, dataHandler?: ClickFSMHandler$1);
    getCheckButton(): number;
    setCheckButton(buttonToCheck: number): void;
    reinit(): void;
}
declare class Click extends InteractionBase<PointData, PointDataImpl, ClickFSM> {
    constructor(logger: Logger, fsm?: ClickFSM, data?: PointDataImpl, name?: string);
}

interface ClicksFSMHandler extends FSMDataHandler {
    click(evt: MouseEvent): void;
}
declare class ClicksFSM extends FSMImpl<ClicksFSMHandler> {
    private countClicks;
    private readonly nbClicks;
    constructor(nbClicks: number, logger: Logger, dataHandler: ClicksFSMHandler);
    reinit(): void;
}
declare class Clicks extends InteractionBase<MousePointsData, MousePointsDataImpl, ClicksFSM> {
    constructor(numberClicks: number, logger: Logger, name?: string);
}

declare class ColorPickedFSM extends FSMImpl<ColorPickedHandler> {
    constructor(logger: Logger, dataHandler: ColorPickedHandler);
}
interface ColorPickedHandler extends FSMDataHandler {
    initToPickedHandler(event: Event): void;
}
declare class ColorPicked extends InteractionBase<WidgetData<HTMLInputElement>, WidgetDataImpl<HTMLInputElement>, ColorPickedFSM> {
    constructor(logger: Logger, name?: string);
    onNewNodeRegistered(node: EventTarget): void;
    onNodeUnregistered(node: EventTarget): void;
}

declare class ComboBoxSelectedFSM extends FSMImpl<ComboBoxSelectedHandler> {
    constructor(logger: Logger, dataHandler: ComboBoxSelectedHandler);
}
interface ComboBoxSelectedHandler extends FSMDataHandler {
    initToSelectedHandler(event: Event): void;
}
declare class ComboBoxSelected extends InteractionBase<WidgetData<HTMLSelectElement>, WidgetDataImpl<HTMLSelectElement>, ComboBoxSelectedFSM> {
    constructor(logger: Logger, name?: string);
    onNewNodeRegistered(node: EventTarget): void;
    onNodeUnregistered(node: EventTarget): void;
}

declare class DatePickedFSM extends FSMImpl<DatePickedHandler> {
    constructor(logger: Logger, dataHandler: DatePickedHandler);
}
interface DatePickedHandler extends FSMDataHandler {
    initToPickedHandler(event: Event): void;
}
declare class DatePicked extends InteractionBase<WidgetData<HTMLInputElement>, WidgetDataImpl<HTMLInputElement>, DatePickedFSM> {
    constructor(logger: Logger, name?: string);
    onNewNodeRegistered(node: EventTarget): void;
    onNodeUnregistered(node: EventTarget): void;
}

declare class DnDFSM extends FSMImpl<DnDFSMHandler> {
    private readonly cancellable;
    private buttonToCheck;
    constructor(cancellable: boolean, logger: Logger, dataHandler: DnDFSMHandler);
    reinit(): void;
}
interface DnDFSMHandler extends FSMDataHandler {
    onPress(event: Event): void;
    onDrag(event: Event): void;
    onRelease(event: Event): void;
}
declare class DnD extends InteractionBase<SrcTgtPointsData<PointData>, SrcTgtPointsDataImpl, DnDFSM> {
    constructor(cancellable: boolean, logger: Logger, name?: string);
}

declare class DoubleClickFSM extends FSMImpl<FSMDataHandler> {
    private static timeGap;
    private static readonly timeGapSupplier;
    static getTimeGap(): number;
    static setTimeGap(timeGapBetweenClicks: number): void;
    readonly firstClickFSM: ClickFSM;
    private readonly sndClickFSM;
    private checkButton;
    constructor(logger: Logger, dataHandler?: FSMDataHandler);
    set log(log: boolean);
    setCheckButton(buttonToCheck: number): void;
    getCheckButton(): number;
    fullReinit(): void;
    reinit(): void;
}
declare class DoubleClick extends InteractionBase<PointData, PointDataImpl, DoubleClickFSM> {
    constructor(logger: Logger, fsm?: DoubleClickFSM, data?: PointDataImpl, name?: string);
}

declare class DragLockFSM extends FSMImpl<DragLockFSMHandler> {
    readonly firstDbleClick: DoubleClickFSM;
    readonly sndDbleClick: DoubleClickFSM;
    protected checkButton: number | undefined;
    constructor(logger: Logger, dataHandler: DragLockFSMHandler);
    set log(log: boolean);
    reinit(): void;
    fullReinit(): void;
}
interface DragLockFSMHandler extends FSMDataHandler {
    onMove(event: MouseEvent): void;
    onFirstDbleClick(): void;
}
declare class DragLock extends InteractionBase<SrcTgtPointsData<PointData>, SrcTgtPointsDataImpl, DragLockFSM> {
    constructor(logger: Logger, name?: string);
}

declare class HyperLinkClickedFSM extends FSMImpl<HyperLinkClickedFSMHandler> {
    constructor(logger: Logger, dataHandler: HyperLinkClickedFSMHandler);
}
interface HyperLinkClickedFSMHandler extends FSMDataHandler {
    initToClickedHandler(event: Event): void;
}
declare class HyperLinkClicked extends InteractionBase<WidgetData<HTMLAnchorElement>, WidgetDataImpl<HTMLAnchorElement>, HyperLinkClickedFSM> {
    constructor(logger: Logger, name?: string);
    onNewNodeRegistered(node: EventTarget): void;
    onNodeUnregistered(node: EventTarget): void;
}

interface KeyDownFSMHandler extends FSMDataHandler {
    onKeyPressed(event: KeyboardEvent): void;
}
declare class KeyDownFSM extends FSMImpl<KeyDownFSMHandler> {
    private readonly modifiersAccepted;
    constructor(modifierAccepted: boolean, logger: Logger, dataHandler: KeyDownFSMHandler, key?: string);
    reinit(): void;
}
declare class KeyDown extends InteractionBase<KeyData, KeyDataImpl, KeyDownFSM> {
    constructor(logger: Logger, modifierAccepted: boolean, key?: string, fsm?: KeyDownFSM, name?: string);
}

interface KeyTypedFSMHandler$1 extends FSMDataHandler {
    onKeyTyped(event: KeyboardEvent): void;
}
declare class KeyTypedFSM extends FSMImpl<KeyTypedFSMHandler$1> {
    private checkKey;
    constructor(logger: Logger, dataHandler: KeyTypedFSMHandler$1, key?: string);
    reinit(): void;
}
declare class KeyTyped extends InteractionBase<KeyData, KeyDataImpl, KeyTypedFSM> {
    constructor(logger: Logger, key?: string, name?: string);
}

interface KeyUpFSMHandler extends FSMDataHandler {
    onKeyUp(event: KeyboardEvent): void;
}
declare class KeyUpFSM extends FSMImpl<KeyUpFSMHandler> {
    private readonly modifiersAccepted;
    constructor(modifierAccepted: boolean, logger: Logger, dataHandler: KeyUpFSMHandler);
}
declare class KeyUp extends InteractionBase<KeyData, KeyDataImpl, KeyUpFSM> {
    constructor(logger: Logger, modifierAccepted: boolean, fsm?: KeyUpFSM, name?: string);
}

interface KeysDownFSMHandler extends FSMDataHandler {
    onKeyPressed(event: KeyboardEvent): void;
}
declare class KeysDownFSM extends FSMImpl<KeysDownFSMHandler> {
    private readonly currentCodes;
    constructor(logger: Logger, dataHandler: KeysDownFSMHandler);
    reinit(): void;
}
declare class KeysDown extends InteractionBase<KeysData, KeysDataImpl, KeysDownFSM> {
    constructor(logger: Logger, name?: string);
}

interface KeyTypedFSMHandler extends FSMDataHandler {
    onKeyTyped(event: Event): void;
}
declare class KeysTypedFSM extends FSMImpl<KeyTypedFSMHandler> {
    private static readonly timeGap;
    private static readonly timeGapSupplier;
    private static getTimeGap;
    constructor(logger: Logger, dataHandler: KeyTypedFSMHandler);
}
declare class KeysTyped extends InteractionBase<KeysData, KeysDataImpl, KeysTypedFSM> {
    constructor(logger: Logger, name?: string);
}

interface LongMouseDownFSMHandler extends FSMDataHandler {
    press(evt: MouseEvent): void;
}
declare class LongMouseDownFSM extends FSMImpl<LongMouseDownFSMHandler> {
    private readonly duration;
    private currentButton;
    constructor(duration: number, logger: Logger, dataHandler: LongMouseDownFSMHandler);
    reinit(): void;
}
declare class LongMouseDown extends InteractionBase<PointData, PointDataImpl, LongMouseDownFSM> {
    constructor(duration: number, logger: Logger, name?: string);
}

declare class LongTouchFSM extends FSMImpl<LongTouchFSMHandler> {
    private readonly duration;
    private currentTouchID;
    constructor(duration: number, logger: Logger, dataHandler: LongTouchFSMHandler);
    reinit(): void;
}
interface LongTouchFSMHandler extends FSMDataHandler {
    tap(evt: TouchEvent): void;
}
declare class LongTouch extends InteractionBase<TouchData, TouchDataImpl, LongTouchFSM> {
    constructor(duration: number, logger: Logger, name?: string);
}

declare class MouseDownFSM extends FSMImpl<MouseDownFSMHandler> {
    constructor(logger: Logger, dataHandler: MouseDownFSMHandler);
}
interface MouseDownFSMHandler extends FSMDataHandler {
    initToPress(event: MouseEvent): void;
}
declare class MouseDown extends InteractionBase<PointData, PointDataImpl, MouseDownFSM> {
    constructor(logger: Logger, name?: string);
}

interface MouseEnterFSMHandler extends FSMDataHandler {
    onEnter(event: MouseEvent): void;
}
declare class MouseEnterFSM extends FSMImpl<MouseEnterFSMHandler> {
    private readonly withBubbling;
    constructor(withBubbling: boolean, logger: Logger, dataHandler: MouseEnterFSMHandler);
}
declare class MouseEnter extends InteractionBase<PointData, PointDataImpl, MouseEnterFSM> {
    constructor(withBubbling: boolean, logger: Logger, name?: string);
}

interface MouseLeaveFSMHandler extends FSMDataHandler {
    onExit(event: MouseEvent): void;
}
declare class MouseLeaveFSM extends FSMImpl<MouseLeaveFSMHandler> {
    private readonly withBubbling;
    constructor(withBubbling: boolean, logger: Logger, dataHandler: MouseLeaveFSMHandler);
}
declare class MouseLeave extends InteractionBase<PointData, PointDataImpl, MouseLeaveFSM> {
    constructor(withBubbling: boolean, logger: Logger, name?: string);
}

interface MouseMoveFSMHandler extends FSMDataHandler {
    onMove(event: MouseEvent): void;
}
declare class MouseMoveFSM extends FSMImpl<MouseMoveFSMHandler> {
    constructor(logger: Logger, dataHandler: MouseMoveFSMHandler);
}
declare class MouseMove extends InteractionBase<PointData, PointDataImpl, MouseMoveFSM> {
    constructor(logger: Logger, name?: string);
}

interface MouseUpFSMHandler extends FSMDataHandler {
    initToPress(event: MouseEvent): void;
}
declare class MouseUpFSM extends FSMImpl<MouseUpFSMHandler> {
    constructor(logger: Logger, dataHandler: MouseUpFSMHandler);
}
declare class MouseUp extends InteractionBase<PointData, PointDataImpl, MouseUpFSM> {
    constructor(logger: Logger, name?: string);
}

declare class TouchDnDFSM extends FSMImpl<TouchDnDFSMHandler> {
    protected touchID: number | undefined;
    protected readonly cancellable: boolean;
    protected readonly movementRequired: boolean;
    protected readonly cancelled: CancellingState;
    protected readonly moved: StdState;
    protected readonly touched: StdState;
    constructor(cancellable: boolean, logger: Logger, dataHandler: TouchDnDFSMHandler, movementRequired?: boolean);
    protected buildFSM(): void;
    getTouchId(): number | undefined;
    reinit(): void;
}
declare class OneTouchDnDFSM extends TouchDnDFSM {
    constructor(cancellable: boolean, logger: Logger, dataHandler: TouchDnDFSMHandler);
    protected buildFSM(): void;
}
interface TouchDnDFSMHandler extends FSMDataHandler {
    onTouch(event: TouchEvent): void;
    onMove(event: TouchEvent): void;
    onRelease(event: TouchEvent): void;
}
declare class TouchDnD extends InteractionBase<SrcTgtPointsData<TouchData>, SrcTgtTouchDataImpl, OneTouchDnDFSM> {
    constructor(logger: Logger, cancellable: boolean, fsm?: OneTouchDnDFSM, name?: string);
    private setTgtData;
}

declare class MultiTouchFSM extends ConcurrentAndFSM<TouchDnDFSM, TouchDnDFSMHandler> {
    constructor(nbTouch: number, totalReinit: boolean, logger: Logger, dataHandler: TouchDnDFSMHandler, movementRequired?: boolean);
    process(event: Event): boolean;
}
declare class MultiTouch extends ConcurrentInteraction<MultiTouchData, MultiTouchDataImpl, MultiTouchFSM> {
    constructor(nbTouches: number, strict: boolean, logger: Logger, name?: string);
}

declare function hPan(logger: Logger, cancellable: boolean, pxTolerance: number, minLength?: number, minVelocity?: number): () => TouchDnD;
declare function vPan(logger: Logger, cancellable: boolean, pxTolerance: number, minLength?: number, minVelocity?: number): () => TouchDnD;
declare function leftPan(logger: Logger, cancellable: boolean, pxTolerance: number, minLength?: number, minVelocity?: number): () => TouchDnD;
declare function rightPan(logger: Logger, cancellable: boolean, pxTolerance: number, minLength?: number, minVelocity?: number): () => TouchDnD;
declare function topPan(logger: Logger, cancellable: boolean, pxTolerance: number, minLength?: number, minVelocity?: number): () => TouchDnD;
declare function bottomPan(logger: Logger, cancellable: boolean, pxTolerance: number, minLength?: number, minVelocity?: number): () => TouchDnD;

interface ScrollFSMHandler extends FSMDataHandler {
    initToScroll(event: Event): void;
}
declare class ScrollFSM extends FSMImpl<ScrollFSMHandler> {
    constructor(logger: Logger, dataHandler: ScrollFSMHandler);
}
declare class Scroll extends InteractionBase<ScrollData, ScrollDataImpl, ScrollFSM> {
    constructor(logger: Logger, name?: string);
}

interface SpinnerChangedHandler extends FSMDataHandler {
    initToChangedHandler(event: Event): void;
}
declare class SpinnerChangedFSM extends FSMImpl<SpinnerChangedHandler> {
    private static timeGap;
    private static readonly timeGapSupplier;
    static getTimeGap(): number;
    static setTimeGap(timeGapBetweenClicks: number): void;
    constructor(logger: Logger, dataHandler: SpinnerChangedHandler);
}
declare class SpinnerChanged extends InteractionBase<WidgetData<HTMLInputElement>, WidgetDataImpl<HTMLInputElement>, SpinnerChangedFSM> {
    constructor(logger: Logger, name?: string);
    onNewNodeRegistered(node: EventTarget): void;
    onNodeUnregistered(node: EventTarget): void;
}

interface TapFSMHandler extends FSMDataHandler {
    tap(evt: TouchEvent): void;
}
declare class TapFSM extends FSMImpl<TapFSMHandler> {
    private countTaps;
    private readonly nbTaps;
    private touchID?;
    protected readonly downState: StdState;
    protected readonly cancelState: CancellingState;
    constructor(nbTaps: number, logger: Logger, dataHandler: TapFSMHandler);
    reinit(): void;
}
declare class Tap extends InteractionBase<PointsData<TouchData>, PointsDataImpl<TouchData>, TapFSM> {
    constructor(numberTaps: number, logger: Logger, name?: string);
}

declare class TextInputChangedFSM extends FSMImpl<TextInputChangedHandler> {
    private readonly _timeGap;
    private readonly timeGapSupplier;
    getTimeGap(): number;
    constructor(logger: Logger, dataHandler: TextInputChangedHandler, timeSet?: number);
}
interface TextInputChangedHandler extends FSMDataHandler {
    initToChangedHandler(event: Event): void;
}
declare class TextInputChanged extends InteractionBase<WidgetData<HTMLInputElement | HTMLTextAreaElement>, WidgetDataImpl<HTMLInputElement | HTMLTextAreaElement>, TextInputChangedFSM> {
    constructor(logger: Logger, timeGap?: number, name?: string);
    onNewNodeRegistered(node: EventTarget): void;
    onNodeUnregistered(node: EventTarget): void;
}

interface ClickFSMHandler extends FSMDataHandler {
    initToClicked(event: MouseEvent): void;
}
declare class TimedClickFSM extends FSMImpl<ClickFSMHandler> {
    private currentButton;
    private readonly buttonToConsider;
    constructor(duration: number, logger: Logger, button?: number, dataHandler?: ClickFSMHandler);
    private setButtonToCheck;
    reinit(): void;
}
declare class TimedClick extends InteractionBase<PointData, PointDataImpl, TimedClickFSM> {
    constructor(duration: number, logger: Logger, button?: number, fsm?: TimedClickFSM, data?: PointDataImpl, name?: string);
}

declare class TimedTap extends InteractionBase<PointsData<TouchData>, PointsDataImpl<TouchData>, TapFSM> {
    constructor(duration: number, numberTaps: number, logger: Logger, name?: string);
}

declare class TouchStartFSM extends FSMImpl<TouchStartFSMHandler> {
    constructor(logger: Logger, dataHandler: TouchStartFSMHandler);
}
interface TouchStartFSMHandler extends FSMDataHandler {
    initToTouch(event: TouchEvent): void;
}
declare class TouchStart extends InteractionBase<TouchData, TouchDataImpl, TouchStartFSM> {
    constructor(logger: Logger, name?: string);
}

declare class XTouchDnD<T extends TwoTouchData, S extends T & TwoTouchDataImpl> extends ConcurrentInteraction<T, S, MultiTouchFSM> {
    constructor(nbTouches: number, logger: Logger, dataImpl: S, name?: string, fsm?: MultiTouchFSM, movementRequired?: boolean);
    protected setTgtData(evt: TouchEvent): void;
}
type TwoTouch = XTouchDnD<GeneralTwoTouchData, GeneralTwoTouchDataImpl>;
declare function twoTouch(logger: Logger): () => TwoTouch;
declare class ThreeTouchDnD extends XTouchDnD<ThreeTouchData, ThreeTouchDataImpl> {
    constructor(logger: Logger, name?: string, movementRequired?: boolean);
}
declare class FourTouchDnD extends XTouchDnD<FourTouchData, FourTouchDataImpl> {
    constructor(logger: Logger, name?: string, movementRequired?: boolean);
}

type TwoPan = XTouchDnD<LineTouchData & TwoTouchData, TwoPanDataImpl>;
declare function twoHPan(logger: Logger, pxTolerance: number, minLength?: number, minVelocity?: number): () => TwoPan;
declare function twoVPan(logger: Logger, pxTolerance: number, minLength?: number, minVelocity?: number): () => TwoPan;
declare function twoLeftPan(logger: Logger, pxTolerance: number, minLength?: number, minVelocity?: number): () => TwoPan;
declare function twoRightPan(logger: Logger, pxTolerance: number, minLength?: number, minVelocity?: number): () => TwoPan;
declare function twoTopPan(logger: Logger, pxTolerance: number, minLength?: number, minVelocity?: number): () => TwoPan;
declare function twoBottomPan(logger: Logger, pxTolerance: number, minLength?: number, minVelocity?: number): () => TwoPan;

type Rotate = XTouchDnD<RotationTouchData, RotationTouchDataImpl>;
type Scale = XTouchDnD<ScaleTouchData, ScaleTouchDataImpl>;
declare function rotate(logger: Logger, pxTolerance: number): () => Rotate;
declare function scale(logger: Logger, pxTolerance: number): () => Scale;

interface WheelFSMHandler extends FSMDataHandler {
    initToMoved(event: WheelEvent): void;
}
declare class WheelFSM extends FSMImpl<WheelFSMHandler> {
    constructor(logger: Logger, dataHandler: WheelFSMHandler);
}
declare class Wheel extends InteractionBase<WheelData, WheelDataImpl, WheelFSM> {
    constructor(logger: Logger, fsm?: WheelFSM, data?: WheelDataImpl, name?: string);
}

declare class FittsLawDataImpl {
    readonly t: number;
    readonly w: number;
    readonly h: number;
    readonly d: number;
    constructor(t: number, w: number, h: number, d: number);
    getID(we?: number): number;
}
declare class FittsLaw {
    private readonly obsSrc;
    private readonly providedTarget;
    private readonly data;
    private _startX;
    private _startY;
    private _target;
    private readonly handler;
    constructor(bSrc: Binding<Command, Interaction<InteractionData>, unknown>, bTgt: Binding<Command, Interaction<InteractionData>, unknown>, target?: Element);
    private computeD;
    get we(): number;
    getAB(effectiveTargetW?: boolean): [a: number, b: number, r: number];
    uninstall(): void;
    private reinit;
}

declare class LoggingData {
    readonly name: string;
    readonly sessionID: string;
    readonly date: number;
    readonly msg: string;
    readonly level: LogLevel;
    readonly type: "ERR" | "INFO";
    readonly stack: string | undefined;
    readonly frontVersion: string | undefined;
    constructor(date: number, msg: string, level: LogLevel, name: string, type: "ERR" | "INFO", sessionID: string, stack?: string, frontVersion?: string);
    toString(): string;
}
declare class UsageLog {
    name: string;
    readonly sessionID: string;
    readonly date: number;
    duration: number;
    cancelled: boolean;
    readonly frontVersion: string | undefined;
    constructor(name: string, sessionID: string, date: number, frontVersion?: string);
    toString(): string;
}
declare class LoggerImpl implements Logger {
    writeConsole: boolean;
    serverAddress: string | undefined;
    readonly sessionID: string;
    readonly frontVersion: string | undefined;
    ongoingBindings: Array<UsageLog>;
    constructor(version?: string);
    private processLoggingData;
    private formatError;
    logBindingErr(msg: string, ex: unknown, bindingName?: string): void;
    logBindingMsg(msg: string, bindingName?: string): void;
    logCmdErr(msg: string, ex: unknown, cmdName?: string): void;
    logCmdMsg(msg: string, cmdName?: string): void;
    logInteractionErr(msg: string, ex: unknown, interactionName?: string): void;
    logInteractionMsg(msg: string, interactionName?: string): void;
    logBindingStart(bindingName: string): void;
    logBindingEnd(bindingName: string, cancelled: boolean): void;
}

declare class TreeUndoHistoryImpl extends TreeUndoHistory {
    private idCounter;
    private _currentNode;
    readonly undoableNodes: Array<UndoableTreeNode | undefined>;
    private readonly undoPublisher;
    private readonly redoPublisher;
    readonly root: UndoableTreeNode;
    private readonly _path;
    private readonly _keepPath;
    constructor(keepPath?: boolean);
    add(undoable: Undoable): void;
    get currentNode(): UndoableTreeNode;
    clear(): void;
    delete(id: number): void;
    goTo(id: number): void;
    private goToFromRoot;
    private gatherToRoot;
    private goFromOneNodeToAnotherOne;
    redo(): void;
    undo(): void;
    getPositions(): Map<number, number>;
    private getPositionNode;
    getLastOrEmptyRedoMessage(): string;
    getLastOrEmptyUndoMessage(): string;
    getLastRedo(): Undoable | undefined;
    getLastRedoMessage(): string | undefined;
    getLastUndo(): Undoable | undefined;
    getLastUndoMessage(): string | undefined;
    undosObservable(): Observable<Undoable | undefined>;
    redosObservable(): Observable<Undoable | undefined>;
    get path(): ReadonlyArray<number>;
    get keepPath(): boolean;
    private addToPath;
    export(fn: (undoable: Undoable) => unknown): TreeUndoHistoryDTO;
    import(dtoHistory: TreeUndoHistoryDTO, fn: (dtoUndoable: unknown) => Undoable): void;
}

declare class UndoHistoryImpl extends UndoHistory {
    private readonly undos;
    private readonly redos;
    private sizeMax;
    private readonly undoPublisher;
    private readonly redoPublisher;
    constructor();
    undosObservable(): Observable<Undoable | undefined>;
    redosObservable(): Observable<Undoable | undefined>;
    clear(): void;
    private clearRedo;
    add(undoable: Undoable): void;
    undo(): void;
    redo(): void;
    getLastUndoMessage(): string | undefined;
    getLastRedoMessage(): string | undefined;
    getLastOrEmptyUndoMessage(): string;
    getLastOrEmptyRedoMessage(): string;
    getLastUndo(): Undoable | undefined;
    getLastRedo(): Undoable | undefined;
    getSizeMax(): number;
    setSizeMax(max: number): void;
    getUndo(): ReadonlyArray<Undoable>;
    getRedo(): ReadonlyArray<Undoable>;
}

declare function remove<T>(array: Array<T>, elt: T): void;
declare function removeAt<T>(array: Array<T>, index: number): T | undefined;

export { AnonBinding, AnonCmd, type BaseBinder, type BaseBinderBuilder, type BaseUpdateBinder, type BaseUpdateBinderBuilder, Binder, type Binding, BindingImpl, Bindings, BindingsContext, BindingsImpl, type BindingsObserver, BoxCheckPressedTransition, BoxChecked, ButtonPressed, ButtonPressedTransition, CancelFSMError, CancellingState, type Checker, CheckerImpl, Click, ClickFSM, ClickTransition, Clicks, ClicksFSM, type CmdBinder, type CmdBinderBuilder, type CmdStatus, type CmdUpdateBinder, type CmdUpdateBinderBuilder, ColorPicked, ColorPickedTransition, ComboBoxSelected, ComboBoxTransition, type Command, CommandBase, ConcurrentAndFSM, type ConcurrentFSM, ConcurrentInteraction, ConcurrentXOrFSM, DatePicked, DatePickedTransition, DnD, DoubleClick, DoubleClickFSM, DragLock, DwellSpringAnimation, type EltRef, EscapeKeyPressureTransition, type EventModifierData, type EventType, type FSM, type FSMDataHandler, type FSMHandler, FSMImpl, FittsLaw, FittsLawDataImpl, type Flushable, FocusHTMLElement, type FourTouchData, FourTouchDataImpl, FourTouchDnD, type GeneralTwoTouchData, GeneralTwoTouchDataImpl, HyperLinkClicked, HyperLinkTransition, InitState, type InputState, type Interaction, InteractionBase, type InteractionBinder, type InteractionBinderBuilder, type InteractionBuilder, InteractionBuilderImpl, type InteractionCmdBinder, type InteractionCmdUpdateBinder, type InteractionData, InteractionDataBase, type InteractionDataImplType, type InteractionDataType, type InteractionUpdateBinder, type InteractionUpdateBinderBuilder, type InteractionsDataTypes, type KeyBinderBuilder, KeyCode, type KeyData, KeyDataImpl, KeyDown, KeyDownFSM, type KeyEventType, type KeyInteractionBinder, type KeyInteractionBinderBuilder, type KeyInteractionCmdBinder, type KeyInteractionCmdUpdateBinder, type KeyInteractionUpdateBinder, KeyTransition, KeyTyped, KeyTypedFSM, KeyUp, KeyUpFSM, KeysBinder, type KeysData, KeysDataImpl, KeysDown, KeysDownFSM, KeysTyped, KeysTypedFSM, type LineTouchData, type LinterRule, type LogLevel, type Logger, LoggerImpl, LoggingData, LongMouseDown, LongMouseDownFSM, LongTouch, MouseDown, MouseEnter, MouseEnterFSM, type MouseEventType, MouseLeave, MouseLeaveFSM, MouseMove, MouseMoveFSM, type MousePointsData, MousePointsDataImpl, MouseTransition, MouseUp, MouseUpFSM, MultiTouch, type MultiTouchData, MultiTouchDataBase, MultiTouchDataImpl, MultiTouchFSM, MustBeUndoableCmdError, Not, NotFSM, OneTouchDnDFSM, Or, type OutputState, OutputStateBase, type PartialAnchorTypedBinder, type PartialButtonTypedBinder, type PartialFourTouchTypedBinder, type PartialInputTypedBinder, type PartialKeyTypedBinder, type PartialKeysTypedBinder, type PartialMultiTouchTypedBinder, type PartialPointOrTouchTypedBinder, type PartialPointSrcTgtTypedBinder, type PartialPointTypedBinder, type PartialPointsOrTapsTypedBinder, type PartialPointsTypedBinder, type PartialRotateTypedBinder, type PartialScaleTypedBinder, type PartialScrollTypedBinder, type PartialSelectTypedBinder, type PartialSpinnerTypedBinder, type PartialTapsTypedBinder, type PartialTextInputTypedBinder, type PartialThenBinder, type PartialThreeTouchTypedBinder, type PartialTouchMouseDnDTypedBinder, type PartialTouchSrcTgtTypedBinder, type PartialTouchTypedBinder, type PartialTwoPanTypedBinder, type PartialTwoTouchTypedBinder, type PartialUpdatePointTypedBinder, type PartialWheelTypedBinder, type PointBaseData, type PointData, PointDataImpl, PointingDataBase, type PointsData, PointsDataImpl, type PrimitiveUndoableSnapshot, Redo, RedoNTimes, type Rotate, type RotationTouchData, RotationTouchDataImpl, type RuleName, type Scale, type ScaleTouchData, ScaleTouchDataImpl, Scroll, type ScrollData, ScrollDataImpl, ScrollFSM, ScrollTransition, SetProperties, SetProperty, type Severity, SpinnerChanged, SpinnerChangedFSM, SpinnerChangedTransition, SrcTgtDataBase, type SrcTgtPointsData, SrcTgtPointsDataImpl, SrcTgtTouchDataImpl, type State, StateBase, StdState, SubFSMTransition, Tap, TapDataImpl, TapFSM, type TapsData, TerminalState, TextInputChanged, TextInputChangedTransition, Then, type ThenData, ThenDataImpl, ThenFSM, type ThreeTouchData, ThreeTouchDataImpl, ThreeTouchDnD, TimedClick, TimedClickFSM, TimedTap, TimeoutTransition, type TouchData, TouchDataImpl, TouchDnD, TouchDnDFSM, type TouchDnDFSMHandler, type TouchEventType, TouchStart, TouchTransition, TransferArrayItem, type Transition, TransitionBase, TreeUndoHistory, type TreeUndoHistoryDTO, TreeUndoHistoryImpl, type TwoPan, TwoPanDataImpl, type TwoTouch, type TwoTouchData, TwoTouchDataImpl, Undo, UndoHistory, type UndoHistoryBase, UndoHistoryImpl, UndoNTimes, type Undoable, UndoableCommand, type UndoableSnapshot, type UndoableTreeNode, type UndoableTreeNodeDTO, type UnitInteractionData, UpdateBinder, UsageLog, type VisitorBinding, type VisitorFSM, VisitorFSMDepthFirst, type VisitorInteraction, Wheel, type WheelData, WheelDataImpl, WheelFSM, WheelTransition, type When, type WhenType, type Widget, type WidgetData, WidgetDataImpl, XTouchDnD, bottomPan, eventTypes, getTouch, hPan, isButton, isCheckBox, isColorChoice, isComboBox, isDatePicker, isEltRef, isHyperLink, isKeyDownEvent, isKeyUpEvent, isOutputStateType, isSpinner, isTextInput, isUndoableType, isWhenAtEnd, isWhenAtStart, isWhenAtThen, isWhenStrict, keyEventTypes, leftPan, mouseEventTypes, remove, removeAt, rightPan, rotate, scale, topPan, touchEventTypes, twoBottomPan, twoHPan, twoLeftPan, twoRightPan, twoTopPan, twoTouch, twoVPan, vPan };
