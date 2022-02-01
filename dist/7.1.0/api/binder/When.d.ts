export declare enum WhenType {
    nonStrict = 0,
    strict = 1,
    strictStart = 2,
    then = 3,
    strictThen = 4,
    end = 5
}
export declare function isWhenAtStart(type: WhenType): boolean;
export declare function isWhenAtThen(type: WhenType): boolean;
export declare function isWhenAtEnd(type: WhenType): boolean;
export declare function isWhenStrict(type: WhenType): boolean;
export interface When<D> {
    fn: (i: D) => boolean;
    type: WhenType;
}
