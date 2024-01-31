import { CheckerImpl } from "../checker/CheckerImpl";
export class BindingsContext {
    binds;
    disposables;
    cmds;
    checker;
    constructor() {
        this.binds = [];
        this.disposables = [];
        this.cmds = [];
        this.checker = new CheckerImpl();
    }
    observeBinding(binding) {
        this.checker.checkRules(binding, this.binds);
        this.binds.push(binding);
        this.disposables.push(binding.produces.subscribe(cmd => this.cmds.push([cmd, binding])));
    }
    clearObservedBindings() {
        for (const dispos of this.disposables) {
            dispos.unsubscribe();
        }
        for (const bind of this.binds) {
            bind.uninstallBinding();
        }
    }
    get bindings() {
        return this.binds;
    }
    get commands() {
        return this.cmds.map(tuple => tuple[0]);
    }
    getCmd(index) {
        return this.cmds[index]?.[0];
    }
    getCmdsProducedBy(binding) {
        return this.cmds
            .filter(cmd => cmd[1] === binding)
            .map(cmd => cmd[0]);
    }
}
