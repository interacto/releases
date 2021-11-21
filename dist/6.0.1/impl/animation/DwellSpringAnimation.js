export class DwellSpringAnimation {
    constructor(handle, spring) {
        var _a;
        this.displaySpring = false;
        this.radius = parseInt((_a = handle.nativeElement.getAttribute("r")) !== null && _a !== void 0 ? _a : "20", 10);
        this.handle = handle;
        this.spring = spring;
        this.positionSpring = {
            "x": 0,
            "y": 0
        };
    }
    process(i) {
        if (this.displaySpring) {
            const distance = Math.sqrt((i.tgt.clientX - this.positionSpring.x) ** 2 + (i.tgt.pageY - this.positionSpring.y) ** 2);
            if (Math.abs(distance) > (this.radius * 4)) {
                this.spring.nativeElement.setAttribute("display", "none");
                this.handle.nativeElement.setAttribute("display", "none");
                this.displaySpring = false;
            }
        }
        else {
            clearInterval(this.interval);
            this.interval = window.setInterval(() => {
                clearInterval(this.interval);
                this.displaySpring = true;
                this.positionSpring = {
                    "x": i.tgt.clientX < this.radius ? this.radius : i.tgt.pageX - this.radius * 2,
                    "y": i.tgt.pageY
                };
                this.spring.nativeElement.setAttribute("display", "block");
                this.handle.nativeElement.setAttribute("display", "block");
                this.handle.nativeElement.setAttribute("cx", String(this.positionSpring.x));
                this.handle.nativeElement.setAttribute("cy", String(this.positionSpring.y));
                this.spring.nativeElement.setAttribute("x1", String(i.src.pageX));
                this.spring.nativeElement.setAttribute("y1", String(i.src.pageY));
                this.spring.nativeElement.setAttribute("x2", String(this.positionSpring.x));
                this.spring.nativeElement.setAttribute("y2", String(i.tgt.pageY));
            }, 1000);
        }
    }
    end() {
        clearInterval(this.interval);
        this.displaySpring = false;
        this.spring.nativeElement.setAttribute("display", "none");
        this.handle.nativeElement.setAttribute("display", "none");
    }
}
