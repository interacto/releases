export class ThenDataImpl {
    dx;
    constructor(dx) {
        this.dx = dx;
    }
    flush() {
        for (const data of this.dx) {
            data.flush();
        }
    }
}
