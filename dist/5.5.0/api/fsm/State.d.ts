import type { FSM } from "./FSM";
export interface State {
    getName(): string;
    getFSM(): FSM;
    checkStartingState(): void;
    uninstall(): void;
}
