export interface Command {
    flush(): void;
    execute(): Promise<boolean> | boolean;
    canExecute(): boolean;
    hadEffect(): boolean;
    done(): void;
    isDone(): boolean;
    cancel(): void;
    getStatus(): CmdStatus;
}
export type CmdStatus = "cancelled" | "created" | "done" | "executed" | "flushed";
