export class KeysDataImpl {
    keysData = [];
    flush() {
        this.keysData.length = 0;
    }
    get keys() {
        return this.keysData;
    }
    addKey(key) {
        this.keysData.push(key);
    }
}
