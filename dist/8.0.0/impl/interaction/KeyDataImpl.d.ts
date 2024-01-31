import { InteractionDataBase } from "./InteractionDataBase";
import type { Flushable } from "./Flushable";
import type { KeyData } from "../../api/interaction/KeyData";
export declare class KeyDataImpl extends InteractionDataBase implements KeyData, Flushable {
    private codeData;
    private keyData;
    private locationData;
    private repeatData;
    private altKeyData;
    private ctrlKeyData;
    private metaKeyData;
    private shiftKeyData;
    flush(): void;
    copy(data: KeyData): void;
    get altKey(): boolean;
    get code(): string;
    get ctrlKey(): boolean;
    get key(): string;
    get location(): number;
    get metaKey(): boolean;
    get repeat(): boolean;
    get shiftKey(): boolean;
}
