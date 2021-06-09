import type { FSMHandler } from "../fsm/FSMHandler";
import type { Interaction } from "../interaction/Interaction";
import type { Command } from "../command/Command";
import type { Observable } from "rxjs";
import type { InteractionData } from "../interaction/InteractionData";
export interface Binding<C extends Command, I extends Interaction<D>, D extends InteractionData> extends FSMHandler {
    getInteraction(): I;
    getCommand(): C | undefined;
    isActivated(): boolean;
    setActivated(activated: boolean): void;
    isRunning(): boolean;
    isStrictStart(): boolean;
    uninstallBinding(): void;
    produces(): Observable<C>;
    getTimesEnded(): number;
    getTimesCancelled(): number;
}
