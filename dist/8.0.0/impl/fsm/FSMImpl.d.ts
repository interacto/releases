import { CancellingState } from "./CancellingState";
import { InitState } from "./InitState";
import { StdState } from "./StdState";
import { TerminalState } from "./TerminalState";
import { TimeoutTransition } from "./TimeoutTransition";
import { Subject } from "rxjs";
import type { FSMDataHandler } from "./FSMDataHandler";
import type { FSM } from "../../api/fsm/FSM";
import type { FSMHandler } from "../../api/fsm/FSMHandler";
import type { InputState } from "../../api/fsm/InputState";
import type { OutputState } from "../../api/fsm/OutputState";
import type { State } from "../../api/fsm/State";
import type { VisitorFSM } from "../../api/fsm/VisitorFSM";
import type { Logger } from "../../api/logging/Logger";
import type { Observable } from "rxjs";
export declare class FSMImpl<T extends FSMDataHandler> implements FSM {
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
