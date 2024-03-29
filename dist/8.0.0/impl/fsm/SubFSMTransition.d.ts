import { TransitionBase } from "./TransitionBase";
import type { EventType } from "../../api/fsm/EventType";
import type { FSM } from "../../api/fsm/FSM";
import type { InputState } from "../../api/fsm/InputState";
import type { OutputState } from "../../api/fsm/OutputState";
export declare class SubFSMTransition extends TransitionBase<Event> {
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
