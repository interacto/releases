import type { Observable } from "rxjs";
import { Subject } from "rxjs";
import type { Command } from "../../api/command/Command";
import type { InteractionData } from "../../api/interaction/InteractionData";
import type { Binding } from "../../api/binding/Binding";
import type { Interaction } from "../../api/interaction/Interaction";
import type { Logger } from "../../api/logging/Logger";
import type { UndoHistoryBase } from "../../api/undo/UndoHistoryBase";
export declare class BindingImpl<C extends Command, I extends Interaction<D>, D extends InteractionData> implements Binding<C, I, D> {
    protected _name: string | undefined;
    protected _timeEnded: number;
    protected _timeCancelled: number;
    protected _activated: boolean;
    protected readonly _interaction: I;
    protected _cmd?: C;
    readonly continuousCmdExecution: boolean;
    protected readonly cmdProducer: (i?: D) => C;
    protected readonly cmdsProduced: Subject<C>;
    protected undoHistory: UndoHistoryBase;
    protected logger: Logger;
    logBinding: boolean;
    logCmd: boolean;
    logUsage: boolean;
    constructor(continuousExecution: boolean, interaction: I, cmdProducer: (i?: D) => C, widgets: ReadonlyArray<EventTarget>, undoHistory: UndoHistoryBase, logger: Logger, name?: string);
    get name(): string;
    protected whenStart(): boolean;
    protected whenUpdate(): boolean;
    protected whenStop(): boolean;
    clearEvents(): void;
    protected createCommand(): C | undefined;
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
}
