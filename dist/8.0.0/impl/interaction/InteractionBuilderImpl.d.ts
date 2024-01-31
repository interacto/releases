import type { Interaction, InteractionDataType } from "../../api/interaction/Interaction";
import type { InteractionBuilder } from "../../api/interaction/InteractionBuilder";
import type { InteractionData } from "../../api/interaction/InteractionData";
export declare class InteractionBuilderImpl<I extends Interaction<D>, D extends InteractionData = InteractionDataType<I>> implements InteractionBuilder<I, D> {
    private readonly iCtor;
    private startPredicate;
    private thenPredicate;
    private endPredicate;
    private interactionName;
    constructor(interactionSupplier: (name?: string) => I);
    first(predicate: (i: D) => boolean): this;
    then(predicate: (i: D) => boolean): this;
    firstAndThen(predicate: (i: D) => boolean): this;
    end(predicate: (i: D) => boolean): this;
    name(name: string): this;
    build(): () => I;
    private process;
}
