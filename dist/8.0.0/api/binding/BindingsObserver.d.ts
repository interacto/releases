import type { Binding } from "./Binding";
import type { Checker } from "../checker/Checker";
import type { Command } from "../command/Command";
import type { Interaction } from "../interaction/Interaction";
import type { InteractionData } from "../interaction/InteractionData";
export interface BindingsObserver {
    observeBinding(binding: Binding<Command, Interaction<InteractionData>, unknown>): void;
    clearObservedBindings(): void;
    readonly checker: Checker;
}
