import type { Interaction } from "./Interaction";
import type { InteractionData } from "./InteractionData";
import type { VisitorFSM } from "../fsm/VisitorFSM";
export interface VisitorInteraction extends VisitorFSM {
    visitInteraction(interaction: Interaction<InteractionData>): void;
}
