import type { Binding } from "../../api/binding/Binding";
import type { Checker, LinterRule } from "../../api/checker/Checker";
import type { Command } from "../../api/command/Command";
import type { Interaction } from "../../api/interaction/Interaction";
import type { InteractionData } from "../../api/interaction/InteractionData";
export declare class CheckerImpl implements Checker {
    private readonly linterRules;
    private readonly cacheIncluded;
    constructor();
    setLinterRules(...rules: ReadonlyArray<LinterRule>): void;
    checkRules(binding: Binding<Command, Interaction<InteractionData>, unknown>, binds: ReadonlyArray<Binding<Command, Interaction<InteractionData>, unknown>>): void;
    checkSameInteractions(binding: Binding<Command, Interaction<InteractionData>, unknown>, binds: ReadonlyArray<Binding<Command, Interaction<InteractionData>, unknown>>): void;
    checkSameData(binding: Binding<Command, Interaction<InteractionData>, unknown>, binds: ReadonlyArray<Binding<Command, Interaction<InteractionData>, unknown>>): void;
    checkIncluded(binding: Binding<Command, Interaction<InteractionData>, unknown>, binds: ReadonlyArray<Binding<Command, Interaction<InteractionData>, unknown>>): void;
    private checkRule;
    private isIncluded;
    private getSameDataSeverity;
    private getSameInteractionSeverity;
    private getIncludedSeverity;
    private isWidgetSetsIntersecting;
    private printLinterMsg;
    private fillCacheIncluded;
}
