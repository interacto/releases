export type WhenType = "end" | "nonStrict" | "strict" | "strictStart" | "strictThen" | "then";
export declare function isWhenAtStart(type: WhenType): boolean;
export declare function isWhenAtThen(type: WhenType): boolean;
export declare function isWhenAtEnd(type: WhenType): boolean;
export declare function isWhenStrict(type: WhenType): boolean;
export interface When<D, A> {
    fn: (i: D, acc: Readonly<A>) => boolean;
    type: WhenType;
}
