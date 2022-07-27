export interface FSMHandler {
    fsmStarts?(): void;
    fsmUpdates?(): void;
    fsmStops?(): void;
    fsmCancels?(): void;
    fsmError?(err: unknown): void;
}
