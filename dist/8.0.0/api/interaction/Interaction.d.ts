import type { InteractionData } from "./InteractionData";
import type { VisitorInteraction } from "./VisitorInteraction";
import type { FSM } from "../fsm/FSM";
export type InteractionDataType<T> = T extends Interaction<infer D> ? D : never;
export type InteractionsDataTypes<A extends Array<Interaction<any>>> = {
    [K in keyof A]: A[K] extends Interaction<infer T> ? T : never;
};
export interface Interaction<D extends InteractionData> {
    stopImmediatePropagation: boolean;
    preventDefault: boolean;
    readonly fsm: FSM;
    data: D;
    readonly name: string;
    readonly registeredNodes: ReadonlySet<unknown>;
    readonly dynamicRegisteredNodes: ReadonlySet<unknown>;
    isRunning(): boolean;
    isActivated(): boolean;
    setActivated(activated: boolean): void;
    log(log: boolean): void;
    registerToNodes(widgets: ReadonlyArray<unknown>): void;
    registerToNodeChildren(elementToObserve: Node): void;
    setThrottleTimeout(timeout: number): void;
    fullReinit(): void;
    reinit(): void;
    reinitData(): void;
    uninstall(): void;
    acceptVisitor(visitor: VisitorInteraction): void;
}
