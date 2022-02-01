export interface KeyBinderBuilder {
    with(isCode: boolean, ...keysOrCodes: ReadonlyArray<string>): KeyBinderBuilder;
}
