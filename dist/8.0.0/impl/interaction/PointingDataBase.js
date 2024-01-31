import { InteractionDataBase } from "./InteractionDataBase";
export class PointingDataBase extends InteractionDataBase {
    clientXData = 0;
    clientYData = 0;
    pageXData = 0;
    pageYData = 0;
    screenXData = 0;
    screenYData = 0;
    altKeyData = false;
    ctrlKeyData = false;
    metaKeyData = false;
    shiftKeyData = false;
    flush() {
        super.flush();
        this.clientXData = 0;
        this.clientYData = 0;
        this.pageXData = 0;
        this.pageYData = 0;
        this.screenXData = 0;
        this.screenYData = 0;
        this.altKeyData = false;
        this.ctrlKeyData = false;
        this.metaKeyData = false;
        this.shiftKeyData = false;
    }
    copy(data) {
        super.copy(data);
        this.clientXData = data.clientX;
        this.clientYData = data.clientY;
        this.pageXData = data.pageX;
        this.pageYData = data.pageY;
        this.screenXData = data.screenX;
        this.screenYData = data.screenY;
        this.altKeyData = data.altKey;
        this.ctrlKeyData = data.ctrlKey;
        this.metaKeyData = data.metaKey;
        this.shiftKeyData = data.shiftKey;
    }
    get clientX() {
        return this.clientXData;
    }
    get clientY() {
        return this.clientYData;
    }
    get pageX() {
        return this.pageXData;
    }
    get pageY() {
        return this.pageYData;
    }
    get screenX() {
        return this.screenXData;
    }
    get screenY() {
        return this.screenYData;
    }
    get altKey() {
        return this.altKeyData;
    }
    get ctrlKey() {
        return this.ctrlKeyData;
    }
    get metaKey() {
        return this.metaKeyData;
    }
    get shiftKey() {
        return this.shiftKeyData;
    }
}
