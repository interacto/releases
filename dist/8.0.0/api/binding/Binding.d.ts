import type { VisitorBinding } from "./VisitorBinding";
import type { RuleName, Severity } from "../checker/Checker";
import type { Command } from "../command/Command";
import type { Interaction, InteractionDataType } from "../interaction/Interaction";
import type { InteractionData } from "../interaction/InteractionData";
import type { Observable } from "rxjs";
export interface Binding<C extends Command, I extends Interaction<D>, A, D extends InteractionData = InteractionDataType<I>> {
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
