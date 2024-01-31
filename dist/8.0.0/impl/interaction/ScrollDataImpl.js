import { InteractionDataBase } from "./InteractionDataBase";
export class ScrollDataImpl extends InteractionDataBase {
    scrollXData = 0;
    scrollYData = 0;
    flush() {
        super.flush();
        this.scrollXData = 0;
        this.scrollYData = 0;
    }
    get scrollX() {
        return this.scrollXData;
    }
    get scrollY() {
        return this.scrollYData;
    }
    setScrollData(event) {
        super.copy(event);
        this.scrollXData = window.scrollX;
        this.scrollYData = window.scrollY;
    }
}
