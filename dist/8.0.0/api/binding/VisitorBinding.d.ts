import type { Binding } from "./Binding";
import type { Bindings } from "./Bindings";
import type { Command } from "../command/Command";
import type { Interaction } from "../interaction/Interaction";
import type { InteractionData } from "../interaction/InteractionData";
import type { VisitorInteraction } from "../interaction/VisitorInteraction";
import type { UndoHistoryBase } from "../undo/UndoHistoryBase";
export interface VisitorBinding extends VisitorInteraction {
    visitBinding(binding: Binding<Command, Interaction<InteractionData>, unknown>): void;
    visitBindings(bindings: Bindings<UndoHistoryBase>): void;
}
