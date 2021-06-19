import type { State } from "../../api/fsm/State";
import { InitState } from "./InitState";
import type { OutputState } from "../../api/fsm/OutputState";
import type { FSMHandler } from "../../api/fsm/FSMHandler";
import { TimeoutTransition } from "./TimeoutTransition";
import type { InputState } from "../../api/fsm/InputState";
import type { FSMDataHandler } from "./FSMDataHandler";
import type { Observable } from "rxjs";
import { Subject } from "rxjs";
import type { FSM } from "../../api/fsm/FSM";
export declare class FSMImpl implements FSM {
    protected dataHandler?: FSMDataHandler;
    protected asLogFSM: boolean;
    protected _inner: boolean;
    protected _startingState: State;
    protected started: boolean;
    readonly initState: InitState;
    protected _currentState: OutputState;
    protected readonly currentStatePublisher: Subject<[OutputState, OutputState]>;
    protected readonly states: Array<State>;
    protected readonly handlers: Array<FSMHandler>;
    protected readonly eventsToProcess: Array<Event>;
    protected currentTimeout?: TimeoutTransition;
    protected currentSubFSM?: FSM;
    constructor();
    protected buildFSM(dataHandler?: FSMDataHandler): void;
    setCurrentSubFSM(subFSM?: FSM): void;
    getCurrentState(): OutputState;
    currentStateObservable(): Observable<[OutputState, OutputState]>;
    setInner(inner: boolean): void;
    getInner(): boolean;
    process(event: Event): boolean;
    private processEvent;
    getDataHandler(): FSMDataHandler | undefined;
    private removeKeyEvent;
    enterStdState(state: InputState & OutputState): void;
    isStarted(): boolean;
    setCurrentState(state: OutputState): void;
    protected processRemainingEvents(): void;
    addRemaningEventsToProcess(event: Event): void;
    onTerminating(): void;
    onCancelling(): void;
    onStarting(): void;
    onUpdating(): void;
    addState(state: InputState): void;
    log(log: boolean): void;
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
    getStates(): ReadonlyArray<State>;
    getStartingState(): State;
    setStartingState(state: State): void;
    getEventsToProcess(): ReadonlyArray<Event>;
    getInitState(): OutputState;
    uninstall(): void;
}