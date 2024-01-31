import type { EventModifierData } from "./EventModifierData";
import type { UnitInteractionData } from "./UnitInteractionData";
export interface KeyData extends UnitInteractionData, EventModifierData {
    readonly code: string;
    readonly key: string;
    readonly location: number;
    readonly repeat: boolean;
}
