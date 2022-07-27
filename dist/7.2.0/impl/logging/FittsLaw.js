export class FittsLawDataImpl {
    constructor(t, w, h, d) {
        this.d = d;
        this.h = h;
        this.w = w;
        this.t = t;
    }
    getID(we) {
        return Math.log2((this.d / (we ?? this.w)) + 1);
    }
}
export class FittsLaw {
    constructor(bSrc, bTgt, target) {
        this.data = [];
        this.providedTarget = target;
        this.handler = (evt) => {
            if (this._startX === undefined) {
                this._startX = evt.screenX;
                this._startY = evt.screenY;
            }
            this._target = this.providedTarget ?? (evt.target instanceof Element ? evt.target : undefined);
        };
        this.obsSrc = bSrc.produces.subscribe(() => {
            this.reinit();
            document.body.addEventListener("mousemove", this.handler);
            const t0 = performance.now();
            const obsTgt = bTgt.produces.subscribe(() => {
                const t1 = performance.now();
                this.data.push(new FittsLawDataImpl(t1 - t0, this._target?.clientWidth ?? NaN, this._target?.clientHeight ?? NaN, this.computeD()));
                obsTgt.unsubscribe();
                document.body.removeEventListener("mousemove", this.handler);
            });
        });
    }
    computeD() {
        if (this._startX === undefined || this.providedTarget === undefined) {
            return NaN;
        }
        const a = this.providedTarget.clientLeft + this.providedTarget.clientWidth / 2 + this._startX;
        const b = this.providedTarget.clientTop + this.providedTarget.clientHeight / 2 + this._startY;
        return Math.sqrt(a ** 2 + b ** 2);
    }
    get we() {
        const ds = this.data.map(d => d.d);
        const mean = ds.reduce((a, b) => a + b) / ds.length;
        return Math.sqrt(ds.map(x => (x - mean) ** 2).reduce((a, b) => a + b) / ds.length);
    }
    getAB(effectiveTargetW = false) {
        const w = effectiveTargetW ? this.we : undefined;
        const xs = this.data.map(d => d.getID(w));
        const ys = this.data.map(d => d.t);
        let sumx = 0;
        let sumy = 0;
        let sumxy = 0;
        let sumxx = 0;
        let sumyy = 0;
        for (let i = 0; i < ys.length; i++) {
            sumx += xs[i];
            sumy += ys[i];
            sumxy += xs[i] * ys[i];
            sumxx += xs[i] ** 2;
            sumyy += ys[i] * ys[i];
        }
        const tmp = (ys.length * sumxy) - (sumx * sumy);
        const tmp2 = (ys.length * sumxx) - (sumx ** 2);
        const a = tmp / tmp2;
        const b = (sumy - a * sumx) / ys.length;
        const r = (tmp / Math.sqrt(tmp2 * (ys.length * sumyy - sumy ** 2))) ** 2;
        return [a, b, r];
    }
    uninstall() {
        this.obsSrc.unsubscribe();
        this.data.length = 0;
    }
    reinit() {
        this._startX = undefined;
        this._startY = undefined;
        this._target = undefined;
    }
}
