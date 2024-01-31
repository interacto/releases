import { CancellingState } from "./CancellingState";
import { TerminalState } from "./TerminalState";
import { TransitionBase } from "./TransitionBase";
import { isOutputStateType } from "../../api/fsm/OutputState";
export class SubFSMTransition extends TransitionBase {
    subFSM;
    subFSMHandler;
    subStateSubscription;
    constructor(srcState, tgtState, fsm, action) {
        super(srcState, tgtState, action, (evt) => this.findTransition(evt)?.guard(evt) ?? false);
        this.subFSM = fsm;
        this.subFSM.inner = true;
        this.subFSMHandler = {
            "fsmStarts": () => {
                this.src.exit();
            },
            "fsmUpdates": () => {
                this.src.fsm.onUpdating();
            },
            "fsmStops": () => {
                this.action(new Event(""));
                this.unsetFSMHandler();
                if (this.tgt instanceof TerminalState) {
                    this.tgt.enter();
                    return;
                }
                if (this.tgt instanceof CancellingState) {
                    this.cancelsFSM();
                    return;
                }
                if (isOutputStateType(this.tgt)) {
                    this.src.fsm.currentState = this.tgt;
                    this.tgt.enter();
                }
            },
            "fsmCancels": () => {
                this.cancelsFSM();
            },
            "fsmError": (err) => {
                this.src.fsm.onError(err);
            }
        };
    }
    setUpFSMHandler() {
        this.subFSM.addHandler(this.subFSMHandler);
        this.src.fsm.currentSubFSM = this.subFSM;
        this.subStateSubscription = this.subFSM.currentStateObservable
            .subscribe(value => {
            this.src.fsm.currentState = value[1];
        });
    }
    unsetFSMHandler() {
        this.subFSM.removeHandler(this.subFSMHandler);
        this.src.fsm.currentSubFSM = undefined;
        this.subStateSubscription?.unsubscribe();
    }
    cancelsFSM() {
        this.unsetFSMHandler();
        this.src.fsm.onCancelling();
    }
    execute(event) {
        const transition = this.findTransition(event);
        if (transition === undefined) {
            return undefined;
        }
        this.src.fsm.stopCurrentTimeout();
        this.setUpFSMHandler();
        this.subFSM.process(event);
        return transition.target;
    }
    accept(event) {
        return this.findTransition(event) !== undefined;
    }
    findTransition(event) {
        return this.subFSM
            .initState
            .transitions
            .find(tr => tr.accept(event));
    }
    getAcceptedEvents() {
        const result = new Set();
        for (const trans of this.subFSM.initState.transitions) {
            for (const evt of trans.getAcceptedEvents()) {
                result.add(evt);
            }
        }
        return result;
    }
    uninstall() {
        this.unsetFSMHandler();
        this.subFSM.uninstall();
    }
}
