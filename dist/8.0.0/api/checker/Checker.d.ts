import type { Binding } from "../binding/Binding";
import type { Command } from "../command/Command";
import type { Interaction } from "../interaction/Interaction";
import type { InteractionData } from "../interaction/InteractionData";
export type RuleName = "included" | "same-data" | "same-interactions";
export type Severity = "err" | "ignore" | "warn";
export type LinterRule = [name: RuleName, severity: Severity];
export interface Checker {
    setLinterRules(...rules: ReadonlyArray<LinterRule>): void;
    checkRules(binding: Binding<Command, Interaction<InteractionData>, unknown>, binds: ReadonlyArray<Binding<Command, Interaction<InteractionData>, unknown>>): void;
    checkSameInteractions(binding: Binding<Command, Interaction<InteractionData>, unknown>, binds: ReadonlyArray<Binding<Command, Interaction<InteractionData>, unknown>>): void;
    checkSameData(binding: Binding<Command, Interaction<InteractionData>, unknown>, binds: ReadonlyArray<Binding<Command, Interaction<InteractionData>, unknown>>): void;
    checkIncluded(binding: Binding<Command, Interaction<InteractionData>, unknown>, binds: ReadonlyArray<Binding<Command, Interaction<InteractionData>, unknown>>): void;
}
