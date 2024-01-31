import { CancelFSMError } from "../fsm/CancelFSMError";
export class InteractionBuilderImpl {
    iCtor;
    startPredicate;
    thenPredicate;
    endPredicate;
    interactionName;
    constructor(interactionSupplier) {
        this.iCtor = interactionSupplier;
        this.startPredicate = undefined;
        this.thenPredicate = undefined;
        this.endPredicate = undefined;
        this.interactionName = undefined;
    }
    first(predicate) {
        this.startPredicate = predicate;
        return this;
    }
    then(predicate) {
        this.thenPredicate = predicate;
        return this;
    }
    firstAndThen(predicate) {
        this.first(predicate);
        this.then(predicate);
        return this;
    }
    end(predicate) {
        this.endPredicate = predicate;
        return this;
    }
    name(name) {
        this.interactionName = name;
        return this;
    }
    build() {
        return () => {
            const i = this.iCtor(this.interactionName);
            i.fsm.addHandler({
                "preFsmStart": () => {
                    this.process(i, this.startPredicate);
                },
                "preFsmUpdate": () => {
                    this.process(i, this.thenPredicate);
                },
                "preFsmStop": () => {
                    this.process(i, this.endPredicate);
                }
            });
            return i;
        };
    }
    process(i, predicate) {
        if (predicate !== undefined && !predicate(i.data)) {
            throw new CancelFSMError();
        }
    }
}
