import type { Interaction, InteractionDataType } from "./Interaction";
import type { InteractionData } from "./InteractionData";
export interface InteractionBuilder<I extends Interaction<D>, D extends InteractionData = InteractionDataType<I>> {
    first(predicate: (i: D) => boolean): this;
    then(predicate: (i: D) => boolean): this;
    firstAndThen(predicate: (i: D) => boolean): this;
    end(predicate: (i: D) => boolean): this;
    name(name: string): this;
    build(): () => I;
}
