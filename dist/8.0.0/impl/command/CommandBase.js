export class CommandBase {
    status;
    constructor() {
        this.status = "created";
    }
    flush() {
        this.status = "flushed";
    }
    createMemento() { }
    execute() {
        let ok;
        if ((this.status === "created" || this.status === "executed") && this.canExecute()) {
            if (this.status === "created") {
                this.createMemento();
            }
            ok = true;
            try {
                const result = this.execution();
                if (result instanceof Promise) {
                    return result
                        .then(() => {
                        this.status = "executed";
                        return true;
                    })
                        .catch(() => {
                        this.status = "executed";
                        return false;
                    });
                }
            }
            catch (error) {
                this.status = "executed";
                throw error;
            }
            this.status = "executed";
        }
        else {
            ok = false;
        }
        return ok;
    }
    hadEffect() {
        return this.isDone();
    }
    done() {
        if (this.status === "created" || this.status === "executed") {
            this.status = "done";
        }
    }
    isDone() {
        return this.status === "done";
    }
    cancel() {
        this.status = "cancelled";
    }
    getStatus() {
        return this.status;
    }
    canExecute() {
        return true;
    }
}
