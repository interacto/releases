import { Subject } from 'rxjs';

function isEltRef(obj) {
  if (obj === void 0 || obj === null) {
    return false;
  }
  return obj.nativeElement instanceof EventTarget;
}

function isWhenAtStart(type) {
  return type === "strictStart" || type === "then" || type === "nonStrict" || type === "strict";
}
function isWhenAtThen(type) {
  return type === "strictThen" || type === "then" || type === "nonStrict" || type === "strict";
}
function isWhenAtEnd(type) {
  return type === "end" || type === "nonStrict" || type === "strict";
}
function isWhenStrict(type) {
  return type === "end" || type === "strict" || type === "strictThen" || type === "strictStart";
}

class Bindings {
}

const mouseEventTypes = [
  "mousedown",
  "mouseup",
  "mousemove",
  "mouseover",
  "mouseout",
  "mouseenter",
  "mouseleave",
  "click",
  "auxclick"
];
const touchEventTypes = [
  "touchstart",
  "touchend",
  "touchmove"
];
const keyEventTypes = [
  "keydown",
  "keyup"
];
const eventTypes = [
  ...mouseEventTypes,
  ...touchEventTypes,
  ...keyEventTypes,
  "input",
  "scroll",
  "change",
  "wheel"
];

function isOutputStateType(obj) {
  if (obj === void 0) {
    return false;
  }
  return "exit" in obj && "addTransition" in obj && "process" in obj && "transitions" in obj;
}

class TreeUndoHistory {
}

class UndoHistory {
}

function isUndoableType(obj) {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  return "undo" in obj && "redo" in obj && "getUndoName" in obj;
}

var __defProp$1n = Object.defineProperty;
var __defNormalProp$1n = (obj, key, value) => key in obj ? __defProp$1n(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1n = (obj, key, value) => {
  __defNormalProp$1n(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class DwellSpringAnimation {
  constructor(handle, spring) {
    __publicField$1n(this, "displaySpring", false);
    __publicField$1n(this, "interval");
    __publicField$1n(this, "positionSpring");
    __publicField$1n(this, "radius");
    __publicField$1n(this, "handle");
    __publicField$1n(this, "spring");
    this.interval = void 0;
    this.radius = Number.parseInt(handle.nativeElement.getAttribute("r") ?? "20", 10);
    this.handle = handle;
    this.spring = spring;
    this.positionSpring = {
      "x": 0,
      "y": 0
    };
  }
  process(i) {
    if (this.displaySpring) {
      const distance = Math.hypot(i.tgt.clientX - this.positionSpring.x, i.tgt.clientY - this.positionSpring.y);
      if (Math.abs(distance) > this.radius * 4) {
        this.spring.nativeElement.setAttribute("display", "none");
        this.handle.nativeElement.setAttribute("display", "none");
        this.displaySpring = false;
      }
    } else {
      clearInterval(this.interval);
      this.interval = window.setInterval(() => {
        clearInterval(this.interval);
        this.displaySpring = true;
        this.positionSpring = {
          "x": i.tgt.clientX < this.radius ? this.radius : i.tgt.clientX - this.radius * 2,
          "y": i.tgt.clientY
        };
        this.spring.nativeElement.setAttribute("display", "block");
        this.handle.nativeElement.setAttribute("display", "block");
        this.handle.nativeElement.setAttribute("cx", String(this.positionSpring.x));
        this.handle.nativeElement.setAttribute("cy", String(this.positionSpring.y));
        this.spring.nativeElement.setAttribute("x1", String(i.src.clientX));
        this.spring.nativeElement.setAttribute("y1", String(i.src.clientY));
        this.spring.nativeElement.setAttribute("x2", String(this.positionSpring.x));
        this.spring.nativeElement.setAttribute("y2", String(i.tgt.clientY));
      }, 1e3);
    }
  }
  end() {
    clearInterval(this.interval);
    this.displaySpring = false;
    this.spring.nativeElement.setAttribute("display", "none");
    this.handle.nativeElement.setAttribute("display", "none");
  }
}

var __defProp$1m = Object.defineProperty;
var __defNormalProp$1m = (obj, key, value) => key in obj ? __defProp$1m(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1m = (obj, key, value) => {
  __defNormalProp$1m(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class CommandBase {
  /**
   * Creates the command with the status 'created'.
   */
  constructor() {
    /**
     * The state of the command.
     */
    __publicField$1m(this, "status");
    this.status = "created";
  }
  /**
   * Flushes the UI command.
   * The command must not be used after that.
   */
  flush() {
    this.status = "flushed";
  }
  /**
   * Actions may need to create a memento before their first execution.
   * This is the goal of the operation that should be overridden.
   * This operator is called a single time before the first execution of the command.
   */
  createMemento() {
  }
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
          return result.then(() => {
            this.status = "executed";
            return true;
          }).catch(() => {
            this.status = "executed";
            return false;
          });
        }
      } catch (error) {
        this.status = "executed";
        throw error;
      }
      this.status = "executed";
    } else {
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

var __defProp$1l = Object.defineProperty;
var __defNormalProp$1l = (obj, key, value) => key in obj ? __defProp$1l(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1l = (obj, key, value) => {
  __defNormalProp$1l(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class AnonCmd extends CommandBase {
  constructor(fct) {
    super();
    __publicField$1l(this, "exec");
    this.exec = fct;
  }
  canExecute() {
    return true;
  }
  execution() {
    this.exec();
  }
}

var __defProp$1k = Object.defineProperty;
var __defNormalProp$1k = (obj, key, value) => key in obj ? __defProp$1k(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1k = (obj, key, value) => {
  __defNormalProp$1k(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Binder {
  constructor(undoHistory, logger, observer, binder, acc) {
    __publicField$1k(this, "firstFn");
    __publicField$1k(this, "produceFn");
    __publicField$1k(this, "widgets");
    __publicField$1k(this, "dynamicNodes");
    __publicField$1k(this, "usingFn");
    __publicField$1k(this, "hadEffectsFn");
    __publicField$1k(this, "hadNoEffectFn");
    __publicField$1k(this, "cannotExecFn");
    __publicField$1k(this, "endFn");
    __publicField$1k(this, "onErrFn");
    __publicField$1k(this, "logLevels");
    __publicField$1k(this, "stopPropagation");
    __publicField$1k(this, "prevDefault");
    __publicField$1k(this, "bindingName");
    __publicField$1k(this, "observer");
    __publicField$1k(this, "undoHistory");
    __publicField$1k(this, "logger");
    __publicField$1k(this, "whenFnArray", []);
    __publicField$1k(this, "firstFnArray", []);
    __publicField$1k(this, "endFnArray", []);
    __publicField$1k(this, "hadEffectsFnArray", []);
    __publicField$1k(this, "hadNoEffectFnArray", []);
    __publicField$1k(this, "cannotExecFnArray", []);
    __publicField$1k(this, "onErrFnArray", []);
    __publicField$1k(this, "accInit");
    __publicField$1k(this, "linterRules");
    this.widgets = [];
    this.dynamicNodes = [];
    this.logLevels = [];
    this.linterRules = /* @__PURE__ */ new Map();
    this.stopPropagation = false;
    this.prevDefault = false;
    Object.assign(this, binder);
    this.accInit = acc;
    this.undoHistory = undoHistory;
    this.logger = logger;
    this.observer = observer;
    this.copyFnArrays();
  }
  /**
   * Clones the arrays containing the routine functions after a binder is copied.
   */
  copyFnArrays() {
    this.whenFnArray = Array.from(this.whenFnArray);
    this.firstFnArray = Array.from(this.firstFnArray);
    this.firstFn = (c, i, acc) => {
      for (const fn of this.firstFnArray) {
        fn(c, i, acc);
      }
    };
    this.endFnArray = Array.from(this.endFnArray);
    this.endFn = (c, i, acc) => {
      for (const fn of this.endFnArray) {
        fn(c, i, acc);
      }
    };
    this.hadEffectsFnArray = Array.from(this.hadEffectsFnArray);
    this.hadEffectsFn = (c, i, acc) => {
      for (const fn of this.hadEffectsFnArray) {
        fn(c, i, acc);
      }
    };
    this.hadNoEffectFnArray = Array.from(this.hadNoEffectFnArray);
    this.hadNoEffectFn = (c, i, acc) => {
      for (const fn of this.hadNoEffectFnArray) {
        fn(c, i, acc);
      }
    };
    this.cannotExecFnArray = Array.from(this.cannotExecFnArray);
    this.cannotExecFn = (c, i, acc) => {
      for (const fn of this.cannotExecFnArray) {
        fn(c, i, acc);
      }
    };
    this.onErrFnArray = Array.from(this.onErrFnArray);
    this.onErrFn = (ex) => {
      for (const fn of this.onErrFnArray) {
        fn(ex);
      }
    };
  }
  on(widget, ...widgets) {
    const ws = Array.from(widgets).concat(widget).map((currWidget2) => {
      if (isEltRef(currWidget2)) {
        return currWidget2.nativeElement;
      }
      return currWidget2;
    });
    const currWidget = this.widgets.length === 0 ? ws : Array.from(this.widgets).concat(ws);
    const dup = this.duplicate();
    dup.widgets = currWidget;
    return dup;
  }
  onDynamic(node) {
    const dup = this.duplicate();
    const nodeEvt = isEltRef(node) ? node.nativeElement : node;
    dup.dynamicNodes = Array.from(this.dynamicNodes).concat(nodeEvt);
    return dup;
  }
  first(fn) {
    const dup = this.duplicate();
    dup.firstFnArray.push(fn);
    return dup;
  }
  when(fn, mode = "nonStrict") {
    const dup = this.duplicate();
    dup.whenFnArray.push({
      fn,
      "type": mode
    });
    return dup;
  }
  ifHadEffects(fn) {
    const dup = this.duplicate();
    dup.hadEffectsFnArray.push(fn);
    return dup;
  }
  ifHadNoEffect(fn) {
    const dup = this.duplicate();
    dup.hadNoEffectFnArray.push(fn);
    return dup;
  }
  ifCannotExecute(fn) {
    const dup = this.duplicate();
    dup.cannotExecFnArray.push(fn);
    return dup;
  }
  end(fn) {
    const dup = this.duplicate();
    dup.endFnArray.push(fn);
    return dup;
  }
  log(...level) {
    const dup = this.duplicate();
    dup.logLevels = Array.from(level);
    return dup;
  }
  stopImmediatePropagation() {
    const dup = this.duplicate();
    dup.stopPropagation = true;
    return dup;
  }
  preventDefault() {
    const dup = this.duplicate();
    dup.prevDefault = true;
    return dup;
  }
  catch(fn) {
    const dup = this.duplicate();
    dup.onErrFnArray.push(fn);
    return dup;
  }
  name(name) {
    const dup = this.duplicate();
    dup.bindingName = name;
    return dup;
  }
  configureRules(ruleName, severity) {
    const dup = this.duplicate();
    dup.linterRules.set(ruleName, severity);
    return dup;
  }
  usingInteraction(fn) {
    const dup = this.duplicate();
    dup.usingFn = fn;
    return dup;
  }
  toProduce(fn) {
    const dup = this.duplicate();
    dup.produceFn = fn;
    return dup;
  }
  toProduceAnon(fn) {
    const dup = this.duplicate();
    dup.produceFn = () => new AnonCmd(fn);
    return dup;
  }
}

class MustBeUndoableCmdError extends Error {
  constructor(cmdProducer) {
    super(`The following command must be undoable: ${String(cmdProducer)}`);
    this.name = "MustBeUndoableCmdError";
  }
}

var __defProp$1j = Object.defineProperty;
var __defNormalProp$1j = (obj, key, value) => key in obj ? __defProp$1j(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1j = (obj, key, value) => {
  __defNormalProp$1j(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class BindingImpl {
  /**
   * Creates a binding.
   * @param continuousExecution - Specifies whether the command must be executed on each step of the interaction.
   * @param interaction - The user interaction of the binding.
   * @param cmdProducer - The type of the command that will be created. Used to instantiate the command by reflexivity.
   * The class must be public and must have a constructor with no parameter.
   * @param widgets - The widgets on which the binding will operate.
   * @param undoHistory - The undo/redo history.
   * @param logger - The logger to use
   * @param linterRules - The linting rules to use
   * @param name - The optional name of the binding. If not provided, computed based on the interaction and command names
   * @param accInit - The initial accumulator to use during the binding execution.
   */
  constructor(continuousExecution, interaction, cmdProducer, widgets, undoHistory, logger, linterRules, name, accInit) {
    __publicField$1j(this, "_name");
    __publicField$1j(this, "_timeEnded");
    __publicField$1j(this, "_timeCancelled");
    __publicField$1j(this, "_activated");
    /**
     * The source interaction.
     */
    __publicField$1j(this, "_interaction");
    __publicField$1j(this, "accumulator");
    __publicField$1j(this, "linterRules");
    /**
     * The current action in progress.
     */
    __publicField$1j(this, "_cmd");
    __publicField$1j(this, "continuousCmdExecution");
    /**
     * The command class to instantiate.
     */
    __publicField$1j(this, "cmdProducer");
    __publicField$1j(this, "cmdsProduced");
    __publicField$1j(this, "accumulatorInit");
    __publicField$1j(this, "undoHistory");
    __publicField$1j(this, "logger");
    __publicField$1j(this, "logBinding");
    /**
     * Logs binding usage information, to perform data analysis on usage
     */
    __publicField$1j(this, "logCmd");
    __publicField$1j(this, "logUsage");
    this._name = name;
    this.linterRules = linterRules;
    this.accumulatorInit = accInit;
    this.logBinding = false;
    this.logCmd = false;
    this.logUsage = false;
    this._timeCancelled = 0;
    this._timeEnded = 0;
    this.accumulator = { ...this.accumulatorInit };
    this.cmdsProduced = new Subject();
    this.cmdProducer = cmdProducer;
    this._interaction = interaction;
    this._cmd = void 0;
    this.continuousCmdExecution = continuousExecution;
    this._activated = true;
    this.undoHistory = undoHistory;
    this.logger = logger;
    this._interaction.fsm.addHandler({
      "fsmStarts": () => {
        this.fsmStarts();
      },
      "fsmUpdates": () => {
        this.fsmUpdates();
      },
      "fsmStops": () => {
        this.fsmStops();
      },
      "fsmCancels": () => {
        this.fsmCancels();
      },
      "fsmError": (err) => {
        this.fsmError(err);
      }
    });
    interaction.registerToNodes(widgets);
  }
  reinitAccumulator() {
    this.accumulator = { ...this.accumulatorInit };
  }
  get name() {
    return this._name ?? this._interaction.constructor.name;
  }
  whenStart() {
    return true;
  }
  whenUpdate() {
    return true;
  }
  whenStop() {
    return true;
  }
  /**
   * Stops the interaction and clears all its events waiting for a process.
   */
  clearEvents() {
    this._interaction.fullReinit();
  }
  /**
   * creates the command of the binding. If the attribute 'cmd' is not null, nothing will be done.
   * @returns The created command or undefined if an error occurred
   */
  createCommand() {
    try {
      const cmd = this.cmdProducer(this.interaction.data);
      if (this._name === void 0) {
        this._name = `${this._interaction.constructor.name}:${cmd.constructor.name}`;
      }
      return cmd;
    } catch (error) {
      this.logger.logBindingErr("Error while creating a command", error);
      this.catch(error);
      return void 0;
    }
  }
  isWhenDefined() {
    return false;
  }
  /**
   * Called when an error appeared during the execution of the binding. To override.
   * @param _err - The error.
   */
  catch(_err) {
  }
  /**
   * After being created, this method initialises the command. To override.
   */
  first() {
  }
  /**
   * Updates the current command. To override.
   */
  // eslint-disable-next-line unicorn/no-thenable
  then() {
  }
  /**
   * When the interaction ends. To override.
   */
  end() {
  }
  /**
   * When the interaction is cancelled. To override.
   */
  cancel() {
  }
  /**
   * When the interaction ends or is cancelled. To override.
   */
  endOrCancel() {
  }
  /**
   * Called when an executed command did not had effect. To override.
   */
  ifCmdHadNoEffect() {
  }
  /**
   * Called when an executed command had effects. To override.
   */
  ifCmdHadEffects() {
  }
  /**
   * Called when an ongoing command cannot be executed. To override.
   */
  ifCannotExecuteCmd() {
  }
  get interaction() {
    return this._interaction;
  }
  get command() {
    return this._cmd;
  }
  get activated() {
    return this._activated;
  }
  set activated(activated) {
    if (this.logBinding) {
      this.logger.logBindingMsg(`Binding Activated: ${String(activated)}`);
    }
    this._activated = activated;
    this._interaction.setActivated(activated);
    if (!this._activated && this._cmd !== void 0) {
      this._cmd.flush();
      this._cmd = void 0;
    }
    this.reinitAccumulator();
  }
  get running() {
    return this._interaction.isRunning();
  }
  fsmError(err) {
    if (this.logBinding) {
      this.logger.logBindingErr("", err);
    }
    this.catch(err);
  }
  fsmCancels() {
    if (this._cmd !== void 0) {
      if (this.logBinding) {
        this.logger.logBindingMsg("Binding cancelled");
      }
      this._cmd.cancel();
      if (this.logCmd) {
        this.logger.logCmdMsg("Cancelling command", this._cmd.constructor.name);
      }
      try {
        if (this.continuousCmdExecution) {
          this.cancelContinousWithEffectsCmd(this._cmd);
        }
      } finally {
        this._cmd = void 0;
        this.cancel();
        this.endOrCancel();
        this._timeCancelled++;
      }
    }
    this.reinitAccumulator();
    if (this.logUsage) {
      this.logger.logBindingEnd(this.name, true);
    }
  }
  cancelContinousWithEffectsCmd(cmd) {
    if (isUndoableType(cmd)) {
      cmd.undo();
      if (this.logCmd) {
        this.logger.logCmdMsg("Command undone", cmd.constructor.name);
      }
    } else {
      throw new MustBeUndoableCmdError(cmd);
    }
  }
  fsmStarts() {
    if (!this._activated) {
      return;
    }
    const ok = this.whenStart();
    if (this.logBinding) {
      this.logger.logBindingMsg(`Starting binding: ${String(ok)}`);
    }
    if (ok) {
      this.reinitAccumulator();
      this._cmd = this.createCommand();
      if (this._cmd !== void 0) {
        this.first();
        if (this.logCmd) {
          this.logger.logCmdMsg("Command created and init", this._cmd.constructor.name);
        }
      }
    }
    if (this.logUsage) {
      this.logger.logBindingStart(this.name);
    }
  }
  fsmUpdates() {
    if (!this._activated) {
      return;
    }
    if (this.logBinding) {
      this.logger.logBindingMsg("Binding updates");
    }
    const cmd = this.createAndInitCommand(this.whenUpdate());
    if (cmd !== void 0) {
      if (this.logCmd) {
        this.logger.logCmdMsg("Command update");
      }
      this.then();
      if (this.continuousCmdExecution) {
        this.continuousExecutionOnFSMUpdate(cmd);
      }
    }
  }
  continuousExecutionOnFSMUpdate(cmd) {
    const ok = cmd.execute();
    if (this.logCmd) {
      this.logger.logCmdMsg(`Try to execute command (continuous execution), is cmd undefined? ${String(this._cmd === void 0)}`);
    }
    if (ok instanceof Promise) {
      ok.then((executed) => {
        if (!executed) {
          this.ifCannotExecuteCmd();
        }
        if (this.logCmd) {
          this.logger.logCmdMsg(`Continuous command execution had this result: ${String(executed)}`);
        }
      }).catch((error) => {
        this.logger.logCmdErr("Error while executing the command continuously", error);
      });
    } else {
      if (!ok) {
        this.ifCannotExecuteCmd();
      }
      if (this.logCmd) {
        this.logger.logCmdMsg(`Continuous command execution had this result: ${String(ok)}`);
      }
    }
  }
  fsmStops() {
    if (!this._activated) {
      return;
    }
    if (this.logBinding) {
      this.logger.logBindingMsg("Binding stops");
    }
    let cancelled = false;
    const cmd = this.createAndInitCommand(this.whenStop());
    if (cmd === void 0) {
      if (this._cmd !== void 0) {
        if (this.logCmd) {
          this.logger.logCmdMsg("Cancelling the command");
        }
        this._cmd.cancel();
        try {
          if (this.continuousCmdExecution) {
            this.cancelContinousWithEffectsCmd(this._cmd);
          }
        } finally {
          this._cmd = void 0;
          this.cancel();
          this.endOrCancel();
          this._timeCancelled++;
          cancelled = true;
        }
      }
    } else {
      this.executeCommandOnFSMStop(cmd);
    }
    this.reinitAccumulator();
    if (this.logUsage) {
      this.logger.logBindingEnd(this.name, cancelled);
    }
  }
  executeCommandOnFSMStop(cmd) {
    if (!this.continuousCmdExecution) {
      this.then();
      if (this.logCmd) {
        this.logger.logCmdMsg("Command updated");
      }
    }
    const result = cmd.execute();
    if (result instanceof Promise) {
      result.then((executed) => {
        this._cmd = cmd;
        this.afterCmdExecuted(cmd, executed);
        this._cmd = void 0;
        this._timeEnded++;
      }).catch((error) => {
        this.logger.logCmdErr("Error while executing the command", error);
        this._cmd = void 0;
        this._timeEnded++;
      });
    } else {
      this.afterCmdExecuted(cmd, result);
      this._cmd = void 0;
      this._timeEnded++;
    }
  }
  createAndInitCommand(whenOk) {
    if (this.logBinding) {
      this.logger.logBindingMsg(`when predicate is ${String(whenOk)}`);
    }
    if (whenOk) {
      if (this._cmd === void 0) {
        if (this.logCmd) {
          this.logger.logCmdMsg("Command creation");
        }
        this._cmd = this.createCommand();
        if (this._cmd !== void 0) {
          this.first();
        }
      }
      return this._cmd;
    }
    return void 0;
  }
  afterCmdExecuted(cmd, ok) {
    if (this.logCmd) {
      this.logger.logCmdMsg(`Command execution had this result: ${String(ok)}`);
    }
    if (ok) {
      this.end();
      this.endOrCancel();
    } else {
      this.ifCannotExecuteCmd();
    }
    if (cmd.getStatus() !== "executed") {
      return;
    }
    cmd.done();
    this.cmdsProduced.next(cmd);
    const hadEffect = cmd.hadEffect();
    if (this.logCmd) {
      this.logger.logCmdMsg(`Command execution had effect: ${String(hadEffect)}`);
    }
    if (hadEffect) {
      if (isUndoableType(cmd)) {
        this.undoHistory.add(cmd);
      }
      this.ifCmdHadEffects();
    } else {
      this.ifCmdHadNoEffect();
    }
  }
  uninstallBinding() {
    this.activated = false;
    this.cmdsProduced.complete();
    this.logBinding = false;
    this.logCmd = false;
    this.logUsage = false;
    this._interaction.uninstall();
  }
  get produces() {
    return this.cmdsProduced;
  }
  get timesEnded() {
    return this._timeEnded;
  }
  get timesCancelled() {
    return this._timeCancelled;
  }
  acceptVisitor(visitor) {
    visitor.visitBinding(this);
  }
}

class CancelFSMError extends Error {
  constructor() {
    super();
    this.name = "CancelFSMError";
  }
}

var __defProp$1i = Object.defineProperty;
var __defNormalProp$1i = (obj, key, value) => key in obj ? __defProp$1i(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1i = (obj, key, value) => {
  __defNormalProp$1i(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class AnonBinding extends BindingImpl {
  constructor(continuousExec, interaction, undoHistory, logger, cmdSupplierFn, widgets, dynamicNodes, loggers, timeoutThrottle, stopPropagation, prevDefault, linterRules, firstFn, thenFn, whenFn, endFn, cancelFn, endOrCancelFn, hadEffectsFn, hadNoEffectFn, cannotExecFn, onErrFn, name, accInit) {
    super(continuousExec, interaction, cmdSupplierFn, widgets, undoHistory, logger, linterRules, name, accInit);
    __publicField$1i(this, "firstFn");
    __publicField$1i(this, "thenFn");
    __publicField$1i(this, "whenFn");
    __publicField$1i(this, "cancelFn");
    __publicField$1i(this, "endOrCancelFn");
    __publicField$1i(this, "hadEffectsFn");
    __publicField$1i(this, "hadNoEffectFn");
    __publicField$1i(this, "cannotExecFn");
    __publicField$1i(this, "onEndFn");
    __publicField$1i(this, "onErrFn");
    this.configureLoggers(loggers);
    this.firstFn = firstFn;
    this.thenFn = thenFn;
    this.cancelFn = cancelFn;
    this.endOrCancelFn = endOrCancelFn;
    this.whenFn = whenFn;
    this.onEndFn = endFn;
    this.hadEffectsFn = hadEffectsFn;
    this.hadNoEffectFn = hadNoEffectFn;
    this.cannotExecFn = cannotExecFn;
    this.onErrFn = onErrFn;
    this.interaction.stopImmediatePropagation = stopPropagation;
    this.interaction.preventDefault = prevDefault;
    this.interaction.setThrottleTimeout(timeoutThrottle);
    for (const node of dynamicNodes) {
      interaction.registerToNodeChildren(node);
    }
  }
  configureLoggers(loggers) {
    if (loggers.length > 0) {
      this.logCmd = loggers.includes("command");
      this.logBinding = loggers.includes("binding");
      this.logUsage = loggers.includes("usage");
      this.interaction.log(loggers.includes("interaction"));
    }
  }
  first() {
    const cmd = this.command;
    if (this.firstFn !== void 0 && cmd !== void 0) {
      try {
        this.firstFn(cmd, this.interaction.data, this.accumulator);
      } catch (error) {
        this.catch(error);
        this.logger.logBindingErr("Crash in 'first'", error);
      }
    }
  }
  // eslint-disable-next-line unicorn/no-thenable
  then() {
    const cmd = this.command;
    if (this.thenFn !== void 0 && cmd !== void 0) {
      try {
        this.thenFn(cmd, this.interaction.data, this.accumulator);
      } catch (error) {
        this.catch(error);
        this.logger.logBindingErr("Crash in 'then'", error);
      }
    }
  }
  end() {
    const cmd = this.command;
    if (this.onEndFn !== void 0 && cmd !== void 0) {
      try {
        this.onEndFn(cmd, this.interaction.data, this.accumulator);
      } catch (error) {
        this.catch(error);
        this.logger.logBindingErr("Crash in 'end'", error);
      }
    }
  }
  cancel() {
    if (this.cancelFn !== void 0) {
      try {
        this.cancelFn(this.interaction.data, this.accumulator);
      } catch (error) {
        this.catch(error);
        this.logger.logBindingErr("Crash in 'cancel'", error);
      }
    }
  }
  endOrCancel() {
    if (this.endOrCancelFn !== void 0) {
      try {
        this.endOrCancelFn(this.interaction.data, this.accumulator);
      } catch (error) {
        this.catch(error);
        this.logger.logBindingErr("Crash in 'endOrCancel'", error);
      }
    }
  }
  ifCmdHadNoEffect() {
    const cmd = this.command;
    if (this.hadNoEffectFn !== void 0 && cmd !== void 0) {
      try {
        this.hadNoEffectFn(cmd, this.interaction.data, this.accumulator);
      } catch (error) {
        this.catch(error);
        this.logger.logBindingErr("Crash in 'ifHadNoEffect'", error);
      }
    }
  }
  ifCmdHadEffects() {
    const cmd = this.command;
    if (this.hadEffectsFn !== void 0 && cmd !== void 0) {
      try {
        this.hadEffectsFn(cmd, this.interaction.data, this.accumulator);
      } catch (error) {
        this.catch(error);
        this.logger.logBindingErr("Crash in 'ifHadEffects'", error);
      }
    }
  }
  ifCannotExecuteCmd() {
    const cmd = this.command;
    if (this.cannotExecFn !== void 0 && cmd !== void 0) {
      try {
        this.cannotExecFn(cmd, this.interaction.data, this.accumulator);
      } catch (error) {
        this.catch(error);
        this.logger.logBindingErr("Crash in 'ifCannotExecute'", error);
      }
    }
  }
  whenStart() {
    return this.whenChecker((when) => isWhenAtStart(when.type));
  }
  whenUpdate() {
    return this.whenChecker((when) => isWhenAtThen(when.type));
  }
  whenStop() {
    return this.whenChecker((when) => isWhenAtEnd(when.type));
  }
  whenChecker(filterPredicate) {
    const ok = this.whenFn?.filter(filterPredicate).every((when) => this.executeWhen(when)) ?? false;
    if (this.logBinding) {
      this.logger.logBindingMsg(`Checking condition: ${String(ok)}`);
    }
    return ok;
  }
  executeWhen(when) {
    let res;
    try {
      res = when.fn(this.interaction.data, this.accumulator);
    } catch (error) {
      res = false;
      this.catch(error);
      this.logger.logBindingErr("Crash in checking condition", error);
    }
    if (!res && isWhenStrict(when.type)) {
      if (this.logBinding) {
        this.logger.logBindingMsg(`Cancelling interaction: ${this._interaction.constructor.name}`);
      }
      throw new CancelFSMError();
    }
    return res;
  }
  catch(err) {
    if (this.onErrFn !== void 0) {
      try {
        this.onErrFn(err);
      } catch (error) {
        this.logger.logBindingErr("Crash in 'catch'", error);
      }
    }
  }
  isWhenDefined() {
    return this.whenFn !== void 0 && this.whenFn.length > 0;
  }
}

var __defProp$1h = Object.defineProperty;
var __defNormalProp$1h = (obj, key, value) => key in obj ? __defProp$1h(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1h = (obj, key, value) => {
  __defNormalProp$1h(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class UpdateBinder extends Binder {
  constructor(undoHistory, logger, observer, binder, acc) {
    super(undoHistory, logger, observer, binder, acc);
    __publicField$1h(this, "thenFn");
    __publicField$1h(this, "cancelFn");
    __publicField$1h(this, "endOrCancelFn");
    __publicField$1h(this, "continuousCmdExecution");
    __publicField$1h(this, "throttleTimeout");
    __publicField$1h(this, "thenFnArray", []);
    __publicField$1h(this, "cancelFnArray", []);
    __publicField$1h(this, "endOrCancelFnArray", []);
    this.continuousCmdExecution = false;
    this.throttleTimeout = 0;
    Object.assign(this, binder);
    this.copyFnArraysUpdate();
  }
  copyFnArraysUpdate() {
    super.copyFnArrays();
    this.thenFnArray = Array.from(this.thenFnArray);
    this.thenFn = (c, i, acc) => {
      for (const fn of this.thenFnArray) {
        fn(c, i, acc);
      }
    };
    this.cancelFnArray = Array.from(this.cancelFnArray);
    this.cancelFn = (i, acc) => {
      for (const fn of this.cancelFnArray) {
        fn(i, acc);
      }
    };
    this.endOrCancelFnArray = Array.from(this.endOrCancelFnArray);
    this.endOrCancelFn = (i, acc) => {
      for (const fn of this.endOrCancelFnArray) {
        fn(i, acc);
      }
    };
  }
  // eslint-disable-next-line unicorn/no-thenable
  then(fn) {
    const dup = this.duplicate();
    dup.thenFnArray.push(fn);
    return dup;
  }
  continuousExecution() {
    const dup = this.duplicate();
    dup.continuousCmdExecution = true;
    return dup;
  }
  cancel(fn) {
    const dup = this.duplicate();
    dup.cancelFnArray.push(fn);
    return dup;
  }
  endOrCancel(fn) {
    const dup = this.duplicate();
    dup.endOrCancelFnArray.push(fn);
    return dup;
  }
  throttle(timeout) {
    const dup = this.duplicate();
    dup.throttleTimeout = timeout;
    return dup;
  }
  on(widget, ...widgets) {
    return super.on(widget, ...widgets);
  }
  onDynamic(node) {
    return super.onDynamic(node);
  }
  first(fn) {
    return super.first(fn);
  }
  when(fn, mode) {
    return super.when(fn, mode);
  }
  ifHadEffects(fn) {
    return super.ifHadEffects(fn);
  }
  ifHadNoEffect(fn) {
    return super.ifHadNoEffect(fn);
  }
  ifCannotExecute(fn) {
    return super.ifCannotExecute(fn);
  }
  end(fn) {
    return super.end(fn);
  }
  log(...level) {
    return super.log(...level);
  }
  stopImmediatePropagation() {
    return super.stopImmediatePropagation();
  }
  preventDefault() {
    return super.preventDefault();
  }
  catch(fn) {
    return super.catch(fn);
  }
  name(name) {
    return super.name(name);
  }
  configureRules(ruleName, severity) {
    return super.configureRules(ruleName, severity);
  }
  usingInteraction(fn) {
    return super.usingInteraction(fn);
  }
  toProduce(fn) {
    return super.toProduce(fn);
  }
  toProduceAnon(fn) {
    return super.toProduceAnon(fn);
  }
  duplicate() {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, this);
  }
  bind() {
    if (this.usingFn === void 0) {
      throw new Error("The interaction supplier cannot be undefined here");
    }
    if (this.produceFn === void 0) {
      throw new Error("The command supplier cannot be undefined here");
    }
    const binding = new AnonBinding(
      this.continuousCmdExecution,
      this.usingFn(),
      this.undoHistory,
      this.logger,
      this.produceFn,
      Array.from(this.widgets),
      Array.from(this.dynamicNodes),
      Array.from(this.logLevels),
      this.throttleTimeout,
      this.stopPropagation,
      this.prevDefault,
      new Map(this.linterRules),
      this.firstFn,
      this.thenFn,
      Array.from(this.whenFnArray),
      this.endFn,
      this.cancelFn,
      this.endOrCancelFn,
      this.hadEffectsFn,
      this.hadNoEffectFn,
      this.cannotExecFn,
      this.onErrFn,
      this.bindingName,
      this.accInit
    );
    this.observer?.observeBinding(binding);
    return binding;
  }
}

var __defProp$1g = Object.defineProperty;
var __defNormalProp$1g = (obj, key, value) => key in obj ? __defProp$1g(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1g = (obj, key, value) => {
  __defNormalProp$1g(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class InteractionDataBase {
  constructor() {
    __publicField$1g(this, "currentTargetData", null);
    __publicField$1g(this, "targetData", null);
    __publicField$1g(this, "timeStampData", 0);
  }
  copy(data) {
    this.currentTargetData = data.currentTarget;
    this.targetData = data.target;
    this.timeStampData = data.timeStamp;
  }
  flush() {
    this.currentTargetData = null;
    this.targetData = null;
    this.timeStampData = 0;
  }
  get currentTarget() {
    return this.currentTargetData;
  }
  get target() {
    return this.targetData;
  }
  get timeStamp() {
    return this.timeStampData;
  }
}

var __defProp$1f = Object.defineProperty;
var __defNormalProp$1f = (obj, key, value) => key in obj ? __defProp$1f(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1f = (obj, key, value) => {
  __defNormalProp$1f(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class KeyDataImpl extends InteractionDataBase {
  constructor() {
    super(...arguments);
    __publicField$1f(this, "codeData", "");
    __publicField$1f(this, "keyData", "");
    __publicField$1f(this, "locationData", 0);
    __publicField$1f(this, "repeatData", false);
    __publicField$1f(this, "altKeyData", false);
    __publicField$1f(this, "ctrlKeyData", false);
    __publicField$1f(this, "metaKeyData", false);
    __publicField$1f(this, "shiftKeyData", false);
  }
  flush() {
    super.flush();
    this.codeData = "";
    this.keyData = "";
    this.locationData = 0;
    this.repeatData = false;
    this.altKeyData = false;
    this.ctrlKeyData = false;
    this.metaKeyData = false;
    this.shiftKeyData = false;
  }
  copy(data) {
    super.copy(data);
    this.codeData = data.code;
    this.keyData = data.key;
    this.locationData = data.location;
    this.repeatData = data.repeat;
    this.altKeyData = data.altKey;
    this.ctrlKeyData = data.ctrlKey;
    this.metaKeyData = data.metaKey;
    this.shiftKeyData = data.shiftKey;
  }
  get altKey() {
    return this.altKeyData;
  }
  get code() {
    return this.codeData;
  }
  get ctrlKey() {
    return this.ctrlKeyData;
  }
  get key() {
    return this.keyData;
  }
  get location() {
    return this.locationData;
  }
  get metaKey() {
    return this.metaKeyData;
  }
  get repeat() {
    return this.repeatData;
  }
  get shiftKey() {
    return this.shiftKeyData;
  }
}

var __defProp$1e = Object.defineProperty;
var __defNormalProp$1e = (obj, key, value) => key in obj ? __defProp$1e(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1e = (obj, key, value) => {
  __defNormalProp$1e(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class KeysDataImpl {
  constructor() {
    __publicField$1e(this, "keysData", []);
  }
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

var __defProp$1d = Object.defineProperty;
var __defNormalProp$1d = (obj, key, value) => key in obj ? __defProp$1d(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1d = (obj, key, value) => {
  __defNormalProp$1d(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class KeysBinder extends UpdateBinder {
  // private readonly checkCodeFn: (i: InteractionData) => boolean;
  constructor(undoHistory, logger, observer, binder, acc) {
    super(undoHistory, logger, observer, binder, acc);
    __publicField$1d(this, "keysOrCodes");
    __publicField$1d(this, "isCode");
    this.isCode = false;
    this.keysOrCodes = [];
    Object.assign(this, binder);
    this.copyFnArraysUpdate();
    this.keysOrCodes = this.keysOrCodes === void 0 ? [] : Array.from(this.keysOrCodes);
    this.completeWhenWithKeysPredicates();
  }
  completeWhenWithKeysPredicates() {
    const checkCodeFn = (i) => {
      let currentKeys = [];
      if (this.isCode) {
        if (i instanceof KeysDataImpl) {
          currentKeys = i.keys.map((key) => key.code);
        } else {
          if (i instanceof KeyDataImpl) {
            currentKeys = [i.code];
          }
        }
      } else {
        if (i instanceof KeysDataImpl) {
          currentKeys = i.keys.map((key) => key.key);
        } else {
          if (i instanceof KeyDataImpl) {
            currentKeys = [i.key];
          }
        }
      }
      return this.keysOrCodes.length === 0 || this.keysOrCodes.length === currentKeys.length && currentKeys.every((key) => this.keysOrCodes.includes(key));
    };
    this.whenFnArray.push({
      "fn": checkCodeFn,
      "type": "nonStrict"
    });
  }
  with(isCode, ...keysOrCodes) {
    const dup = this.duplicate();
    dup.keysOrCodes = Array.from(keysOrCodes);
    dup.isCode = isCode;
    return dup;
  }
  on(widget, ...widgets) {
    return super.on(widget, ...widgets);
  }
  onDynamic(node) {
    return super.onDynamic(node);
  }
  first(fn) {
    return super.first(fn);
  }
  when(fn, mode) {
    return super.when(fn, mode);
  }
  ifHadEffects(fn) {
    return super.ifHadEffects(fn);
  }
  ifHadNoEffect(fn) {
    return super.ifHadNoEffect(fn);
  }
  ifCannotExecute(fn) {
    return super.ifCannotExecute(fn);
  }
  end(fn) {
    return super.end(fn);
  }
  log(...level) {
    return super.log(...level);
  }
  stopImmediatePropagation() {
    return super.stopImmediatePropagation();
  }
  preventDefault() {
    return super.preventDefault();
  }
  // eslint-disable-next-line unicorn/no-thenable
  then(fn) {
    return super.then(fn);
  }
  continuousExecution() {
    return super.continuousExecution();
  }
  throttle(timeout) {
    return super.throttle(timeout);
  }
  cancel(fn) {
    return super.cancel(fn);
  }
  endOrCancel(fn) {
    return super.endOrCancel(fn);
  }
  catch(fn) {
    return super.catch(fn);
  }
  name(name) {
    return super.name(name);
  }
  configureRules(ruleName, severity) {
    return super.configureRules(ruleName, severity);
  }
  toProduce(fn) {
    return super.toProduce(fn);
  }
  toProduceAnon(fn) {
    return super.toProduceAnon(fn);
  }
  usingInteraction(fn) {
    return super.usingInteraction(fn);
  }
  duplicate() {
    return new KeysBinder(this.undoHistory, this.logger, this.observer, this);
  }
  bind() {
    if (this.usingFn === void 0) {
      throw new Error("The interaction supplier cannot be undefined here");
    }
    if (this.produceFn === void 0) {
      throw new Error("The command supplier cannot be undefined here");
    }
    const binding = new AnonBinding(
      this.continuousCmdExecution,
      this.usingFn(),
      this.undoHistory,
      this.logger,
      this.produceFn,
      Array.from(this.widgets),
      Array.from(this.dynamicNodes),
      Array.from(this.logLevels),
      this.throttleTimeout,
      this.stopPropagation,
      this.prevDefault,
      new Map(this.linterRules),
      this.firstFn,
      this.thenFn,
      Array.from(this.whenFnArray),
      this.endFn,
      this.cancelFn,
      this.endOrCancelFn,
      this.hadEffectsFn,
      this.hadNoEffectFn,
      this.cannotExecFn,
      this.onErrFn,
      this.bindingName,
      this.accInit
    );
    this.observer?.observeBinding(binding);
    return binding;
  }
}

var __defProp$1c = Object.defineProperty;
var __defNormalProp$1c = (obj, key, value) => key in obj ? __defProp$1c(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1c = (obj, key, value) => {
  __defNormalProp$1c(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class TransitionBase {
  /**
   * Creates the transition.
   * @param srcState - The source state of the transition
   * @param tgtState - The output state of the transition
   * @param action - The action to execute when going through the transition
   * @param guard - The guard to fulfil to execute the transition
   */
  constructor(srcState, tgtState, action, guard) {
    __publicField$1c(this, "src");
    __publicField$1c(this, "tgt");
    __publicField$1c(this, "action");
    __publicField$1c(this, "guard");
    this.src = srcState;
    this.tgt = tgtState;
    this.action = action ?? (() => {
    });
    this.guard = guard ?? (() => true);
    this.src.addTransition(this);
  }
  execute(event) {
    if (this.accept(event) && this.guard(event)) {
      this.src.fsm.stopCurrentTimeout();
      this.action(event);
      this.src.exit();
      this.tgt.enter();
      return this.tgt;
    }
    return void 0;
  }
  acceptVisitor(visitor) {
    visitor.visitTransition(this);
  }
  get target() {
    return this.tgt;
  }
  uninstall() {
  }
}

var __defProp$1b = Object.defineProperty;
var __defNormalProp$1b = (obj, key, value) => key in obj ? __defProp$1b(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1b = (obj, key, value) => {
  __defNormalProp$1b(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class MouseTransition extends TransitionBase {
  /**
   * Creates the transition.
   * @param srcState - The source state of the transition
   * @param tgtState - The output state of the transition
   * @param types - The type of mouse event
   * @param action - The action to execute when going through the transition
   * @param guard - The guard to fulfil to execute the transition
   */
  constructor(srcState, tgtState, types, action, guard) {
    super(srcState, tgtState, action, guard);
    __publicField$1b(this, "acceptedEvents");
    this.acceptedEvents = new Set(typeof types === "string" ? [types] : types);
  }
  accept(event) {
    return event instanceof MouseEvent && this.getAcceptedEvents().has(event.type);
  }
  getAcceptedEvents() {
    return this.acceptedEvents;
  }
}

class ClickTransition extends MouseTransition {
  /**
   * Creates the transition.
   * @param srcState - The source state of the transition
   * @param tgtState - The output state of the transition
   * @param action - The action to execute when going through the transition
   * @param guard - The guard to fulfil to execute the transition
   */
  constructor(srcState, tgtState, action, guard) {
    super(srcState, tgtState, ["click", "auxclick"], action, guard);
  }
}

var __defProp$1a = Object.defineProperty;
var __defNormalProp$1a = (obj, key, value) => key in obj ? __defProp$1a(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1a = (obj, key, value) => {
  __defNormalProp$1a(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class StateBase {
  /**
   * Creates the state.
   * @param stateMachine - The FSM that will contain the state.
   * @param stateName - The name of this state.
   */
  constructor(stateMachine, stateName) {
    __publicField$1a(this, "fsm");
    __publicField$1a(this, "name");
    this.fsm = stateMachine;
    this.name = stateName;
  }
  checkStartingState() {
    if (!this.fsm.started && this.fsm.startingState === this) {
      this.fsm.onStarting();
    }
  }
  uninstall() {
  }
}

class CancellingState extends StateBase {
  /**
   * Creates the state.
   * @param stateMachine - The FSM that will contain the state.
   * @param stateName - The name of this state.
   */
  constructor(stateMachine, stateName) {
    super(stateMachine, stateName);
  }
  enter() {
    this.fsm.onCancelling();
  }
  uninstall() {
  }
  acceptVisitor(visitor) {
    visitor.visitCancellingState(this);
  }
}

function getTouch(touches, idToFind) {
  for (const touch of touches) {
    if (touch.identifier === idToFind) {
      return touch;
    }
  }
  return void 0;
}
function isButton(target) {
  return target instanceof HTMLButtonElement;
}
function isCheckBox(target) {
  return target instanceof HTMLInputElement && target.getAttribute("type") === "checkbox";
}
function isColorChoice(target) {
  return target instanceof HTMLInputElement && target.getAttribute("type") === "color";
}
function isComboBox(target) {
  return target instanceof HTMLSelectElement;
}
function isDatePicker(target) {
  return target instanceof HTMLInputElement && target.getAttribute("type") === "date";
}
function isSpinner(target) {
  return target instanceof HTMLInputElement && target.getAttribute("type") === "number";
}
function isHyperLink(target) {
  return target instanceof HTMLAnchorElement;
}
function isTextInput(target) {
  return target instanceof HTMLInputElement && target.getAttribute("type") === "text" || target instanceof HTMLTextAreaElement;
}
function isKeyDownEvent(event) {
  return event instanceof KeyboardEvent && event.type === "keydown";
}
function isKeyUpEvent(event) {
  return event instanceof KeyboardEvent && event.type === "keyup";
}
var KeyCode = /* @__PURE__ */ ((KeyCode2) => {
  KeyCode2[KeyCode2["escape"] = 27] = "escape";
  return KeyCode2;
})(KeyCode || {});

var __defProp$19 = Object.defineProperty;
var __defNormalProp$19 = (obj, key, value) => key in obj ? __defProp$19(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$19 = (obj, key, value) => {
  __defNormalProp$19(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class OutputStateBase extends StateBase {
  /**
   * Creates the state.
   * @param stateMachine - The FSM that will contain the state.
   * @param stateName - The name of this state.
   */
  constructor(stateMachine, stateName) {
    super(stateMachine, stateName);
    __publicField$19(this, "_transitions");
    this._transitions = [];
  }
  process(event) {
    return this.transitions.some((tr) => {
      try {
        return tr.execute(event) !== void 0;
      } catch (error) {
        if (error instanceof CancelFSMError) {
          return false;
        }
        throw error;
      }
    });
  }
  clearTransitions() {
    this._transitions.length = 0;
  }
  get transitions() {
    return Array.from(this._transitions);
  }
  addTransition(tr) {
    this._transitions.push(tr);
  }
  uninstall() {
    super.uninstall();
    for (const tr of this.transitions) {
      tr.uninstall();
    }
    this._transitions.length = 0;
  }
}

class InitState extends OutputStateBase {
  constructor(stateMachine, stateName) {
    super(stateMachine, stateName);
  }
  exit() {
    this.checkStartingState();
  }
  acceptVisitor(visitor) {
    visitor.visitInitState(this);
  }
}

class StdState extends OutputStateBase {
  /**
   * Creates the state.
   * @param stateMachine - The FSM that will contain the state.
   * @param stateName - The name of this state.
   */
  constructor(stateMachine, stateName) {
    super(stateMachine, stateName);
  }
  enter() {
    this.checkStartingState();
    this.fsm.enterStdState(this);
  }
  exit() {
  }
  acceptVisitor(visitor) {
    visitor.visitState(this);
  }
}

class TerminalState extends StateBase {
  /**
   * Creates the terminal state.
   * @param stateMachine - The FSM that will contain the state.
   * @param stateName - The name of this state.
   */
  constructor(stateMachine, stateName) {
    super(stateMachine, stateName);
  }
  enter() {
    this.checkStartingState();
    this.fsm.onTerminating();
  }
  acceptVisitor(visitor) {
    visitor.visitTerminalState(this);
  }
}

var __defProp$18 = Object.defineProperty;
var __defNormalProp$18 = (obj, key, value) => key in obj ? __defProp$18(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$18 = (obj, key, value) => {
  __defNormalProp$18(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class TimeoutTransition extends TransitionBase {
  /**
   * Creates the timeout transition.
   * @param srcState - The source state of the transition.
   * @param tgtState - The output state of the transition.
   * @param timeout - The function that returns the timeout value in ms.
   * @param logger - The logger to use.
   * @param action - The action to execute when going through the transition
   */
  constructor(srcState, tgtState, timeout, logger, action) {
    super(srcState, tgtState, action, () => this.timeouted);
    /**
     * The timeoutDuration in ms.
     */
    __publicField$18(this, "timeoutDuration");
    __publicField$18(this, "logger");
    /**
     * The current thread in progress.
     */
    __publicField$18(this, "timeoutThread");
    __publicField$18(this, "timeouted");
    this.logger = logger;
    this.timeouted = false;
    this.timeoutDuration = timeout;
    this.timeouted = false;
  }
  /**
   * Launches the timer.
   */
  startTimeout() {
    if (this.timeoutThread === void 0) {
      const time = this.timeoutDuration();
      if (time <= 0) {
        this.src.fsm.onTimeout();
        return;
      }
      this.timeoutThread = window.setTimeout(() => {
        try {
          this.timeouted = true;
          this.src.fsm.onTimeout();
        } catch (error) {
          this.logger?.logInteractionErr("Exception on timeout of a timeout transition", error);
        }
      }, time);
    }
  }
  /**
   * Stops the timer.
   */
  stopTimeout() {
    if (this.timeoutThread !== void 0) {
      clearTimeout(this.timeoutThread);
      this.timeoutThread = void 0;
    }
  }
  accept(_event) {
    return this.timeouted;
  }
  execute(event) {
    try {
      if (this.accept(event) && this.guard(event)) {
        this.src.exit();
        this.action(event);
        this.tgt.enter();
        this.timeouted = false;
        return this.tgt;
      }
      return void 0;
    } catch (error) {
      this.timeouted = false;
      throw error;
    }
  }
  getAcceptedEvents() {
    return /* @__PURE__ */ new Set();
  }
  acceptVisitor(visitor) {
    visitor.visitTimeoutTransition(this);
  }
}

function remove(array, elt) {
  const index = array.indexOf(elt);
  if (index > -1) {
    array.splice(index, 1);
  }
}
function removeAt(array, index) {
  if (index > -1) {
    return array.splice(index, 1)[0];
  }
  return void 0;
}

var __defProp$17 = Object.defineProperty;
var __defNormalProp$17 = (obj, key, value) => key in obj ? __defProp$17(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$17 = (obj, key, value) => {
  __defNormalProp$17(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class FSMImpl {
  /**
   * Creates the FSM.
   * @param logger - The logger to use for logging FSM messages
   * @param dataHandler - The data handler the FSM will use
   */
  constructor(logger, dataHandler) {
    __publicField$17(this, "_dataHandler");
    __publicField$17(this, "logger");
    __publicField$17(this, "_log");
    __publicField$17(this, "inner");
    __publicField$17(this, "startingState");
    /**
     * Goes with 'startingState'. It permits to know whether the FSM has started, ie whether the 'starting state'
     * has been reached.
     */
    __publicField$17(this, "_started");
    __publicField$17(this, "initState");
    __publicField$17(this, "_currentState");
    __publicField$17(this, "currentStatePublisher");
    /**
     * The states that compose the finite state machine.
     */
    __publicField$17(this, "_states");
    /**
     * The handlers to be notified on FSM state changes.
     */
    __publicField$17(this, "handlers");
    /**
     * The events still in process. For example when the user press key ctrl and scroll one time using
     * the wheel of the mouse, the interaction scrolling is
     * finished but the event keyPressed 'ctrl' is still in process. At the end of the interaction, these events
     * are re-introduced into the
     * state machine of the interaction for processing.
     */
    __publicField$17(this, "eventsToProcess");
    /**
     * The current timeout in progress.
     */
    __publicField$17(this, "currentTimeout");
    __publicField$17(this, "currentSubFSM");
    this._dataHandler = dataHandler;
    this.logger = logger;
    this.inner = false;
    this._started = false;
    this.initState = new InitState(this, "init");
    this._states = [this.initState];
    this.startingState = this.initState;
    this._currentState = this.initState;
    this.currentStatePublisher = new Subject();
    this.handlers = [];
    this.eventsToProcess = [];
    this.currentSubFSM = void 0;
    this._log = false;
  }
  get currentState() {
    return this._currentState;
  }
  set currentState(state) {
    const old = this._currentState;
    this._currentState = state;
    this.currentStatePublisher.next([old, this._currentState]);
  }
  get currentStateObservable() {
    return this.currentStatePublisher;
  }
  process(event) {
    if (isKeyUpEvent(event)) {
      this.removeKeyEvent(event.code);
    }
    const processed = this.processEvent(event);
    if (processed && isKeyDownEvent(event) && !(this._currentState instanceof InitState) && !this.eventsToProcess.some((evt) => isKeyDownEvent(evt) && evt.code === event.code)) {
      this.addRemaningEventsToProcess(event);
    }
    return processed;
  }
  processEvent(event) {
    if (this.currentSubFSM !== void 0) {
      if (this.log) {
        this.logger.logInteractionMsg(`processing event ${String(event.type)} in a sub-FSM`, this.constructor.name);
      }
      return this.currentSubFSM.process(event);
    }
    if (this.log) {
      this.logger.logInteractionMsg(`processing event ${String(event.type)} at state
            ${this.currentState.name}: ${this.constructor.name}`, this.constructor.name);
    }
    try {
      return this.currentState.process(event);
    } catch (error) {
      this.notifyHandlerOnError(error);
      return false;
    }
  }
  acceptVisitor(visitor) {
    visitor.visitFSM(this);
  }
  get log() {
    return this._log;
  }
  set log(log) {
    this._log = log;
  }
  get dataHandler() {
    return this._dataHandler;
  }
  set dataHandler(dataHandler) {
    this._dataHandler = dataHandler;
  }
  /**
   * Removes the given KeyPress event from the events 'still in process' list.
   * @param key - The key code of the event to remove.
   */
  removeKeyEvent(key) {
    let removed = false;
    for (let i = 0, size = this.eventsToProcess.length; i < size && !removed; i++) {
      const event = this.eventsToProcess[i];
      if (event instanceof KeyboardEvent && event.code === key) {
        removed = true;
        removeAt(this.eventsToProcess, i);
      }
    }
  }
  enterStdState(state) {
    this.currentState = state;
    this.checkTimeoutTransition();
    if (this.started) {
      this.onUpdating();
    }
  }
  get started() {
    return this._started;
  }
  /**
   * The end of the FSM execution, the events still (eg keyPress) in process must be recycled to be reused in the FSM.
   */
  processRemainingEvents() {
    const list = Array.from(this.eventsToProcess);
    for (const event of list) {
      removeAt(this.eventsToProcess, 0);
      if (this.log) {
        this.logger.logInteractionMsg("Recycling event", this.constructor.name);
      }
      this.process(event);
    }
  }
  addRemaningEventsToProcess(event) {
    this.eventsToProcess.push(event);
  }
  onError(err) {
    this.notifyHandlerOnError(err);
  }
  onTerminating() {
    if (this.log) {
      this.logger.logInteractionMsg("FSM ended", this.constructor.name);
    }
    if (this.started) {
      this.notifyHandlerOnStop();
    }
    this.reinit();
    this.processRemainingEvents();
  }
  onCancelling() {
    if (this.log) {
      this.logger.logInteractionMsg("FSM cancelled", this.constructor.name);
    }
    if (this.started) {
      this.notifyHandlerOnCancel();
    }
    this.fullReinit();
  }
  onStarting() {
    if (this.log) {
      this.logger.logInteractionMsg("FSM started", this.constructor.name);
    }
    this._started = true;
    this.notifyHandlerOnStart();
  }
  /**
   * Updates the state machine.
   */
  onUpdating() {
    if (this.started) {
      if (this.log) {
        this.logger.logInteractionMsg("FSM updated", this.constructor.name);
      }
      this.notifyHandlerOnUpdate();
    }
  }
  /**
   * Adds a standard state to the state machine.
   * @param name - The name of the state to add.
   * @param startingState - States whether the new state is the one that starts the FSM.
   * @returns The created state.
   */
  addStdState(name, startingState = false) {
    const state = new StdState(this, name);
    this.addState(state, startingState);
    return state;
  }
  /**
   * Adds a terminal state to the state machine.
   * @param name - The name of the state to add.
   * @param startingState - States whether the new state is the one that starts the FSM.
   * @returns The created state.
   */
  addTerminalState(name, startingState = false) {
    const state = new TerminalState(this, name);
    this.addState(state, startingState);
    return state;
  }
  /**
   * Adds a cancelling state to the state machine.
   * @param name - The name of the state to add.
   * @returns The created state.
   */
  addCancellingState(name) {
    const state = new CancellingState(this, name);
    this.addState(state);
    return state;
  }
  addState(state, startingState = false) {
    this._states.push(state);
    if (startingState) {
      this.startingState = state;
    }
  }
  reinit() {
    if (this.log) {
      this.logger.logInteractionMsg("FSM reinitialised", this.constructor.name);
    }
    this.currentTimeout?.stopTimeout();
    this._started = false;
    this.currentState = this.initState;
    this.currentTimeout = void 0;
    this.currentSubFSM?.reinit();
    if (this.dataHandler !== void 0 && !this.inner) {
      this.dataHandler.reinitData();
    }
  }
  fullReinit() {
    this.eventsToProcess.length = 0;
    this.reinit();
    this.currentSubFSM?.fullReinit();
  }
  onTimeout() {
    if (this.currentTimeout !== void 0) {
      if (this.log) {
        this.logger.logInteractionMsg("Timeout", this.constructor.name);
      }
      const state = this.currentTimeout.execute();
      if (isOutputStateType(state)) {
        this.currentState = state;
        this.checkTimeoutTransition();
      }
    }
  }
  stopCurrentTimeout() {
    if (this.currentTimeout !== void 0) {
      if (this.log) {
        this.logger.logInteractionMsg("Timeout stopped", this.constructor.name);
      }
      this.currentTimeout.stopTimeout();
      this.currentTimeout = void 0;
    }
  }
  /**
   * Checks whether the current state has a timeout transition.
   * If it is the case, the timeout transition is launched.
   */
  checkTimeoutTransition() {
    const tr = this.currentState.transitions.find((trans) => trans instanceof TimeoutTransition);
    if (tr !== void 0) {
      if (this.log) {
        this.logger.logInteractionMsg("Timeout starting", this.constructor.name);
      }
      this.currentTimeout = tr;
      this.currentTimeout.startTimeout();
    }
  }
  addHandler(handler) {
    this.handlers.push(handler);
  }
  removeHandler(handler) {
    remove(this.handlers, handler);
  }
  /**
   * Notifies handler that the interaction starts.
   */
  notifyHandlerOnStart() {
    try {
      const hs = Array.from(this.handlers);
      for (const handler of hs) {
        handler.preFsmStart?.();
      }
      for (const handler of hs) {
        handler.fsmStarts?.();
      }
    } catch (error) {
      if (!(error instanceof CancelFSMError || error instanceof MustBeUndoableCmdError)) {
        this.logger.logInteractionErr("An 'fsmStarts' produced an error", error, this.constructor.name);
      }
      this.onCancelling();
      throw error;
    }
  }
  /**
   * Notifies handler that the interaction updates.
   */
  notifyHandlerOnUpdate() {
    try {
      const hs = Array.from(this.handlers);
      for (const handler of hs) {
        handler.preFsmUpdate?.();
      }
      for (const handler of hs) {
        handler.fsmUpdates?.();
      }
    } catch (error) {
      if (!(error instanceof CancelFSMError || error instanceof MustBeUndoableCmdError)) {
        this.logger.logInteractionErr("An 'fsmUpdates' produced an error", error, this.constructor.name);
      }
      this.onCancelling();
      throw error;
    }
  }
  /**
   * Notifies handler that the interaction stops.
   */
  notifyHandlerOnStop() {
    try {
      const hs = Array.from(this.handlers);
      for (const handler of hs) {
        handler.preFsmStop?.();
      }
      for (const handler of hs) {
        handler.fsmStops?.();
      }
    } catch (error) {
      if (!(error instanceof CancelFSMError || error instanceof MustBeUndoableCmdError)) {
        this.logger.logInteractionErr("An 'fsmStops' produced an error", error, this.constructor.name);
      }
      this.onCancelling();
      throw error;
    }
  }
  /**
   * Notifies handler that the interaction is cancelled.
   */
  notifyHandlerOnCancel() {
    try {
      for (const handler of Array.from(this.handlers)) {
        handler.fsmCancels?.();
      }
    } catch (error) {
      if (!(error instanceof MustBeUndoableCmdError)) {
        this.logger.logInteractionErr("An 'fsmCancels' produced an error", error, this.constructor.name);
      }
      throw error;
    }
  }
  /**
   * Notifies handlers that an error occured.
   * @param err - The error to handle
   */
  notifyHandlerOnError(err) {
    try {
      for (const handler of Array.from(this.handlers)) {
        handler.fsmError?.(err);
      }
    } catch (error) {
      this.logger.logInteractionErr("An 'fsmError' produced an error", error, this.constructor.name);
    }
  }
  get states() {
    return Array.from(this._states);
  }
  getEventsToProcess() {
    return Array.from(this.eventsToProcess);
  }
  uninstall() {
    this.fullReinit();
    this.log = false;
    this.currentStatePublisher.complete();
    this.currentSubFSM = void 0;
    for (const state of this._states) {
      state.uninstall();
    }
    this._states.length = 0;
    this.dataHandler = void 0;
  }
}

var __defProp$16 = Object.defineProperty;
var __defNormalProp$16 = (obj, key, value) => key in obj ? __defProp$16(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$16 = (obj, key, value) => {
  __defNormalProp$16(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class InteractionBase {
  /**
   * Creates the interaction.
   * @param fsm - The FSM that defines the behavior of the user interaction.
   * @param data - The interaction data.
   * @param logger - The logger to use for this interaction
   * @param name - The real name of the interaction
   */
  constructor(fsm, data, logger, name) {
    /**
     * The current nodes that the interaction works on
     */
    __publicField$16(this, "_registeredNodes");
    __publicField$16(this, "_dynamicRegisteredNodes");
    __publicField$16(this, "_fsm");
    __publicField$16(this, "_name");
    __publicField$16(this, "_log");
    /** The current list of mutation observers. Used for listening changes in node lists. */
    __publicField$16(this, "mutationObservers");
    /** The interaction data */
    __publicField$16(this, "_data");
    __publicField$16(this, "logger");
    __publicField$16(this, "mouseHandler");
    __publicField$16(this, "touchHandler");
    __publicField$16(this, "keyHandler");
    __publicField$16(this, "uiHandler");
    __publicField$16(this, "actionHandler");
    __publicField$16(this, "disposable");
    __publicField$16(this, "stopImmediatePropag");
    __publicField$16(this, "preventDef");
    /**
     * Defines if the interaction is activated or not. If not, the interaction will not
     * change on events.
     */
    __publicField$16(this, "activated");
    __publicField$16(this, "throttleTimeout");
    __publicField$16(this, "currentThrottling");
    __publicField$16(this, "latestThrottledEvent");
    this._name = name;
    this.logger = logger;
    this.activated = false;
    this.stopImmediatePropag = false;
    this.preventDef = false;
    this._data = data;
    this._fsm = fsm;
    this.disposable = this._fsm.currentStateObservable.subscribe((current) => {
      this.updateEventsRegistered(current[1], current[0]);
    });
    this.activated = true;
    this._log = false;
    this._registeredNodes = /* @__PURE__ */ new Set();
    this._dynamicRegisteredNodes = /* @__PURE__ */ new Set();
    this.mutationObservers = [];
    this.throttleTimeout = 0;
  }
  reinitData() {
    this._data.flush();
  }
  get data() {
    return this._data;
  }
  get name() {
    return this._name;
  }
  setThrottleTimeout(timeout) {
    this.throttleTimeout = timeout;
  }
  createThrottleTimeout() {
    this.currentThrottling?.cancel();
    this.currentThrottling = void 0;
    const currTimeout = this.throttleTimeout;
    let rejection;
    let timeout;
    this.currentThrottling = new Promise(
      (resolve, reject) => {
        rejection = reject;
        timeout = setTimeout(() => {
          try {
            const evt = this.latestThrottledEvent;
            this.latestThrottledEvent = void 0;
            if (evt !== void 0) {
              this.directEventProcess(evt);
            }
            resolve();
          } catch (error) {
            rejection(error);
          }
        }, currTimeout);
      }
    ).catch((error) => {
      this.logger.logInteractionErr("Error during the throttling process", error, this.constructor.name);
    });
    this.currentThrottling.cancel = () => {
      clearTimeout(timeout);
      rejection(new Error("cancellation"));
    };
  }
  checkThrottlingEvent(event) {
    const latestEvt = this.latestThrottledEvent;
    if (latestEvt === void 0 || latestEvt.type !== event.type) {
      if (latestEvt !== void 0) {
        this.directEventProcess(latestEvt);
      }
      this.latestThrottledEvent = event;
      this.createThrottleTimeout();
    } else {
      this.latestThrottledEvent = event;
    }
  }
  updateEventsRegistered(newState, oldState) {
    if (newState === oldState || this._fsm.states.length === 2) {
      return;
    }
    const currEvents = this.getCurrentAcceptedEvents(newState);
    const events = Array.from(this.getEventTypesOf(oldState));
    const eventsToRemove = events.filter((evt) => !currEvents.includes(evt));
    const eventsToAdd = currEvents.filter((evt) => !events.includes(evt));
    for (const node of this._registeredNodes) {
      for (const type of eventsToRemove) {
        this.unregisterEventToNode(type, node);
      }
      for (const type of eventsToAdd) {
        this.registerEventToNode(type, node);
      }
    }
  }
  getCurrentAcceptedEvents(state) {
    return Array.from(this.getEventTypesOf(state));
  }
  callBackMutationObserver(mutationList) {
    for (const mutation of mutationList) {
      for (const node of mutation.addedNodes) {
        this.registerToNodes([node]);
      }
      for (const node of mutation.removedNodes) {
        this.unregisterFromNodes([node]);
      }
    }
  }
  getEventTypesOf(state) {
    const result = /* @__PURE__ */ new Set();
    for (const trans of state.transitions) {
      for (const evt of trans.getAcceptedEvents()) {
        result.add(evt);
      }
    }
    return result;
  }
  registerToNodes(widgets) {
    for (const widget of widgets) {
      this._registeredNodes.add(widget);
      this.onNewNodeRegistered(widget);
    }
  }
  unregisterFromNodes(widgets) {
    for (const widget of widgets) {
      this._registeredNodes.delete(widget);
      this.onNodeUnregistered(widget);
    }
  }
  onNodeUnregistered(node) {
    for (const type of this.getEventTypesOf(this._fsm.currentState)) {
      this.unregisterEventToNode(type, node);
    }
  }
  onNewNodeRegistered(node) {
    for (const type of this.getEventTypesOf(this._fsm.currentState)) {
      this.registerEventToNode(type, node);
    }
  }
  registerToNodeChildren(elementToObserve) {
    this._dynamicRegisteredNodes.add(elementToObserve);
    for (const node of elementToObserve.childNodes) {
      this.registerToNodes([node]);
    }
    const newMutationObserver = new MutationObserver((mutations) => {
      this.callBackMutationObserver(mutations);
    });
    newMutationObserver.observe(elementToObserve, { "childList": true });
    this.mutationObservers.push(newMutationObserver);
  }
  registerEventToNode(eventType, node) {
    if (!(node instanceof EventTarget)) {
      return;
    }
    if (mouseEventTypes.includes(eventType) || eventType === "wheel") {
      node.addEventListener(eventType, this.getMouseHandler());
      return;
    }
    if (touchEventTypes.includes(eventType)) {
      node.addEventListener(eventType, this.getTouchHandler());
      return;
    }
    if (keyEventTypes.includes(eventType)) {
      node.addEventListener(eventType, this.getKeyHandler());
      return;
    }
    if (eventType === "scroll") {
      node.addEventListener(eventType, this.getUIHandler());
    }
  }
  unregisterEventToNode(eventType, node) {
    if (!(node instanceof EventTarget)) {
      return;
    }
    if (mouseEventTypes.includes(eventType) || eventType === "wheel") {
      node.removeEventListener(eventType, this.getMouseHandler());
      return;
    }
    if (touchEventTypes.includes(eventType)) {
      node.removeEventListener(eventType, this.getTouchHandler());
      return;
    }
    if (keyEventTypes.includes(eventType)) {
      node.removeEventListener(eventType, this.getKeyHandler());
      return;
    }
    if (eventType === "scroll") {
      node.removeEventListener(eventType, this.getUIHandler());
    }
  }
  registerActionHandlerClick(node) {
    node.addEventListener("click", this.getActionHandler());
    node.addEventListener("auxclick", this.getActionHandler());
  }
  unregisterActionHandlerClick(node) {
    node.removeEventListener("click", this.getActionHandler());
    node.removeEventListener("auxclick", this.getActionHandler());
  }
  registerActionHandlerInput(node) {
    node.addEventListener("input", this.getActionHandler());
  }
  unregisterActionHandlerInput(node) {
    node.removeEventListener("input", this.getActionHandler());
  }
  getActionHandler() {
    if (this.actionHandler === void 0) {
      this.actionHandler = (evt) => {
        this.processEvent(evt);
      };
    }
    return this.actionHandler;
  }
  getMouseHandler() {
    if (this.mouseHandler === void 0) {
      this.mouseHandler = (evt) => {
        this.processEvent(evt);
      };
    }
    return this.mouseHandler;
  }
  getTouchHandler() {
    if (this.touchHandler === void 0) {
      this.touchHandler = (evt) => {
        this.processEvent(evt);
      };
    }
    return this.touchHandler;
  }
  getKeyHandler() {
    if (this.keyHandler === void 0) {
      this.keyHandler = (evt) => {
        this.processEvent(evt);
      };
    }
    return this.keyHandler;
  }
  getUIHandler() {
    if (this.uiHandler === void 0) {
      this.uiHandler = (evt) => {
        this.processEvent(evt);
      };
    }
    return this.uiHandler;
  }
  isRunning() {
    return this.activated && !(this._fsm.currentState instanceof InitState);
  }
  fullReinit() {
    this._fsm.fullReinit();
  }
  set stopImmediatePropagation(stop) {
    this.stopImmediatePropag = stop;
  }
  /**
   * @returns True if the user interaction will stop immediately the propagation
   * of events processed by this user interaction to others listeners.
   */
  get stopImmediatePropagation() {
    return this.stopImmediatePropag;
  }
  set preventDefault(prevent) {
    this.preventDef = prevent;
  }
  /**
   * @returns True if the default behavior associated to the event will be executed.
   */
  get preventDefault() {
    return this.preventDef;
  }
  /**
   * Processes the given UI event.
   * @param event - The event to process.
   */
  processEvent(event) {
    if (this.isActivated()) {
      if (this.throttleTimeout <= 0) {
        this.directEventProcess(event);
      } else {
        this.checkThrottlingEvent(event);
      }
    }
  }
  directEventProcess(event) {
    const processed = this._fsm.process(event);
    if (processed) {
      if (this.preventDef) {
        event.preventDefault();
      }
      if (this.stopImmediatePropag) {
        event.stopImmediatePropagation();
      }
    }
  }
  log(log) {
    this._log = log;
    this._fsm.log = log;
  }
  isActivated() {
    return this.activated;
  }
  setActivated(activated) {
    if (this._log) {
      this.logger.logInteractionMsg(`Interaction activation: ${String(activated)}`, this.constructor.name);
    }
    this.activated = activated;
    if (!activated) {
      this._fsm.fullReinit();
    }
  }
  get fsm() {
    return this._fsm;
  }
  reinit() {
    this._fsm.reinit();
    this.reinitData();
  }
  uninstall() {
    this.disposable.unsubscribe();
    for (const node of this._registeredNodes) {
      this.onNodeUnregistered(node);
    }
    this._registeredNodes.clear();
    for (const obs of this.mutationObservers) {
      obs.disconnect();
    }
    this.mutationObservers.length = 0;
    this.setActivated(false);
  }
  acceptVisitor(visitor) {
    visitor.visitInteraction(this);
  }
  get registeredNodes() {
    return this._registeredNodes;
  }
  get dynamicRegisteredNodes() {
    return this._dynamicRegisteredNodes;
  }
}

var __defProp$15 = Object.defineProperty;
var __defNormalProp$15 = (obj, key, value) => key in obj ? __defProp$15(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$15 = (obj, key, value) => {
  __defNormalProp$15(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class PointingDataBase extends InteractionDataBase {
  constructor() {
    super(...arguments);
    __publicField$15(this, "clientXData", 0);
    __publicField$15(this, "clientYData", 0);
    __publicField$15(this, "pageXData", 0);
    __publicField$15(this, "pageYData", 0);
    __publicField$15(this, "screenXData", 0);
    __publicField$15(this, "screenYData", 0);
    __publicField$15(this, "altKeyData", false);
    __publicField$15(this, "ctrlKeyData", false);
    __publicField$15(this, "metaKeyData", false);
    __publicField$15(this, "shiftKeyData", false);
  }
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

var __defProp$14 = Object.defineProperty;
var __defNormalProp$14 = (obj, key, value) => key in obj ? __defProp$14(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$14 = (obj, key, value) => {
  __defNormalProp$14(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class PointDataImpl extends PointingDataBase {
  constructor() {
    super(...arguments);
    __publicField$14(this, "buttonData", 0);
    __publicField$14(this, "buttonsData", 0);
    __publicField$14(this, "movementXData", 0);
    __publicField$14(this, "movementYData", 0);
    __publicField$14(this, "offsetXData", 0);
    __publicField$14(this, "offsetYData", 0);
    __publicField$14(this, "relatedTargetData", null);
  }
  flush() {
    super.flush();
    this.buttonData = 0;
    this.buttonsData = 0;
    this.movementXData = 0;
    this.movementYData = 0;
    this.offsetXData = 0;
    this.offsetYData = 0;
    this.relatedTargetData = null;
  }
  copy(data) {
    super.copy(data);
    this.buttonData = data.button;
    this.buttonsData = data.buttons;
    this.movementXData = data.movementX;
    this.movementYData = data.movementY;
    this.offsetXData = data.offsetX;
    this.offsetYData = data.offsetY;
    this.relatedTargetData = data.relatedTarget;
  }
  get button() {
    return this.buttonData;
  }
  get buttons() {
    return this.buttonsData;
  }
  get movementX() {
    return this.movementXData;
  }
  get movementY() {
    return this.movementYData;
  }
  get offsetX() {
    return this.offsetXData;
  }
  get offsetY() {
    return this.offsetYData;
  }
  get relatedTarget() {
    return this.relatedTargetData;
  }
}

var __defProp$13 = Object.defineProperty;
var __defNormalProp$13 = (obj, key, value) => key in obj ? __defProp$13(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$13 = (obj, key, value) => {
  __defNormalProp$13(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class ClickFSM extends FSMImpl {
  /**
   * Creates the FSM
   * @param logger - The logger to use for this interaction
   * @param dataHandler - The data handler the FSM will use
   */
  constructor(logger, dataHandler) {
    super(logger, dataHandler);
    __publicField$13(this, "checkButton");
    new ClickTransition(
      this.initState,
      this.addTerminalState("clicked"),
      (evt) => {
        this.setCheckButton(evt.button);
        this.dataHandler?.initToClicked(evt);
      },
      (evt) => this.checkButton === void 0 || evt.button === this.checkButton
    );
  }
  getCheckButton() {
    return this.checkButton ?? -1;
  }
  setCheckButton(buttonToCheck) {
    if (this.checkButton === void 0) {
      this.checkButton = buttonToCheck;
    }
  }
  reinit() {
    super.reinit();
    this.checkButton = void 0;
  }
}
class Click extends InteractionBase {
  /**
   * Creates the interaction.
   * @param logger - The logger to use for this interaction
   * @param fsm - The optional FSM provided for the interaction
   * @param data - The interaction data to use
   * @param name - The name of the user interaction
   */
  constructor(logger, fsm, data, name) {
    super(fsm ?? new ClickFSM(logger), data ?? new PointDataImpl(), logger, name ?? Click.name);
    this.fsm.dataHandler = {
      "initToClicked": (evt) => {
        this._data.copy(evt);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
  }
}

var __defProp$12 = Object.defineProperty;
var __defNormalProp$12 = (obj, key, value) => key in obj ? __defProp$12(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$12 = (obj, key, value) => {
  __defNormalProp$12(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class PointsDataImpl {
  constructor() {
    __publicField$12(this, "pointsData");
    this.pointsData = [];
  }
  get points() {
    return Array.from(this.pointsData);
  }
  addPoint(ptData) {
    this.pointsData.push(ptData);
  }
  flush() {
    this.pointsData.length = 0;
  }
}

var __defProp$11 = Object.defineProperty;
var __defNormalProp$11 = (obj, key, value) => key in obj ? __defProp$11(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$11 = (obj, key, value) => {
  __defNormalProp$11(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class MousePointsDataImpl extends PointsDataImpl {
  /**
   * Creates the interaction data
   */
  constructor() {
    super();
    __publicField$11(this, "currentPositionData");
  }
  get currentPosition() {
    return this.currentPositionData;
  }
  set currentPosition(position) {
    this.currentPositionData = position;
  }
  get lastButton() {
    return this.pointsData.at(-1)?.button;
  }
  flush() {
    super.flush();
    this.currentPositionData = void 0;
  }
}

var __defProp$10 = Object.defineProperty;
var __defNormalProp$10 = (obj, key, value) => key in obj ? __defProp$10(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$10 = (obj, key, value) => {
  __defNormalProp$10(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class ClicksFSM extends FSMImpl {
  /**
   * Creates the Clicks FSM
   * @param nbClicks - The number of clicks to manage
   * @param logger - The logger to use for this interaction
   * @param dataHandler - The data handler the FSM will use
   */
  constructor(nbClicks, logger, dataHandler) {
    super(logger, dataHandler);
    __publicField$10(this, "countClicks");
    __publicField$10(this, "nbClicks");
    if (nbClicks <= 0) {
      throw new Error("The number of clicks must be greater than 1");
    }
    if (nbClicks === 1) {
      throw new Error("For a number of clicks that equals 1, use the Click interaction");
    }
    this.countClicks = 0;
    this.nbClicks = nbClicks;
    const clicked = this.addStdState("clicked");
    new ClickTransition(
      this.initState,
      clicked,
      (evt) => {
        this.countClicks++;
        this.dataHandler?.click(evt);
      }
    );
    new ClickTransition(
      clicked,
      clicked,
      (evt) => {
        this.countClicks++;
        this.dataHandler?.click(evt);
      },
      () => this.countClicks + 1 < this.nbClicks
    );
    new ClickTransition(
      clicked,
      this.addTerminalState("ended"),
      (evt) => {
        this.dataHandler?.click(evt);
      },
      () => this.countClicks + 1 === this.nbClicks
    );
    new TimeoutTransition(clicked, this.addCancellingState("timeouted"), () => 1e3);
  }
  reinit() {
    super.reinit();
    this.countClicks = 0;
  }
}
class Clicks extends InteractionBase {
  /**
   * Creates the clicks interaction
   * @param numberClicks - The number of clicks expected to end the interaction.
   * If this number is not reached after a timeout, the interaction is cancelled.
   * @param logger - The logger to use for this interaction
   * @param name - The name of the user interaction
   */
  constructor(numberClicks, logger, name) {
    const handler = {
      "click": (evt) => {
        const pt = new PointDataImpl();
        pt.copy(evt);
        this._data.addPoint(pt);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(new ClicksFSM(numberClicks, logger, handler), new MousePointsDataImpl(), logger, name ?? Clicks.name);
  }
}

var __defProp$$ = Object.defineProperty;
var __defNormalProp$$ = (obj, key, value) => key in obj ? __defProp$$(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$$ = (obj, key, value) => {
  __defNormalProp$$(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class SubFSMTransition extends TransitionBase {
  /**
   * Creates the transition.
   * @param srcState - The source state of the transition.
   * @param tgtState - The output state of the transition.
   * @param fsm - The inner FSM that composes the transition.
   * @param action - The action to execute when going through the transition
   */
  constructor(srcState, tgtState, fsm, action) {
    super(srcState, tgtState, action, (evt) => this.findTransition(evt)?.guard(evt) ?? false);
    __publicField$$(this, "subFSM");
    __publicField$$(this, "subFSMHandler");
    /**
     * Temporary subscription to the current state of the sub-FSM.
     */
    __publicField$$(this, "subStateSubscription");
    this.subFSM = fsm;
    this.subFSM.inner = true;
    this.subFSMHandler = {
      "fsmStarts": () => {
        this.src.exit();
      },
      "fsmUpdates": () => {
        this.src.fsm.onUpdating();
      },
      "fsmStops": () => {
        this.action(new Event(""));
        this.unsetFSMHandler();
        if (this.tgt instanceof TerminalState) {
          this.tgt.enter();
          return;
        }
        if (this.tgt instanceof CancellingState) {
          this.cancelsFSM();
          return;
        }
        if (isOutputStateType(this.tgt)) {
          this.src.fsm.currentState = this.tgt;
          this.tgt.enter();
        }
      },
      "fsmCancels": () => {
        this.cancelsFSM();
      },
      "fsmError": (err) => {
        this.src.fsm.onError(err);
      }
    };
  }
  /**
   * When has to setting up the subFSM
   */
  setUpFSMHandler() {
    this.subFSM.addHandler(this.subFSMHandler);
    this.src.fsm.currentSubFSM = this.subFSM;
    this.subStateSubscription = this.subFSM.currentStateObservable.subscribe((value) => {
      this.src.fsm.currentState = value[1];
    });
  }
  /**
   * If the subFSM is not more used to should be unset.
   */
  unsetFSMHandler() {
    this.subFSM.removeHandler(this.subFSMHandler);
    this.src.fsm.currentSubFSM = void 0;
    this.subStateSubscription?.unsubscribe();
  }
  cancelsFSM() {
    this.unsetFSMHandler();
    this.src.fsm.onCancelling();
  }
  execute(event) {
    const transition = this.findTransition(event);
    if (transition === void 0) {
      return void 0;
    }
    this.src.fsm.stopCurrentTimeout();
    this.setUpFSMHandler();
    this.subFSM.process(event);
    return transition.target;
  }
  accept(event) {
    return this.findTransition(event) !== void 0;
  }
  findTransition(event) {
    return this.subFSM.initState.transitions.find((tr) => tr.accept(event));
  }
  getAcceptedEvents() {
    const result = /* @__PURE__ */ new Set();
    for (const trans of this.subFSM.initState.transitions) {
      for (const evt of trans.getAcceptedEvents()) {
        result.add(evt);
      }
    }
    return result;
  }
  uninstall() {
    this.unsetFSMHandler();
    this.subFSM.uninstall();
  }
}

var __defProp$_ = Object.defineProperty;
var __defNormalProp$_ = (obj, key, value) => key in obj ? __defProp$_(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$_ = (obj, key, value) => {
  __defNormalProp$_(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const _DoubleClickFSM = class extends FSMImpl {
  constructor(logger, dataHandler) {
    super(logger, dataHandler);
    __publicField$_(this, "firstClickFSM");
    __publicField$_(this, "sndClickFSM");
    __publicField$_(this, "checkButton");
    this.firstClickFSM = new ClickFSM(logger);
    this.sndClickFSM = new ClickFSM(logger);
    const errorHandler = {
      "fsmError": (err) => {
        this.notifyHandlerOnError(err);
      }
    };
    this.firstClickFSM.addHandler(errorHandler);
    this.sndClickFSM.addHandler(errorHandler);
    const cancelled = this.addCancellingState("cancelled");
    const clicked = this.addStdState("clicked");
    new SubFSMTransition(
      this.initState,
      clicked,
      this.firstClickFSM,
      () => {
        this.setCheckButton(this.firstClickFSM.getCheckButton());
      }
    );
    new MouseTransition(
      clicked,
      cancelled,
      "mousemove",
      void 0,
      (ev) => this.checkButton === void 0 || ev instanceof MouseEvent && ev.button === this.checkButton
    );
    new TimeoutTransition(clicked, cancelled, _DoubleClickFSM.timeGapSupplier);
    new SubFSMTransition(clicked, this.addTerminalState("dbleclicked", true), this.sndClickFSM);
  }
  /**
   * @returns The time gap between the two spinner events.
   */
  static getTimeGap() {
    return _DoubleClickFSM.timeGap;
  }
  /**
   * Sets The time gap between the two spinner events.
   * @param timeGapBetweenClicks - The time gap between the two spinner events. Not done if negative.
   */
  static setTimeGap(timeGapBetweenClicks) {
    if (timeGapBetweenClicks > 0) {
      _DoubleClickFSM.timeGap = timeGapBetweenClicks;
    }
  }
  // eslint-disable-next-line accessor-pairs
  set log(log) {
    super.log = log;
    this.firstClickFSM.log = log;
    this.sndClickFSM.log = log;
  }
  setCheckButton(buttonToCheck) {
    if (this.checkButton === void 0) {
      this.checkButton = buttonToCheck;
    }
    this.sndClickFSM.setCheckButton(buttonToCheck);
  }
  getCheckButton() {
    return this.checkButton ?? -1;
  }
  fullReinit() {
    super.fullReinit();
    this.firstClickFSM.fullReinit();
    this.sndClickFSM.fullReinit();
  }
  reinit() {
    super.reinit();
    this.firstClickFSM.reinit();
    this.sndClickFSM.reinit();
    this.checkButton = void 0;
  }
};
let DoubleClickFSM = _DoubleClickFSM;
/** The time gap between the two spinner events. */
__publicField$_(DoubleClickFSM, "timeGap", 300);
/**
 * The supplier that provides the time gap.
 * @returns The time gap
 */
__publicField$_(DoubleClickFSM, "timeGapSupplier", () => _DoubleClickFSM.getTimeGap());
class DoubleClick extends InteractionBase {
  constructor(logger, fsm, data, name) {
    super(fsm ?? new DoubleClickFSM(logger), data ?? new PointDataImpl(), logger, name ?? DoubleClick.name);
    this.fsm.dataHandler = {
      "reinitData": () => {
        this.reinitData();
      }
    };
    new Click(logger, this.fsm.firstClickFSM, this._data);
  }
}

var __defProp$Z = Object.defineProperty;
var __defNormalProp$Z = (obj, key, value) => key in obj ? __defProp$Z(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$Z = (obj, key, value) => {
  __defNormalProp$Z(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class KeyTransition extends TransitionBase {
  /**
   * Creates the transition.
   * @param srcState - The source state of the transition
   * @param tgtState - The output state of the transition
   * @param keyType - The type of key event
   * @param action - The action to execute when going through the transition
   * @param guard - The guard to fulfil to execute the transition
   */
  constructor(srcState, tgtState, keyType, action, guard) {
    super(srcState, tgtState, action, guard);
    __publicField$Z(this, "acceptedEvents", /* @__PURE__ */ new Set(["wheel"]));
    this.acceptedEvents = /* @__PURE__ */ new Set([keyType]);
  }
  accept(event) {
    return event instanceof KeyboardEvent && this.getAcceptedEvents().has(event.type);
  }
  getAcceptedEvents() {
    return this.acceptedEvents;
  }
}

class EscapeKeyPressureTransition extends KeyTransition {
  constructor(srcState, tgtState, action) {
    super(
      srcState,
      tgtState,
      "keydown",
      action,
      (evt) => evt.code === "Escape" || evt.code === String(KeyCode.escape)
    );
  }
}

var __defProp$Y = Object.defineProperty;
var __defNormalProp$Y = (obj, key, value) => key in obj ? __defProp$Y(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$Y = (obj, key, value) => {
  __defNormalProp$Y(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class SrcTgtDataBase {
  constructor(src, tgt) {
    __publicField$Y(this, "srcData");
    __publicField$Y(this, "tgtData");
    this.srcData = src;
    this.tgtData = tgt;
  }
  get src() {
    return this.srcData;
  }
  get tgt() {
    return this.tgtData;
  }
  get diffClientX() {
    return this.tgt.clientX - this.src.clientX;
  }
  get diffClientY() {
    return this.tgt.clientY - this.src.clientY;
  }
  get diffPageX() {
    return this.tgt.pageX - this.src.pageX;
  }
  get diffPageY() {
    return this.tgt.pageY - this.src.pageY;
  }
  get diffScreenX() {
    return this.tgt.screenX - this.src.screenX;
  }
  get diffScreenY() {
    return this.tgt.screenY - this.src.screenY;
  }
  get duration() {
    return this.tgtData.timeStamp - this.srcData.timeStamp;
  }
  velocity(direction) {
    switch (direction) {
      case "all":
        return Math.hypot(this.diffScreenX, this.diffScreenY) / this.duration * 1e3;
      case "horiz":
        return Math.abs(this.diffScreenX) / this.duration * 1e3;
      case "vert":
        return Math.abs(this.diffScreenY) / this.duration * 1e3;
      default:
        return 0;
    }
  }
  isHorizontal(pxTolerance) {
    return Math.abs(this.diffScreenY) <= pxTolerance && this.diffScreenX !== 0;
  }
  isVertical(pxTolerance) {
    return Math.abs(this.diffScreenX) <= pxTolerance && this.diffScreenY !== 0;
  }
  isLeft(pxTolerance) {
    return this.isHorizontal(pxTolerance) && this.tgt.screenX < this.src.screenX;
  }
  isRight(pxTolerance) {
    return this.isHorizontal(pxTolerance) && this.tgt.screenX > this.src.screenX;
  }
  isTop(pxTolerance) {
    return this.isVertical(pxTolerance) && this.tgt.screenY < this.src.screenY;
  }
  isBottom(pxTolerance) {
    return this.isVertical(pxTolerance) && this.tgt.screenY > this.src.screenY;
  }
  flush() {
    this.srcData.flush();
    this.tgtData.flush();
  }
}

class SrcTgtPointsDataImpl extends SrcTgtDataBase {
  constructor() {
    super(new PointDataImpl(), new PointDataImpl());
  }
  copySrc(data) {
    this.srcData.copy(data);
  }
  copyTgt(data) {
    this.tgtData.copy(data);
  }
}

var __defProp$X = Object.defineProperty;
var __defNormalProp$X = (obj, key, value) => key in obj ? __defProp$X(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$X = (obj, key, value) => {
  __defNormalProp$X(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class DragLockFSM extends FSMImpl {
  constructor(logger, dataHandler) {
    super(logger, dataHandler);
    __publicField$X(this, "firstDbleClick");
    __publicField$X(this, "sndDbleClick");
    __publicField$X(this, "checkButton");
    this.firstDbleClick = new DoubleClickFSM(logger);
    this.sndDbleClick = new DoubleClickFSM(logger);
    const cancelDbleClick = new DoubleClickFSM(logger);
    const errorHandler = {
      "fsmError": (err) => {
        this.notifyHandlerOnError(err);
      }
    };
    this.firstDbleClick.addHandler(errorHandler);
    this.sndDbleClick.addHandler(errorHandler);
    cancelDbleClick.addHandler(errorHandler);
    const cancelled = this.addCancellingState("cancelled");
    const locked = this.addStdState("locked");
    const moved = this.addStdState("moved");
    new SubFSMTransition(
      this.initState,
      locked,
      this.firstDbleClick,
      () => {
        const checkButton = this.firstDbleClick.getCheckButton();
        this.sndDbleClick.setCheckButton(checkButton);
        cancelDbleClick.setCheckButton(checkButton);
        this.dataHandler?.onFirstDbleClick();
      }
    );
    new SubFSMTransition(locked, cancelled, cancelDbleClick);
    const move = new MouseTransition(
      locked,
      moved,
      "mousemove",
      (event) => {
        this.dataHandler?.onMove(event);
      }
    );
    new MouseTransition(moved, moved, "mousemove", move.action);
    new EscapeKeyPressureTransition(locked, cancelled);
    new EscapeKeyPressureTransition(moved, cancelled);
    new SubFSMTransition(moved, this.addTerminalState("dropped"), this.sndDbleClick);
  }
  // eslint-disable-next-line accessor-pairs
  set log(log) {
    super.log = log;
    this.firstDbleClick.log = log;
    this.sndDbleClick.log = log;
  }
  reinit() {
    super.reinit();
    this.firstDbleClick.reinit();
    this.sndDbleClick.reinit();
    this.checkButton = void 0;
  }
  fullReinit() {
    super.fullReinit();
    this.firstDbleClick.fullReinit();
    this.sndDbleClick.fullReinit();
  }
}
class DragLock extends InteractionBase {
  /**
   * Creates a drag lock.
   * @param logger - The logger to use for this interaction
   * @param name - The name of the user interaction
   */
  constructor(logger, name) {
    const handler = {
      "onMove": (evt) => {
        this.data.tgt.copy(evt);
      },
      "onFirstDbleClick": () => {
        this.data.tgt.copy(this.data.src);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(new DragLockFSM(logger, handler), new SrcTgtPointsDataImpl(), logger, name ?? DragLock.name);
    new DoubleClick(logger, this.fsm.firstDbleClick, this.data.src);
    new DoubleClick(logger, this.fsm.sndDbleClick, this.data.tgt);
  }
}

var __defProp$W = Object.defineProperty;
var __defNormalProp$W = (obj, key, value) => key in obj ? __defProp$W(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$W = (obj, key, value) => {
  __defNormalProp$W(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class KeyDownFSM extends FSMImpl {
  /**
   * Creates the FSM.
   * @param modifierAccepted - True: the FSM will consider key modifiers.
   * @param logger - The logger to use for this interaction
   * @param dataHandler - The data handler the FSM will use
   * @param key - The optional accpeted key code
   */
  constructor(modifierAccepted, logger, dataHandler, key) {
    super(logger, dataHandler);
    __publicField$W(this, "modifiersAccepted");
    this.modifiersAccepted = modifierAccepted;
    new KeyTransition(
      this.initState,
      this.addTerminalState("pressed"),
      "keydown",
      (evt) => {
        this.dataHandler?.onKeyPressed(evt);
      },
      (evt) => (key === void 0 || key === evt.code) && (this.modifiersAccepted || !evt.altKey && !evt.ctrlKey && !evt.shiftKey && !evt.metaKey)
    );
  }
  reinit() {
    super.reinit();
  }
}
class KeyDown extends InteractionBase {
  constructor(logger, modifierAccepted, key, fsm, name) {
    const handler = {
      "onKeyPressed": (event) => {
        this._data.copy(event);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(fsm ?? new KeyDownFSM(modifierAccepted, logger, handler, key), new KeyDataImpl(), logger, name ?? KeyDown.name);
  }
}

var __defProp$V = Object.defineProperty;
var __defNormalProp$V = (obj, key, value) => key in obj ? __defProp$V(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$V = (obj, key, value) => {
  __defNormalProp$V(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const _KeysTypedFSM = class extends FSMImpl {
  static getTimeGap() {
    return _KeysTypedFSM.timeGap;
  }
  /**
   * Creates the FSM.
   * @param logger - The logger to use for this interaction
   * @param dataHandler - The data handler the FSM will use
   */
  constructor(logger, dataHandler) {
    super(logger, dataHandler);
    const keyup = this.addStdState("keyup");
    const action = (event) => {
      this.dataHandler?.onKeyTyped(event);
    };
    new KeyTransition(this.initState, keyup, "keyup", action);
    new KeyTransition(keyup, keyup, "keyup", action);
    new TimeoutTransition(keyup, this.addTerminalState("timeouted"), _KeysTypedFSM.timeGapSupplier);
  }
};
let KeysTypedFSM = _KeysTypedFSM;
/** The time gap between the two spinner events. */
__publicField$V(KeysTypedFSM, "timeGap", 1e3);
/**
 * The supplier that provides the time gap.
 * @returns The time gap.
 */
__publicField$V(KeysTypedFSM, "timeGapSupplier", () => _KeysTypedFSM.getTimeGap());
class KeysTyped extends InteractionBase {
  /**
   * Creates the user interaction.
   * @param logger - The logger to use for this interaction
   * @param name - The name of the user interaction
   */
  constructor(logger, name) {
    const handler = {
      "onKeyTyped": (event) => {
        this._data.addKey(event);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(new KeysTypedFSM(logger, handler), new KeysDataImpl(), logger, name ?? KeysTyped.name);
  }
}

var __defProp$U = Object.defineProperty;
var __defNormalProp$U = (obj, key, value) => key in obj ? __defProp$U(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$U = (obj, key, value) => {
  __defNormalProp$U(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class KeyTypedFSM extends FSMImpl {
  constructor(logger, dataHandler, key) {
    super(logger, dataHandler);
    __publicField$U(this, "checkKey");
    this.checkKey = key;
    const pressed = this.addStdState("pressed");
    new KeyTransition(
      this.initState,
      pressed,
      "keydown",
      (event) => {
        if (this.checkKey === void 0) {
          this.checkKey = event.code;
        }
      }
    );
    new KeyTransition(
      pressed,
      this.addTerminalState("typed", true),
      "keyup",
      (evt) => {
        this.dataHandler?.onKeyTyped(evt);
      },
      (evt) => this.checkKey === void 0 || evt.code === this.checkKey
    );
  }
  reinit() {
    super.reinit();
    this.checkKey = void 0;
  }
}
class KeyTyped extends InteractionBase {
  /**
   * Creates the user interaction.
   * @param logger - The logger to use for this interaction
   * @param key - The expected key. Do nothing if the involved key is different
   * @param name - The name of the user interaction
   */
  constructor(logger, key, name) {
    const handler = {
      "onKeyTyped": (event) => {
        this._data.copy(event);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(new KeyTypedFSM(logger, handler, key), new KeyDataImpl(), logger, name ?? KeyTyped.name);
  }
}

var __defProp$T = Object.defineProperty;
var __defNormalProp$T = (obj, key, value) => key in obj ? __defProp$T(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$T = (obj, key, value) => {
  __defNormalProp$T(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class KeyUpFSM extends FSMImpl {
  /**
   * Creates the FSM.
   * @param modifierAccepted - True: the FSM will consider key modifiers.
   * @param logger - The logger to use for this interaction
   * @param dataHandler - The data handler the FSM will use
   */
  constructor(modifierAccepted, logger, dataHandler) {
    super(logger, dataHandler);
    __publicField$T(this, "modifiersAccepted");
    this.modifiersAccepted = modifierAccepted;
    new KeyTransition(
      this.initState,
      this.addTerminalState("released"),
      "keyup",
      (evt) => {
        this.dataHandler?.onKeyUp(evt);
      },
      (ev) => this.modifiersAccepted || !ev.altKey && !ev.ctrlKey && !ev.shiftKey && !ev.metaKey
    );
  }
}
class KeyUp extends InteractionBase {
  constructor(logger, modifierAccepted, fsm, name) {
    const handler = {
      "onKeyUp": (event) => {
        this._data.copy(event);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(fsm ?? new KeyUpFSM(modifierAccepted, logger, handler), new KeyDataImpl(), logger, name ?? KeyUp.name);
  }
}

var __defProp$S = Object.defineProperty;
var __defNormalProp$S = (obj, key, value) => key in obj ? __defProp$S(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$S = (obj, key, value) => {
  __defNormalProp$S(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class LongMouseDownFSM extends FSMImpl {
  /**
   * Creates the long press FSM
   * @param duration - Defines the duration of the long press interaction (in ms).
   * @param logger - The logger to use for this interaction
   * @param dataHandler - The data handler the FSM will use
   */
  constructor(duration, logger, dataHandler) {
    super(logger, dataHandler);
    __publicField$S(this, "duration");
    __publicField$S(this, "currentButton");
    if (duration <= 0) {
      throw new Error("Incorrect duration");
    }
    this.duration = duration;
    this.currentButton = void 0;
    const down = this.addStdState("down");
    const cancelled = this.addCancellingState("cancelled");
    const timeouted = this.addTerminalState("timeouted");
    new MouseTransition(
      this.initState,
      down,
      "mousedown",
      (evt) => {
        this.currentButton = evt.button;
        this.dataHandler?.press(evt);
      }
    );
    const move = new MouseTransition(
      down,
      cancelled,
      "mousemove",
      void 0,
      (evt) => evt.button === this.currentButton
    );
    new MouseTransition(down, cancelled, "mouseup", void 0, move.guard);
    new TimeoutTransition(down, timeouted, () => this.duration);
  }
  reinit() {
    super.reinit();
    this.currentButton = void 0;
  }
}
class LongMouseDown extends InteractionBase {
  /**
   * Creates the long press interaction
   * @param duration - The duration of the pressure required to end the user interaction (in ms)
   * If this duration is not reached, the interaction is cancelled.
   * @param logger - The logger to use for this interaction
   * @param name - The name of the user interaction
   */
  constructor(duration, logger, name) {
    const handler = {
      "press": (evt) => {
        this._data.copy(evt);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(new LongMouseDownFSM(duration, logger, handler), new PointDataImpl(), logger, name ?? LongMouseDown.name);
  }
}

class MouseDownFSM extends FSMImpl {
  constructor(logger, dataHandler) {
    super(logger, dataHandler);
    new MouseTransition(
      this.initState,
      this.addTerminalState("pressed"),
      "mousedown",
      (event) => {
        this.dataHandler?.initToPress(event);
      }
    );
  }
}
class MouseDown extends InteractionBase {
  /**
   * Creates the interaction.
   * @param logger - The logger to use for this interaction
   * @param name - The name of the user interaction
   */
  constructor(logger, name) {
    const handler = {
      "initToPress": (evt) => {
        this._data.copy(evt);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(new MouseDownFSM(logger, handler), new PointDataImpl(), logger, name ?? MouseDown.name);
  }
}

class MouseUpFSM extends FSMImpl {
  constructor(logger, dataHandler) {
    super(logger, dataHandler);
    new MouseTransition(
      this.initState,
      this.addTerminalState("released"),
      "mouseup",
      (event) => {
        this.dataHandler?.initToPress(event);
      }
    );
  }
}
class MouseUp extends InteractionBase {
  /**
   * Creates the interaction.
   * @param logger - The logger to use for this interaction
   * @param name - The name of the user interaction
   */
  constructor(logger, name) {
    const handler = {
      "initToPress": (evt) => {
        this._data.copy(evt);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(new MouseUpFSM(logger, handler), new PointDataImpl(), logger, name ?? MouseUp.name);
  }
}

var __defProp$R = Object.defineProperty;
var __defNormalProp$R = (obj, key, value) => key in obj ? __defProp$R(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$R = (obj, key, value) => {
  __defNormalProp$R(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class TouchTransition extends TransitionBase {
  /**
   * Defines a transition.
   * @param srcState - The source state of the transition.
   * @param tgtState - The srcObject state of the transition.
   * @param eventType - The type of touch event
   * @param action - The action to execute when going through the transition
   * @param guard - The guard to fulfil to execute the transition
   */
  constructor(srcState, tgtState, eventType, action, guard) {
    super(srcState, tgtState, action, guard);
    __publicField$R(this, "acceptedEvents");
    this.acceptedEvents = /* @__PURE__ */ new Set([eventType]);
  }
  accept(evt) {
    return evt instanceof TouchEvent && this.getAcceptedEvents().has(evt.type);
  }
  getAcceptedEvents() {
    return this.acceptedEvents;
  }
}

var __defProp$Q = Object.defineProperty;
var __defNormalProp$Q = (obj, key, value) => key in obj ? __defProp$Q(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$Q = (obj, key, value) => {
  __defNormalProp$Q(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class TouchDataImpl extends PointingDataBase {
  constructor() {
    super(...arguments);
    __publicField$Q(this, "_allTouches", []);
    __publicField$Q(this, "forceData", 0);
    __publicField$Q(this, "identifierData", -1);
    __publicField$Q(this, "radiusXData", 0);
    __publicField$Q(this, "radiusYData", 0);
    __publicField$Q(this, "rotationAngleData", 0);
  }
  get allTouches() {
    return this._allTouches;
  }
  get force() {
    return this.forceData;
  }
  get identifier() {
    return this.identifierData;
  }
  get radiusX() {
    return this.radiusXData;
  }
  get radiusY() {
    return this.radiusYData;
  }
  get rotationAngle() {
    return this.rotationAngleData;
  }
  copy(data) {
    super.copy(data);
    this.forceData = data.force;
    this.identifierData = data.identifier;
    this.radiusXData = data.radiusX;
    this.radiusYData = data.radiusY;
    this.rotationAngleData = data.rotationAngle;
    this._allTouches = data.allTouches.map((touch) => {
      const newT = new TouchDataImpl();
      newT.copy(touch);
      return newT;
    });
  }
  flush() {
    super.flush();
    this.forceData = 0;
    this.identifierData = -1;
    this.radiusXData = 0;
    this.radiusYData = 0;
    this.rotationAngleData = 0;
    this._allTouches = [];
  }
  static mergeTouchEventData(touch, evt, allTouches) {
    const data = new TouchDataImpl();
    data.copy({
      "clientX": touch.clientX,
      "clientY": touch.clientY,
      "force": touch.force,
      "identifier": touch.identifier,
      "pageX": touch.pageX,
      "pageY": touch.pageY,
      "radiusX": touch.radiusX,
      "radiusY": touch.radiusY,
      "rotationAngle": touch.rotationAngle,
      "screenX": touch.screenX,
      "screenY": touch.screenY,
      "target": touch.target,
      "allTouches": allTouches.map((currTouch) => TouchDataImpl.mergeTouchEventData(currTouch, evt, [])),
      "timeStamp": evt.timeStamp,
      "altKey": evt.altKey,
      "shiftKey": evt.shiftKey,
      "ctrlKey": evt.ctrlKey,
      "metaKey": evt.metaKey,
      "currentTarget": evt.currentTarget
    });
    return data;
  }
  toPointData() {
    const point = new PointDataImpl();
    point.copy({
      "button": this.identifier,
      "buttons": 0,
      "movementX": 0,
      "movementY": 0,
      "offsetX": 0,
      "offsetY": 0,
      "relatedTarget": this.target,
      "clientX": this.clientX,
      "clientY": this.clientY,
      "pageX": this.pageX,
      "pageY": this.pageY,
      "screenX": this.screenX,
      "screenY": this.screenY,
      "altKey": this.altKey,
      "ctrlKey": this.ctrlKey,
      "metaKey": this.metaKey,
      "shiftKey": this.shiftKey,
      "timeStamp": this.timeStamp,
      "target": this.target,
      "currentTarget": this.currentTarget
    });
    return point;
  }
}

class SrcTgtTouchDataImpl extends SrcTgtDataBase {
  constructor() {
    super(new TouchDataImpl(), new TouchDataImpl());
  }
  copySrc(data, evt, allTouches) {
    this.srcData.copy(TouchDataImpl.mergeTouchEventData(data, evt, allTouches));
  }
  copyTgt(data, evt, allTouches) {
    this.tgtData.copy(TouchDataImpl.mergeTouchEventData(data, evt, allTouches));
  }
}

var __defProp$P = Object.defineProperty;
var __defNormalProp$P = (obj, key, value) => key in obj ? __defProp$P(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$P = (obj, key, value) => {
  __defNormalProp$P(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class TouchDnDFSM extends FSMImpl {
  /**
   * Creates the FSM.
   * @param cancellable - Whether the DnD can be cancelled by interacting with a dwell-and-spring element.
   * @param logger - The logger to use for this interaction
   * @param dataHandler - The data handler the FSM will use
   * @param movementRequired - Whether the DnD starts after the touch point has begun moving (default)
   * or as soon as the screen is touched. The latter is used for the MultiTouch interaction.
   */
  constructor(cancellable, logger, dataHandler, movementRequired = true) {
    super(logger, dataHandler);
    __publicField$P(this, "touchID");
    __publicField$P(this, "cancellable");
    __publicField$P(this, "movementRequired");
    __publicField$P(this, "cancelled");
    __publicField$P(this, "moved");
    __publicField$P(this, "touched");
    this.touchID = void 0;
    this.cancellable = cancellable;
    this.movementRequired = movementRequired;
    this.cancelled = this.addCancellingState("cancelled");
    this.moved = this.addStdState("moved");
    this.touched = this.addStdState("touched");
    this.buildFSM();
  }
  // eslint-disable-next-line max-lines-per-function
  buildFSM() {
    const released = this.addTerminalState("released");
    const touchDown = (event) => {
      this.touchID = event.changedTouches[0]?.identifier;
      this.dataHandler?.onTouch(event);
    };
    const fixTouchDownCheck = (event) => !Array.from(event.touches).some((touch) => touch.identifier === this.touchID);
    new TouchTransition(this.initState, this.touched, "touchstart", touchDown);
    new TouchTransition(this.touched, this.touched, "touchstart", touchDown, fixTouchDownCheck);
    if (this.movementRequired) {
      this.startingState = this.moved;
      new TouchTransition(
        this.touched,
        this.cancelled,
        "touchend",
        void 0,
        (event) => event.changedTouches[0] !== void 0 && event.changedTouches[0].identifier === this.touchID
      );
    } else {
      new TouchTransition(
        this.touched,
        released,
        "touchend",
        (event) => {
          this.dataHandler?.onRelease(event);
        },
        (event) => event.changedTouches[0] !== void 0 && event.changedTouches[0].identifier === this.touchID
      );
    }
    const moved = (event) => {
      this.dataHandler?.onMove(event);
    };
    const movedPredicate = (event) => event.changedTouches[0]?.identifier === this.touchID;
    new TouchTransition(this.touched, this.moved, "touchmove", moved, movedPredicate);
    new TouchTransition(this.moved, this.moved, "touchmove", moved, movedPredicate);
    new TouchTransition(this.moved, this.touched, "touchstart", touchDown, fixTouchDownCheck);
    if (this.cancellable) {
      new TouchTransition(
        this.moved,
        released,
        "touchend",
        (event) => {
          this.dataHandler?.onRelease(event);
        },
        (event) => {
          const touch = event.changedTouches[0];
          const tgt = document.elementFromPoint(touch.clientX, touch.clientY);
          return touch.identifier === this.touchID && (!(tgt instanceof Element) || !tgt.classList.contains("ioDwellSpring"));
        }
      );
      new TouchTransition(
        this.moved,
        this.cancelled,
        "touchend",
        void 0,
        (ev) => {
          const touch = ev.changedTouches[0];
          const tgt = document.elementFromPoint(touch.clientX, touch.clientY);
          return touch.identifier === this.touchID && tgt instanceof Element && tgt.classList.contains("ioDwellSpring");
        }
      );
    } else {
      new TouchTransition(
        this.moved,
        released,
        "touchend",
        (event) => {
          this.dataHandler?.onRelease(event);
        },
        (event) => event.changedTouches[0]?.identifier === this.touchID
      );
    }
  }
  getTouchId() {
    return this.touchID;
  }
  reinit() {
    super.reinit();
    this.touchID = void 0;
  }
}
class OneTouchDnDFSM extends TouchDnDFSM {
  /**
   * Creates a DnD touch FSM that only works with one touch.
   * @param cancellable - Whether the DnD can be cancelled by interacting with a dwell-and-spring element.
   * @param logger - The logger to use for this interaction
   * @param dataHandler - The data handler the FSM will use
   */
  constructor(cancellable, logger, dataHandler) {
    super(cancellable, logger, dataHandler, true);
  }
  buildFSM() {
    super.buildFSM();
    const check = (event) => event.changedTouches[0] !== void 0 && event.changedTouches[0].identifier !== this.touchID;
    new TouchTransition(this.moved, this.cancelled, "touchstart", void 0, check);
    new TouchTransition(this.touched, this.cancelled, "touchstart", void 0, check);
  }
}
class TouchDnD extends InteractionBase {
  /**
   * Creates the interaction.
   * @param logger - The logger to use for this interaction
   * @param cancellable - Whether the DnD can be cancelled by interacting with a dwell-and-spring element.
   * @param fsm - The optional FSM provided for the interaction
   * @param name - The name of the user interaction
   */
  constructor(logger, cancellable, fsm, name) {
    const handler = {
      "onTouch": (evt) => {
        if (evt.changedTouches[0] !== void 0) {
          const touch = evt.changedTouches[0];
          const all = Array.from(evt.touches);
          this._data.copySrc(touch, evt, all);
          this._data.copyTgt(touch, evt, all);
        }
      },
      "onMove": (evt) => {
        this.setTgtData(evt);
      },
      "onRelease": (evt) => {
        this.setTgtData(evt);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(fsm ?? new OneTouchDnDFSM(cancellable, logger, handler), new SrcTgtTouchDataImpl(), logger, name ?? TouchDnD.name);
  }
  setTgtData(evt) {
    const touch = getTouch(evt.changedTouches, this.data.src.identifier);
    if (touch !== void 0) {
      this._data.copyTgt(touch, evt, Array.from(evt.touches));
    }
  }
}

var __defProp$O = Object.defineProperty;
var __defNormalProp$O = (obj, key, value) => key in obj ? __defProp$O(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$O = (obj, key, value) => {
  __defNormalProp$O(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class ConcurrentAndFSM extends FSMImpl {
  /**
   * Creates the FSM
   * @param fsms - The main concurrent FSMs
   * @param logger - The logger to use
   * @param secondaries - The secondary FSMs. Not considered in some steps.
   * @param totalReinit - Defines whether a cancellation of one of the fsms, reinits all the fsms.
   * @param dataHandler - The data handler the FSM will use
   */
  constructor(fsms, logger, secondaries = [], totalReinit = false, dataHandler) {
    super(logger, dataHandler);
    /**
     * The main fsms
     */
    __publicField$O(this, "_conccurFSMs");
    /**
     * Secondary fsms. These fsms are not considered to determine whether the interaction has started
     */
    __publicField$O(this, "_secondaryFSMs");
    __publicField$O(this, "totalReinit");
    this.totalReinit = totalReinit;
    const handler = {
      "fsmStarts": () => {
        if (this.started) {
          this.onStarting();
        }
      },
      "fsmUpdates": () => {
        this.onUpdating();
      },
      "fsmStops": () => {
        this.onTerminating();
      },
      "fsmCancels": () => {
        this.onCancelling();
      },
      "fsmError": (err) => {
        this.notifyHandlerOnError(err);
      }
    };
    this._conccurFSMs = Array.from(fsms);
    this._secondaryFSMs = Array.from(secondaries);
    for (const fsm of this.conccurFSMs) {
      fsm.addHandler(handler);
    }
  }
  getAllConccurFSMs() {
    return [...this._conccurFSMs, ...this._secondaryFSMs];
  }
  /**
   * @returns The main FSMs
   */
  get conccurFSMs() {
    return Array.from(this._conccurFSMs);
  }
  /**
   * @returns The secondary FSMs
   */
  get secondaryFSMs() {
    return Array.from(this._secondaryFSMs);
  }
  process(event) {
    return this.getAllConccurFSMs().some((conccurFSM) => conccurFSM.process(event));
  }
  acceptVisitor(visitor) {
    visitor.visitAndConcurrentFSM(this);
  }
  get started() {
    return this.conccurFSMs.every((fsm) => fsm.started);
  }
  // eslint-disable-next-line accessor-pairs
  set log(log) {
    super.log = log;
    for (const fsm of this.conccurFSMs) {
      fsm.log = log;
    }
    for (const fsm of this.secondaryFSMs) {
      fsm.log = log;
    }
  }
  uninstall() {
    super.uninstall();
    for (const fsm of this.conccurFSMs) {
      fsm.uninstall();
    }
    for (const fsm of this.secondaryFSMs) {
      fsm.uninstall();
    }
  }
  fullReinit() {
    if (this.totalReinit) {
      for (const fsm of this.conccurFSMs) {
        fsm.fullReinit();
      }
      for (const fsm of this.secondaryFSMs) {
        fsm.fullReinit();
      }
    }
    super.fullReinit();
  }
}

var __defProp$N = Object.defineProperty;
var __defNormalProp$N = (obj, key, value) => key in obj ? __defProp$N(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$N = (obj, key, value) => {
  __defNormalProp$N(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class ConcurrentInteraction extends InteractionBase {
  /**
   * Creates the concurrent interaction.
   * @param fsm - The concurrent FSM that defines the behavior of the user interaction.
   * @param data - The interaction data.
   * @param logger - The logger to use for this interaction
   * @param name - The real name of the interaction
   */
  constructor(fsm, data, logger, name) {
    super(fsm, data, logger, name);
    __publicField$N(this, "subscriptions");
    this.subscriptions = this.fsm.getAllConccurFSMs().map((conc) => conc.currentStateObservable.subscribe((current) => {
      this.updateEventsRegistered(current[1], current[0]);
    }));
  }
  isRunning() {
    return this.isActivated() && this.fsm.started;
  }
  onNodeUnregistered(node) {
    for (const type of this.getCurrentAcceptedEvents()) {
      this.unregisterEventToNode(type, node);
    }
  }
  onNewNodeRegistered(node) {
    for (const type of this.getCurrentAcceptedEvents()) {
      this.registerEventToNode(type, node);
    }
  }
  getCurrentAcceptedEvents(_state) {
    return this.fsm.getAllConccurFSMs().flatMap((concFSM) => Array.from(this.getEventTypesOf(concFSM.currentState)));
  }
  uninstall() {
    super.uninstall();
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }
}

var __defProp$M = Object.defineProperty;
var __defNormalProp$M = (obj, key, value) => key in obj ? __defProp$M(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$M = (obj, key, value) => {
  __defNormalProp$M(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class MultiTouchDataBase {
  velocity(direction) {
    return this.touches.reduce((sum, touch) => sum + touch.velocity(direction), 0) / this.touches.length;
  }
}
class MultiTouchDataImpl extends MultiTouchDataBase {
  /**
   * Creates the interaction data
   */
  constructor() {
    super();
    __publicField$M(this, "touchesData");
    this.touchesData = /* @__PURE__ */ new Map();
  }
  get touches() {
    return Array.from(this.touchesData.values());
  }
  /**
   * Adds a touch data to this multi-touch data
   * @param data - The touch data to add
   */
  addTouchData(data) {
    this.touchesData.set(data.src.identifier, data);
  }
  removeTouchData(id) {
    const tdata = this.touchesData.get(id);
    if (tdata !== void 0) {
      this.touchesData.delete(id);
      tdata.flush();
    }
  }
  flush() {
    for (const data of this.touchesData.values()) {
      data.flush();
    }
    this.touchesData.clear();
  }
  /**
   * Sets new value for the given touch point.
   * The identifier of the given event point is used to find the corresponding
   * touch data.
   * @param tp - The touch event data to use.
   * @param evt - The touch event
   */
  setTouch(tp, evt) {
    const tdata = this.touchesData.get(tp.identifier);
    if (tdata !== void 0) {
      tdata.copyTgt(tp, evt, Array.from(evt.touches));
    }
  }
  /**
   * @param pxTolerance - The pixel tolerance for considering the line horizontal.
   * @returns True if the line of each touch is relatively horizontal and in the same direction.
   */
  isHorizontal(pxTolerance) {
    let direction = 0;
    for (const touch of this.touchesData) {
      if (direction === 0) {
        direction = touch[1].diffScreenX / Math.abs(touch[1].diffScreenX);
      }
      if (!touch[1].isHorizontal(pxTolerance) || touch[1].diffScreenX / Math.abs(touch[1].diffScreenX) !== direction) {
        return false;
      }
    }
    return true;
  }
  /**
   * @param pxTolerance - The pixel tolerance for considering the lines vertical.
   * @returns True if the line of each touch is relatively vertical and in the same direction.
   */
  isVertical(pxTolerance) {
    let direction = 0;
    for (const touch of this.touchesData) {
      if (direction === 0) {
        direction = touch[1].diffScreenY / Math.abs(touch[1].diffScreenY);
      }
      if (!touch[1].isVertical(pxTolerance) || touch[1].diffScreenY / Math.abs(touch[1].diffScreenY) !== direction) {
        return false;
      }
    }
    return true;
  }
}

class MultiTouchFSM extends ConcurrentAndFSM {
  /**
   * Creates the FSM.
   * @param nbTouch - The number of touches of the interaction
   * @param totalReinit - Defines whether a cancellation of one of the fsms, reinits all the fsms.
   * @param logger - The logger to use for this interaction
   * @param dataHandler - The data handler the FSM will use
   * @param movementRequired - Whether the DnD starts after the touch point has begun moving (default)
   * or as soon as the screen is touched. The latter is used for the MultiTouch interaction.
   */
  constructor(nbTouch, totalReinit, logger, dataHandler, movementRequired = false) {
    super(
      Array.from(Array.from({ "length": nbTouch }).keys(), () => new TouchDnDFSM(false, logger, dataHandler, movementRequired)),
      logger,
      totalReinit ? [new TouchDnDFSM(false, logger, dataHandler, movementRequired)] : [],
      totalReinit,
      dataHandler
    );
  }
  process(event) {
    if (!(event instanceof TouchEvent)) {
      return false;
    }
    let processed = false;
    let res = false;
    if (event.type === "touchstart") {
      const ids = new Set(Array.from(event.touches, (touch) => touch.identifier));
      const losts = this.conccurFSMs.filter((fsm) => {
        const id = fsm.getTouchId();
        return id !== void 0 && !ids.has(id);
      });
      for (const lost of losts) {
        lost.reinit();
      }
    }
    for (let i = 0; i < event.changedTouches.length; i++) {
      const first = this.conccurFSMs.find((fsm) => fsm.getTouchId() !== void 0 && fsm.getTouchId() === event.changedTouches[i]?.identifier);
      if (first === void 0) {
        const remainingFSM = this.conccurFSMs.find((fsm) => fsm.getTouchId() === void 0);
        if (remainingFSM === void 0) {
          this.onCancelling();
          res = false;
        } else {
          res = remainingFSM.process(event) || res;
        }
      } else {
        processed = true;
        res = first.process(event) || res;
      }
    }
    return processed && res;
  }
}
class MultiTouch extends ConcurrentInteraction {
  /**
   * Creates the multi-touch interaction
   * @param nbTouches - The number of touches.
   * @param strict - Defines whether too many touches than expected cancelled the ongoing interaction
   * @param logger - The logger to use for this interaction
   * @param name - The name of the user interaction
   * @category Interaction Library
   */
  constructor(nbTouches, strict, logger, name) {
    const handler = {
      "onTouch": (event) => {
        const all = Array.from(event.touches);
        for (const touch of Array.from(event.changedTouches)) {
          const data = new SrcTgtTouchDataImpl();
          data.copySrc(touch, event, all);
          data.copyTgt(touch, event, all);
          this._data.addTouchData(data);
        }
      },
      "onMove": (event) => {
        for (const touch of Array.from(event.changedTouches)) {
          this._data.setTouch(touch, event);
        }
      },
      "onRelease": (event) => {
        for (const touch of Array.from(event.changedTouches)) {
          this._data.setTouch(touch, event);
        }
      },
      "reinitData": () => {
        const currentIDs = new Set(this.fsm.conccurFSMs.filter((fsm) => fsm.started).map((fsm) => fsm.getTouchId()));
        this.data.touches.filter((data) => !currentIDs.has(data.src.identifier)).forEach((data) => {
          this.data.removeTouchData(data.src.identifier);
        });
      }
    };
    super(new MultiTouchFSM(nbTouches, strict, logger, handler), new MultiTouchDataImpl(), logger, name ?? MultiTouch.name);
  }
}

var __defProp$L = Object.defineProperty;
var __defNormalProp$L = (obj, key, value) => key in obj ? __defProp$L(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$L = (obj, key, value) => {
  __defNormalProp$L(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class InteractionBuilderImpl {
  /**
   * @param interactionSupplier - The command that provides an instance of the
   * user interaction to customize.
   */
  constructor(interactionSupplier) {
    __publicField$L(this, "iCtor");
    __publicField$L(this, "startPredicate");
    __publicField$L(this, "thenPredicate");
    __publicField$L(this, "endPredicate");
    __publicField$L(this, "interactionName");
    this.iCtor = interactionSupplier;
    this.startPredicate = void 0;
    this.thenPredicate = void 0;
    this.endPredicate = void 0;
    this.interactionName = void 0;
  }
  first(predicate) {
    this.startPredicate = predicate;
    return this;
  }
  then(predicate) {
    this.thenPredicate = predicate;
    return this;
  }
  firstAndThen(predicate) {
    this.first(predicate);
    this.then(predicate);
    return this;
  }
  end(predicate) {
    this.endPredicate = predicate;
    return this;
  }
  name(name) {
    this.interactionName = name;
    return this;
  }
  build() {
    return () => {
      const i = this.iCtor(this.interactionName);
      i.fsm.addHandler({
        "preFsmStart": () => {
          this.process(i, this.startPredicate);
        },
        "preFsmUpdate": () => {
          this.process(i, this.thenPredicate);
        },
        "preFsmStop": () => {
          this.process(i, this.endPredicate);
        }
      });
      return i;
    };
  }
  process(i, predicate) {
    if (predicate !== void 0 && !predicate(i.data)) {
      throw new CancelFSMError();
    }
  }
}

function hPan(logger, cancellable, pxTolerance, minLength, minVelocity) {
  return new InteractionBuilderImpl((name) => new TouchDnD(logger, cancellable, void 0, name)).firstAndThen((data) => data.isHorizontal(pxTolerance)).end((data) => (minLength === void 0 || Math.abs(data.diffScreenX) >= minLength) && (minVelocity === void 0 || data.velocity("horiz") >= minVelocity)).name(hPan.name).build();
}
function vPan(logger, cancellable, pxTolerance, minLength, minVelocity) {
  return new InteractionBuilderImpl((name) => new TouchDnD(logger, cancellable, void 0, name)).firstAndThen((data) => data.isVertical(pxTolerance)).end((data) => (minLength === void 0 || Math.abs(data.diffScreenY) >= minLength) && (minVelocity === void 0 || data.velocity("vert") >= minVelocity)).name(vPan.name).build();
}
function leftPan(logger, cancellable, pxTolerance, minLength, minVelocity) {
  return new InteractionBuilderImpl((name) => new TouchDnD(logger, cancellable, void 0, name)).firstAndThen((data) => data.isLeft(pxTolerance)).end((data) => (minLength === void 0 || Math.abs(data.diffScreenX) >= minLength) && (minVelocity === void 0 || data.velocity("horiz") >= minVelocity)).name(leftPan.name).build();
}
function rightPan(logger, cancellable, pxTolerance, minLength, minVelocity) {
  return new InteractionBuilderImpl((name) => new TouchDnD(logger, cancellable, void 0, name)).firstAndThen((data) => data.isRight(pxTolerance)).end((data) => (minLength === void 0 || Math.abs(data.diffScreenX) >= minLength) && (minVelocity === void 0 || data.velocity("horiz") >= minVelocity)).name(rightPan.name).build();
}
function topPan(logger, cancellable, pxTolerance, minLength, minVelocity) {
  return new InteractionBuilderImpl((name) => new TouchDnD(logger, cancellable, void 0, name)).firstAndThen((data) => data.isTop(pxTolerance)).end((data) => (minLength === void 0 || Math.abs(data.diffScreenY) >= minLength) && (minVelocity === void 0 || data.velocity("vert") >= minVelocity)).name(topPan.name).build();
}
function bottomPan(logger, cancellable, pxTolerance, minLength, minVelocity) {
  return new InteractionBuilderImpl((name) => new TouchDnD(logger, cancellable, void 0, name)).firstAndThen((data) => data.isBottom(pxTolerance)).end((data) => (minLength === void 0 || Math.abs(data.diffScreenY) >= minLength) && (minVelocity === void 0 || data.velocity("vert") >= minVelocity)).name(bottomPan.name).build();
}

var __defProp$K = Object.defineProperty;
var __defNormalProp$K = (obj, key, value) => key in obj ? __defProp$K(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$K = (obj, key, value) => {
  __defNormalProp$K(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class TwoTouchDataImpl extends MultiTouchDataBase {
  constructor() {
    super();
    __publicField$K(this, "t1");
    __publicField$K(this, "t2");
    this.t1 = new SrcTgtTouchDataImpl();
    this.t2 = new SrcTgtTouchDataImpl();
  }
  get touch1() {
    return this.t1;
  }
  get touch2() {
    return this.t2;
  }
  get touches() {
    return [this.t1, this.t2];
  }
  flush() {
    this.t1.flush();
    this.t2.flush();
  }
  initTouch(data, evt, allTouches) {
    if (this.t1.src.identifier === -1) {
      this.t1.copySrc(data, evt, allTouches);
      this.t1.copyTgt(data, evt, allTouches);
    } else {
      if (this.t2.src.identifier === -1) {
        this.t2.copySrc(data, evt, allTouches);
        this.t2.copyTgt(data, evt, allTouches);
      }
    }
  }
  copyTouch(data, evt, allTouches) {
    if (this.t1.src.identifier === data.identifier) {
      this.t1.copyTgt(data, evt, allTouches);
    } else {
      if (this.t2.src.identifier === data.identifier) {
        this.t2.copyTgt(data, evt, allTouches);
      }
    }
  }
  get diffClientX() {
    return (this.t1.diffClientX + this.t2.diffClientX) / 2;
  }
  get diffClientY() {
    return (this.t1.diffClientY + this.t2.diffClientY) / 2;
  }
  get diffPageX() {
    return (this.t1.diffPageX + this.t2.diffPageX) / 2;
  }
  get diffPageY() {
    return (this.t1.diffPageY + this.t2.diffPageY) / 2;
  }
  get diffScreenX() {
    return (this.t1.diffScreenX + this.t2.diffScreenX) / 2;
  }
  get diffScreenY() {
    return (this.t1.diffScreenY + this.t2.diffScreenY) / 2;
  }
}

class RotationTouchDataImpl extends TwoTouchDataImpl {
  constructor() {
    super();
  }
  get rotationAngle() {
    return this.computeAngle(this.t1.src, this.t2.src) - this.computeAngle(this.t1.src, this.t2.tgt);
  }
  computeAngle(t1, t2) {
    return Math.atan2(t2.clientX - t1.clientX, t1.clientY - t2.clientY);
  }
}

class ScaleTouchDataImpl extends TwoTouchDataImpl {
  constructor() {
    super();
  }
  scalingRatio(pxTolerance) {
    const t0 = this.t1;
    const t1 = this.t2;
    if (t0.src.identifier === -1 || t1.src.identifier === -1) {
      return 0;
    }
    const tgt1 = [t0.tgt.screenX, t0.tgt.screenY];
    const tgt2 = [t1.tgt.screenX, t1.tgt.screenY];
    const src1 = [t0.src.screenX, t0.src.screenY];
    const src2 = [t1.src.screenX, t1.src.screenY];
    const vector1 = [t0.diffScreenX, t0.diffScreenY];
    const vector2 = [t1.diffScreenX, t1.diffScreenY];
    const lineVector = [tgt2[0] - tgt1[0], tgt2[1] - tgt1[1]];
    const projection1 = ScaleTouchDataImpl.project(vector1, lineVector);
    const projectionVector1 = [projection1 * lineVector[0], projection1 * lineVector[1]];
    const projection2 = ScaleTouchDataImpl.project(vector2, lineVector);
    const projectionVector2 = [projection2 * lineVector[0], projection2 * lineVector[1]];
    if (projection1 / Math.abs(projection1) === projection2 / Math.abs(projection2)) {
      return 0;
    }
    const distance1 = ScaleTouchDataImpl.distance(projectionVector1, vector1);
    const distance2 = ScaleTouchDataImpl.distance(projectionVector2, vector2);
    if (distance1 > pxTolerance || distance2 > pxTolerance || Number.isNaN(distance1) || Number.isNaN(distance2)) {
      return 0;
    }
    return ScaleTouchDataImpl.distance(tgt1, tgt2) / ScaleTouchDataImpl.distance(src1, src2);
  }
  /**
   * @param vector1 - The first vector of the projection
   * @param vector2 -The second vector of the projection
   * @returns The value of the projection of vector1 on vector2
   */
  static project(vector1, vector2) {
    return (vector1[0] * vector2[0] + vector1[1] * vector2[1]) / (vector2[0] ** 2 + vector2[1] ** 2);
  }
  /**
   * @param point1 - The first point
   * @param point2 - The second point
   * @returns the distance between point1 and point2
   */
  static distance(point1, point2) {
    return Math.hypot(point2[0] - point1[0], point2[1] - point1[1]);
  }
}

class TwoPanDataImpl extends TwoTouchDataImpl {
  constructor() {
    super();
  }
  isVertical(pxTolerance) {
    return this.isTop(pxTolerance) || this.isBottom(pxTolerance);
  }
  isHorizontal(pxTolerance) {
    return this.isLeft(pxTolerance) || this.isRight(pxTolerance);
  }
  isLeft(pxTolerance) {
    return this.t1.isLeft(pxTolerance) && this.t2.isLeft(pxTolerance);
  }
  isRight(pxTolerance) {
    return this.t1.isRight(pxTolerance) && this.t2.isRight(pxTolerance);
  }
  isTop(pxTolerance) {
    return this.t1.isTop(pxTolerance) && this.t2.isTop(pxTolerance);
  }
  isBottom(pxTolerance) {
    return this.t1.isBottom(pxTolerance) && this.t2.isBottom(pxTolerance);
  }
}

var __defProp$J = Object.defineProperty;
var __defNormalProp$J = (obj, key, value) => key in obj ? __defProp$J(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$J = (obj, key, value) => {
  __defNormalProp$J(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class GeneralTwoTouchDataImpl extends TwoTouchDataImpl {
  constructor() {
    super();
    __publicField$J(this, "rotateData");
    __publicField$J(this, "panData");
    __publicField$J(this, "scaleData");
    this.rotateData = new RotationTouchDataImpl();
    this.panData = new TwoPanDataImpl();
    this.scaleData = new ScaleTouchDataImpl();
  }
  isVertical(pxTolerance) {
    return this.panData.isVertical(pxTolerance);
  }
  isHorizontal(pxTolerance) {
    return this.panData.isHorizontal(pxTolerance);
  }
  isLeft(pxTolerance) {
    return this.panData.isLeft(pxTolerance);
  }
  isRight(pxTolerance) {
    return this.panData.isRight(pxTolerance);
  }
  isTop(pxTolerance) {
    return this.panData.isTop(pxTolerance);
  }
  isBottom(pxTolerance) {
    return this.panData.isBottom(pxTolerance);
  }
  get rotationAngle() {
    return this.rotateData.rotationAngle;
  }
  scalingRatio(pxTolerance) {
    return this.scaleData.scalingRatio(pxTolerance);
  }
}

var __defProp$I = Object.defineProperty;
var __defNormalProp$I = (obj, key, value) => key in obj ? __defProp$I(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$I = (obj, key, value) => {
  __defNormalProp$I(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class ThreeTouchDataImpl extends GeneralTwoTouchDataImpl {
  constructor() {
    super();
    __publicField$I(this, "t3");
    this.t3 = new SrcTgtTouchDataImpl();
  }
  get touch3() {
    return this.t3;
  }
  flush() {
    super.flush();
    this.t3.flush();
  }
  initTouch(data, evt, allTouches) {
    if (this.t3.src.identifier === -1 && this.t2.src.identifier !== -1) {
      this.t3.copySrc(data, evt, allTouches);
      this.t3.copyTgt(data, evt, allTouches);
    } else {
      super.initTouch(data, evt, allTouches);
    }
  }
  copyTouch(data, evt, allTouches) {
    if (this.t3.src.identifier === data.identifier) {
      this.t3.copyTgt(data, evt, allTouches);
    } else {
      super.copyTouch(data, evt, allTouches);
    }
  }
  isLeft(pxTolerance) {
    return super.isLeft(pxTolerance) && this.t3.isLeft(pxTolerance);
  }
  isRight(pxTolerance) {
    return super.isRight(pxTolerance) && this.t3.isRight(pxTolerance);
  }
  isTop(pxTolerance) {
    return super.isTop(pxTolerance) && this.t3.isTop(pxTolerance);
  }
  isBottom(pxTolerance) {
    return super.isBottom(pxTolerance) && this.t3.isBottom(pxTolerance);
  }
}

var __defProp$H = Object.defineProperty;
var __defNormalProp$H = (obj, key, value) => key in obj ? __defProp$H(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$H = (obj, key, value) => {
  __defNormalProp$H(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class FourTouchDataImpl extends ThreeTouchDataImpl {
  constructor() {
    super();
    __publicField$H(this, "t4");
    this.t4 = new SrcTgtTouchDataImpl();
  }
  get touch4() {
    return this.t4;
  }
  initTouch(data, evt, allTouches) {
    if (this.t4.src.identifier === -1 && this.t3.src.identifier !== -1) {
      this.t4.copySrc(data, evt, allTouches);
      this.t4.copyTgt(data, evt, allTouches);
    } else {
      super.initTouch(data, evt, allTouches);
    }
  }
  copyTouch(data, evt, allTouches) {
    if (this.t4.src.identifier === data.identifier) {
      this.t4.copyTgt(data, evt, allTouches);
    } else {
      super.copyTouch(data, evt, allTouches);
    }
  }
  flush() {
    super.flush();
    this.t4.flush();
  }
  isLeft(pxTolerance) {
    return super.isLeft(pxTolerance) && this.t4.isLeft(pxTolerance);
  }
  isRight(pxTolerance) {
    return super.isRight(pxTolerance) && this.t4.isRight(pxTolerance);
  }
  isTop(pxTolerance) {
    return super.isTop(pxTolerance) && this.t4.isTop(pxTolerance);
  }
  isBottom(pxTolerance) {
    return super.isBottom(pxTolerance) && this.t4.isBottom(pxTolerance);
  }
}

class XTouchDnD extends ConcurrentInteraction {
  /**
   * Creates the interaction.
   * @param nbTouches - The number of touches of the interaction
   * @param logger - The logger to use for this interaction
   * @param dataImpl - The interaction data instance to use.
   * @param name - The name of the user interaction
   * @param fsm - The optional FSM provided for the interaction
   * @param movementRequired - Whether the DnD starts after the touch point has begun moving (default)
   * or as soon as the screen is touched. The latter is used for the MultiTouch interaction.
   */
  constructor(nbTouches, logger, dataImpl, name, fsm, movementRequired) {
    const handler = {
      "onTouch": (evt) => {
        const all = Array.from(evt.touches);
        for (const touch of Array.from(evt.changedTouches)) {
          this._data.initTouch(touch, evt, all);
        }
      },
      "onMove": (evt) => {
        this.setTgtData(evt);
      },
      "onRelease": (evt) => {
        this.setTgtData(evt);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(fsm ?? new MultiTouchFSM(nbTouches, true, logger, handler, movementRequired), dataImpl, logger, name ?? XTouchDnD.name);
  }
  setTgtData(evt) {
    const all = Array.from(evt.touches);
    for (const touch of Array.from(evt.changedTouches)) {
      this._data.copyTouch(touch, evt, all);
    }
  }
}
function twoTouch(logger) {
  return new InteractionBuilderImpl((name) => new XTouchDnD(
    2,
    logger,
    new GeneralTwoTouchDataImpl(),
    name,
    void 0,
    false
  )).name(twoTouch.name).build();
}
class ThreeTouchDnD extends XTouchDnD {
  constructor(logger, name, movementRequired) {
    super(3, logger, new ThreeTouchDataImpl(), name ?? ThreeTouchDnD.name, void 0, movementRequired);
  }
}
class FourTouchDnD extends XTouchDnD {
  constructor(logger, name, movementRequired) {
    super(4, logger, new FourTouchDataImpl(), name ?? FourTouchDnD.name, void 0, movementRequired);
  }
}

function twoHPan(logger, pxTolerance, minLength, minVelocity) {
  return new InteractionBuilderImpl((name) => new XTouchDnD(
    2,
    logger,
    new TwoPanDataImpl(),
    name,
    void 0,
    true
  )).firstAndThen((data) => data.isHorizontal(pxTolerance)).end((data) => (minLength === void 0 || Math.abs(data.diffScreenX) >= minLength) && (minVelocity === void 0 || data.velocity("horiz") >= minVelocity)).name(twoHPan.name).build();
}
function twoVPan(logger, pxTolerance, minLength, minVelocity) {
  return new InteractionBuilderImpl((name) => new XTouchDnD(
    2,
    logger,
    new TwoPanDataImpl(),
    name,
    void 0,
    true
  )).firstAndThen((data) => data.isVertical(pxTolerance)).end((data) => (minLength === void 0 || Math.abs(data.diffScreenY) >= minLength) && (minVelocity === void 0 || data.velocity("horiz") >= minVelocity)).name(twoVPan.name).build();
}
function twoLeftPan(logger, pxTolerance, minLength, minVelocity) {
  return new InteractionBuilderImpl((name) => new XTouchDnD(
    2,
    logger,
    new TwoPanDataImpl(),
    name,
    void 0,
    true
  )).firstAndThen((data) => data.isLeft(pxTolerance)).end((data) => (minLength === void 0 || Math.abs(data.diffScreenX) >= minLength) && (minVelocity === void 0 || data.velocity("horiz") >= minVelocity)).name(twoLeftPan.name).build();
}
function twoRightPan(logger, pxTolerance, minLength, minVelocity) {
  return new InteractionBuilderImpl((name) => new XTouchDnD(
    2,
    logger,
    new TwoPanDataImpl(),
    name,
    void 0,
    true
  )).firstAndThen((data) => data.isRight(pxTolerance)).end((data) => (minLength === void 0 || Math.abs(data.diffScreenX) >= minLength) && (minVelocity === void 0 || data.velocity("horiz") >= minVelocity)).name(twoRightPan.name).build();
}
function twoTopPan(logger, pxTolerance, minLength, minVelocity) {
  return new InteractionBuilderImpl((name) => new XTouchDnD(
    2,
    logger,
    new TwoPanDataImpl(),
    name,
    void 0,
    true
  )).firstAndThen((data) => data.isTop(pxTolerance)).end((data) => (minLength === void 0 || Math.abs(data.diffScreenY) >= minLength) && (minVelocity === void 0 || data.velocity("horiz") >= minVelocity)).name(twoTopPan.name).build();
}
function twoBottomPan(logger, pxTolerance, minLength, minVelocity) {
  return new InteractionBuilderImpl((name) => new XTouchDnD(
    2,
    logger,
    new TwoPanDataImpl(),
    name,
    void 0,
    true
  )).firstAndThen((data) => data.isBottom(pxTolerance)).end((data) => (minLength === void 0 || Math.abs(data.diffScreenY) >= minLength) && (minVelocity === void 0 || data.velocity("horiz") >= minVelocity)).name(twoBottomPan.name).build();
}

var __defProp$G = Object.defineProperty;
var __defNormalProp$G = (obj, key, value) => key in obj ? __defProp$G(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$G = (obj, key, value) => {
  __defNormalProp$G(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class CheckerImpl {
  constructor() {
    __publicField$G(this, "linterRules");
    __publicField$G(this, "cacheIncluded");
    this.linterRules = /* @__PURE__ */ new Map();
    this.linterRules.set("same-interactions", "ignore");
    this.linterRules.set("same-data", "ignore");
    this.linterRules.set("included", "ignore");
    this.cacheIncluded = /* @__PURE__ */ new Map();
  }
  setLinterRules(...rules) {
    for (const rule of rules) {
      this.linterRules.set(rule[0], rule[1]);
    }
    if (this.getIncludedSeverity() !== "ignore") {
      this.fillCacheIncluded();
    }
  }
  checkRules(binding, binds) {
    this.checkSameData(binding, binds);
    if (this.getSameDataSeverity() !== this.getSameInteractionSeverity()) {
      this.checkSameInteractions(binding, binds);
    }
    this.checkIncluded(binding, binds);
  }
  checkSameInteractions(binding, binds) {
    this.checkRule(
      "same-interactions",
      this.getSameInteractionSeverity(binding),
      binding,
      binds,
      (currBinding) => binding.interaction.name === currBinding.interaction.name,
      "[same-interactions] Two bindings use the same user interaction on same widget."
    );
  }
  checkSameData(binding, binds) {
    this.checkRule(
      "same-data",
      this.getSameDataSeverity(binding),
      binding,
      binds,
      (currBinding) => binding.interaction.data.constructor === currBinding.interaction.data.constructor,
      "[same-data] Two bindings use the same user interaction data type on same widget."
    );
  }
  checkIncluded(binding, binds) {
    this.checkRule(
      "included",
      this.getIncludedSeverity(binding),
      binding,
      binds,
      (currBinding) => this.isIncluded(binding.interaction.name, currBinding.interaction.name),
      "[included] The interaction of the first binding is included into the interaction of a second one."
    );
  }
  checkRule(ruleName, severity, binding, binds, predicate, msg) {
    if (severity !== "ignore" && !binding.isWhenDefined() && binds.filter((currBinding) => currBinding.linterRules.get(ruleName) !== "ignore" && !currBinding.isWhenDefined()).some((currBinding) => predicate(currBinding) && this.isWidgetSetsIntersecting(binding.interaction.registeredNodes, currBinding.interaction.registeredNodes))) {
      this.printLinterMsg(severity, msg);
    }
  }
  isIncluded(i1, i2) {
    return (this.cacheIncluded.get(i1)?.has(i2) ?? false) || (this.cacheIncluded.get(i2)?.has(i1) ?? false);
  }
  getSameDataSeverity(binding) {
    return binding?.linterRules.get("same-data") ?? this.linterRules.get("same-data") ?? "err";
  }
  getSameInteractionSeverity(binding) {
    return binding?.linterRules.get("same-interactions") ?? this.linterRules.get("same-interactions") ?? "err";
  }
  getIncludedSeverity(binding) {
    return binding?.linterRules.get("included") ?? this.linterRules.get("included") ?? "err";
  }
  isWidgetSetsIntersecting(w1, w2) {
    return Array.from(w1.values()).some((widget) => w2.has(widget));
  }
  printLinterMsg(severity, msg) {
    if (severity === "err") {
      throw new Error(msg);
    } else {
      console.warn(msg);
    }
  }
  fillCacheIncluded() {
    if (this.cacheIncluded.size === 0) {
      this.cacheIncluded.set(Click.name, /* @__PURE__ */ new Set([DragLock.name, DoubleClick.name, Clicks.name]));
      this.cacheIncluded.set(DoubleClick.name, /* @__PURE__ */ new Set([DragLock.name]));
      this.cacheIncluded.set(KeyDown.name, /* @__PURE__ */ new Set([KeyTyped.name]));
      this.cacheIncluded.set(KeyUp.name, /* @__PURE__ */ new Set([KeyTyped.name]));
      this.cacheIncluded.set(KeyTyped.name, /* @__PURE__ */ new Set([KeysTyped.name]));
      this.cacheIncluded.set(LongMouseDown.name, /* @__PURE__ */ new Set([Click.name, DoubleClick.name, Clicks.name]));
      this.cacheIncluded.set(MouseDown.name, /* @__PURE__ */ new Set([LongMouseDown.name, Click.name, DoubleClick.name, Clicks.name]));
      this.cacheIncluded.set(MouseUp.name, /* @__PURE__ */ new Set([Click.name, DoubleClick.name, Clicks.name]));
      this.cacheIncluded.set(leftPan.name, /* @__PURE__ */ new Set([hPan.name, TouchDnD.name]));
      this.cacheIncluded.set(rightPan.name, /* @__PURE__ */ new Set([hPan.name, TouchDnD.name]));
      this.cacheIncluded.set(topPan.name, /* @__PURE__ */ new Set([vPan.name, TouchDnD.name]));
      this.cacheIncluded.set(bottomPan.name, /* @__PURE__ */ new Set([vPan.name, TouchDnD.name]));
      this.cacheIncluded.set(hPan.name, /* @__PURE__ */ new Set([TouchDnD.name]));
      this.cacheIncluded.set(vPan.name, /* @__PURE__ */ new Set([TouchDnD.name]));
      this.cacheIncluded.set(twoHPan.name, /* @__PURE__ */ new Set([MultiTouch.name]));
      this.cacheIncluded.set(twoVPan.name, /* @__PURE__ */ new Set([MultiTouch.name]));
      this.cacheIncluded.set(twoLeftPan.name, /* @__PURE__ */ new Set([twoHPan.name, MultiTouch.name]));
      this.cacheIncluded.set(twoRightPan.name, /* @__PURE__ */ new Set([twoHPan.name, MultiTouch.name]));
      this.cacheIncluded.set(twoTopPan.name, /* @__PURE__ */ new Set([twoVPan.name, MultiTouch.name]));
      this.cacheIncluded.set(twoBottomPan.name, /* @__PURE__ */ new Set([twoVPan.name, MultiTouch.name]));
    }
  }
}

var __defProp$F = Object.defineProperty;
var __defNormalProp$F = (obj, key, value) => key in obj ? __defProp$F(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$F = (obj, key, value) => {
  __defNormalProp$F(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class BindingsContext {
  constructor() {
    /**
     * The bindings gathered when created using `Bindings` routines
     */
    __publicField$F(this, "binds");
    /**
     * For each gathered binding, listening the produced commands
     */
    __publicField$F(this, "disposables");
    /**
     * The commands produced by the gathered bindings
     */
    __publicField$F(this, "cmds");
    __publicField$F(this, "checker");
    this.binds = [];
    this.disposables = [];
    this.cmds = [];
    this.checker = new CheckerImpl();
  }
  observeBinding(binding) {
    this.checker.checkRules(binding, this.binds);
    this.binds.push(binding);
    this.disposables.push(binding.produces.subscribe((cmd) => this.cmds.push([cmd, binding])));
  }
  clearObservedBindings() {
    for (const dispos of this.disposables) {
      dispos.unsubscribe();
    }
    for (const bind of this.binds) {
      bind.uninstallBinding();
    }
  }
  /**
   * @returns A read-only array of the gathered bindings.
   */
  get bindings() {
    return this.binds;
  }
  /**
   * @returns A read-only array of the commands produced by the gathered bindings.
   */
  get commands() {
    return this.cmds.map((tuple) => tuple[0]);
  }
  /**
   * @param index - The index of the command (in the order of production)
   * @returns The command at the given index. The command is casted into the provided generic type.
   * @typeParam C - The type of the command to return.
   */
  getCmd(index) {
    return this.cmds[index]?.[0];
  }
  /**
   * @param binding - binding The binding to consider
   * @returns The commands produced by the given binding.
   */
  getCmdsProducedBy(binding) {
    return this.cmds.filter((cmd) => cmd[1] === binding).map((cmd) => cmd[0]);
  }
}

var __defProp$E = Object.defineProperty;
var __defNormalProp$E = (obj, key, value) => key in obj ? __defProp$E(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$E = (obj, key, value) => {
  __defNormalProp$E(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Redo extends CommandBase {
  constructor(undoHistory) {
    super();
    __publicField$E(this, "history");
    this.history = undoHistory;
  }
  canExecute() {
    return this.history.getLastRedo() !== void 0;
  }
  execution() {
    this.history.redo();
  }
}

var __defProp$D = Object.defineProperty;
var __defNormalProp$D = (obj, key, value) => key in obj ? __defProp$D(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$D = (obj, key, value) => {
  __defNormalProp$D(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Undo extends CommandBase {
  constructor(undoHistory) {
    super();
    __publicField$D(this, "history");
    this.history = undoHistory;
  }
  canExecute() {
    return this.history.getLastUndo() !== void 0;
  }
  execution() {
    this.history.undo();
  }
}

var __defProp$C = Object.defineProperty;
var __defNormalProp$C = (obj, key, value) => key in obj ? __defProp$C(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$C = (obj, key, value) => {
  __defNormalProp$C(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const _BoxCheckPressedTransition = class extends TransitionBase {
  /**
   * Creates the transition.
   * @param srcState - The source state of the transition
   * @param tgtState - The output state of the transition
   * @param action - The action to execute when going through the transition
   * @param guard - The guard to fulfil to execute the transition
   */
  constructor(srcState, tgtState, action, guard) {
    super(srcState, tgtState, action, guard);
  }
  accept(event) {
    return event.currentTarget !== null && isCheckBox(event.currentTarget);
  }
  getAcceptedEvents() {
    return _BoxCheckPressedTransition.acceptedEvents;
  }
};
let BoxCheckPressedTransition = _BoxCheckPressedTransition;
__publicField$C(BoxCheckPressedTransition, "acceptedEvents", /* @__PURE__ */ new Set(["input"]));

class WidgetDataImpl extends InteractionDataBase {
  get widget() {
    return this.targetData;
  }
}

class BoxCheckedFSM extends FSMImpl {
  constructor(logger, dataHandler) {
    super(logger, dataHandler);
    new BoxCheckPressedTransition(
      this.initState,
      this.addTerminalState("checked"),
      (evt) => {
        this.dataHandler?.initToCheckHandler(evt);
      }
    );
  }
}
class BoxChecked extends InteractionBase {
  /**
   * Creates the interaction.
   * @param logger - The logger to use for this interaction
   * @param name - The name of the user interaction
   */
  constructor(logger, name) {
    const handler = {
      "initToCheckHandler": (event) => {
        this._data.copy(event);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(new BoxCheckedFSM(logger, handler), new WidgetDataImpl(), logger, name ?? BoxChecked.name);
  }
  onNewNodeRegistered(node) {
    if (isCheckBox(node)) {
      this.registerActionHandlerInput(node);
    }
  }
  onNodeUnregistered(node) {
    if (isCheckBox(node)) {
      this.unregisterActionHandlerInput(node);
    }
  }
}

var __defProp$B = Object.defineProperty;
var __defNormalProp$B = (obj, key, value) => key in obj ? __defProp$B(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$B = (obj, key, value) => {
  __defNormalProp$B(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const _ButtonPressedTransition = class extends TransitionBase {
  /**
   * Creates the transition.
   * @param srcState - The source state of the transition
   * @param tgtState - The output state of the transition
   * @param action - The action to execute when going through the transition
   * @param guard - The guard to fulfil to execute the transition
   */
  constructor(srcState, tgtState, action, guard) {
    super(srcState, tgtState, action, guard);
  }
  accept(evt) {
    return evt.currentTarget !== null && isButton(evt.currentTarget);
  }
  getAcceptedEvents() {
    return _ButtonPressedTransition.acceptedEvents;
  }
};
let ButtonPressedTransition = _ButtonPressedTransition;
__publicField$B(ButtonPressedTransition, "acceptedEvents", /* @__PURE__ */ new Set(["click", "auxclick"]));

class ButtonPressedFSM extends FSMImpl {
  /**
   * Creates the FSM
   * @param logger - The logger to use for this interaction
   * @param dataHandler - The data handler the FSM will use
   */
  constructor(logger, dataHandler) {
    super(logger, dataHandler);
    new ButtonPressedTransition(
      this.initState,
      this.addTerminalState("pressed"),
      (evt) => {
        this.dataHandler?.initToPressedHandler(evt);
      }
    );
  }
}
class ButtonPressed extends InteractionBase {
  /**
   * Creates the interaction.
   * @param logger - The logger to use for this interaction
   * @param name - The name of the user interaction
   */
  constructor(logger, name) {
    const handler = {
      "initToPressedHandler": (event) => {
        this._data.copy(event);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(new ButtonPressedFSM(logger, handler), new WidgetDataImpl(), logger, name ?? ButtonPressed.name);
  }
  onNewNodeRegistered(node) {
    if (isButton(node)) {
      this.registerActionHandlerClick(node);
    }
  }
  onNodeUnregistered(node) {
    if (isButton(node)) {
      this.unregisterActionHandlerClick(node);
    }
  }
}

var __defProp$A = Object.defineProperty;
var __defNormalProp$A = (obj, key, value) => key in obj ? __defProp$A(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$A = (obj, key, value) => {
  __defNormalProp$A(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const _ColorPickedTransition = class extends TransitionBase {
  /**
   * Creates the transition.
   * @param srcState - The source state of the transition
   * @param tgtState - The output state of the transition
   * @param action - The action to execute when going through the transition
   * @param guard - The guard to fulfil to execute the transition
   */
  constructor(srcState, tgtState, action, guard) {
    super(srcState, tgtState, action, guard);
  }
  accept(event) {
    return event.currentTarget !== null && isColorChoice(event.currentTarget);
  }
  getAcceptedEvents() {
    return _ColorPickedTransition.acceptedEvents;
  }
};
let ColorPickedTransition = _ColorPickedTransition;
__publicField$A(ColorPickedTransition, "acceptedEvents", /* @__PURE__ */ new Set(["input"]));

class ColorPickedFSM extends FSMImpl {
  constructor(logger, dataHandler) {
    super(logger, dataHandler);
    new ColorPickedTransition(
      this.initState,
      this.addTerminalState("picked"),
      (evt) => {
        this.dataHandler?.initToPickedHandler(evt);
      }
    );
  }
}
class ColorPicked extends InteractionBase {
  /**
   * Creates the interaction.
   * @param logger - The logger to use for this interaction
   * @param name - The name of the user interaction
   */
  constructor(logger, name) {
    const handler = {
      "initToPickedHandler": (event) => {
        this._data.copy(event);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(new ColorPickedFSM(logger, handler), new WidgetDataImpl(), logger, name ?? ColorPicked.name);
  }
  onNewNodeRegistered(node) {
    if (isColorChoice(node)) {
      this.registerActionHandlerInput(node);
    }
  }
  onNodeUnregistered(node) {
    if (isColorChoice(node)) {
      this.unregisterActionHandlerInput(node);
    }
  }
}

var __defProp$z = Object.defineProperty;
var __defNormalProp$z = (obj, key, value) => key in obj ? __defProp$z(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$z = (obj, key, value) => {
  __defNormalProp$z(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const _ComboBoxTransition = class extends TransitionBase {
  /**
   * Creates the transition.
   * @param srcState - The source state of the transition
   * @param tgtState - The output state of the transition
   * @param action - The action to execute when going through the transition
   * @param guard - The guard to fulfil to execute the transition
   */
  constructor(srcState, tgtState, action, guard) {
    super(srcState, tgtState, action, guard);
  }
  accept(event) {
    return event.currentTarget !== null && isComboBox(event.currentTarget);
  }
  getAcceptedEvents() {
    return _ComboBoxTransition.acceptedEvents;
  }
};
let ComboBoxTransition = _ComboBoxTransition;
__publicField$z(ComboBoxTransition, "acceptedEvents", /* @__PURE__ */ new Set(["input"]));

class ComboBoxSelectedFSM extends FSMImpl {
  constructor(logger, dataHandler) {
    super(logger, dataHandler);
    new ComboBoxTransition(
      this.initState,
      this.addTerminalState("selected"),
      (evt) => {
        this.dataHandler?.initToSelectedHandler(evt);
      }
    );
  }
}
class ComboBoxSelected extends InteractionBase {
  /**
   * Creates the interaction.
   * @param logger - The logger to use for this interaction
   * @param name - The name of the user interaction
   */
  constructor(logger, name) {
    const handler = {
      "initToSelectedHandler": (event) => {
        this._data.copy(event);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(new ComboBoxSelectedFSM(logger, handler), new WidgetDataImpl(), logger, name ?? ComboBoxSelected.name);
  }
  onNewNodeRegistered(node) {
    if (isComboBox(node)) {
      this.registerActionHandlerInput(node);
    }
  }
  onNodeUnregistered(node) {
    if (isComboBox(node)) {
      this.unregisterActionHandlerInput(node);
    }
  }
}

var __defProp$y = Object.defineProperty;
var __defNormalProp$y = (obj, key, value) => key in obj ? __defProp$y(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$y = (obj, key, value) => {
  __defNormalProp$y(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const _DatePickedTransition = class extends TransitionBase {
  /**
   * Creates the transition.
   * @param srcState - The source state of the transition
   * @param tgtState - The output state of the transition
   * @param action - The action to execute when going through the transition
   * @param guard - The guard to fulfil to execute the transition
   */
  constructor(srcState, tgtState, action, guard) {
    super(srcState, tgtState, action, guard);
  }
  accept(event) {
    return event.currentTarget !== null && isDatePicker(event.currentTarget);
  }
  getAcceptedEvents() {
    return _DatePickedTransition.acceptedEvents;
  }
};
let DatePickedTransition = _DatePickedTransition;
__publicField$y(DatePickedTransition, "acceptedEvents", /* @__PURE__ */ new Set(["input"]));

class DatePickedFSM extends FSMImpl {
  constructor(logger, dataHandler) {
    super(logger, dataHandler);
    new DatePickedTransition(
      this.initState,
      this.addTerminalState("picked"),
      (evt) => {
        this.dataHandler?.initToPickedHandler(evt);
      }
    );
  }
}
class DatePicked extends InteractionBase {
  /**
   * Creates the interaction.
   * @param logger - The logger to use for this interaction
   * @param name - The name of the user interaction
   */
  constructor(logger, name) {
    const handler = {
      "initToPickedHandler": (event) => {
        this._data.copy(event);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(new DatePickedFSM(logger, handler), new WidgetDataImpl(), logger, name ?? DatePicked.name);
  }
  onNewNodeRegistered(node) {
    if (isDatePicker(node)) {
      this.registerActionHandlerInput(node);
    }
  }
  onNodeUnregistered(node) {
    if (isDatePicker(node)) {
      this.unregisterActionHandlerInput(node);
    }
  }
}

var __defProp$x = Object.defineProperty;
var __defNormalProp$x = (obj, key, value) => key in obj ? __defProp$x(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$x = (obj, key, value) => {
  __defNormalProp$x(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class DnDFSM extends FSMImpl {
  /**
   * Creates the FSM
   * @param cancellable - True: the FSM can be cancelled using the ESC key.
   * @param logger - The logger to use
   * @param dataHandler - The handler that will receive notifications from the FSM.
   */
  constructor(cancellable, logger, dataHandler) {
    super(logger, dataHandler);
    __publicField$x(this, "cancellable");
    __publicField$x(this, "buttonToCheck");
    this.cancellable = cancellable;
    const pressed = this.addStdState("pressed");
    const dragged = this.addStdState("dragged", true);
    const cancelled = this.addCancellingState("cancelled");
    new MouseTransition(
      this.initState,
      pressed,
      "mousedown",
      (evt) => {
        this.buttonToCheck = evt.button;
        this.dataHandler?.onPress(evt);
      }
    );
    new MouseTransition(pressed, cancelled, "mouseup", (evt) => evt.button === this.buttonToCheck);
    const move = new MouseTransition(
      pressed,
      dragged,
      "mousemove",
      (evt) => {
        this.dataHandler?.onDrag(evt);
      },
      (evt) => evt.button === this.buttonToCheck
    );
    new MouseTransition(dragged, dragged, "mousemove", move.action, move.guard);
    new MouseTransition(
      dragged,
      this.addTerminalState("released"),
      "mouseup",
      (event) => {
        this.dataHandler?.onRelease(event);
      },
      (event) => {
        const tgt = event.currentTarget;
        return event.button === this.buttonToCheck && (!(tgt instanceof Element) || !tgt.classList.contains("ioDwellSpring"));
      }
    );
    if (this.cancellable) {
      new EscapeKeyPressureTransition(pressed, cancelled);
      new EscapeKeyPressureTransition(dragged, cancelled);
      new MouseTransition(
        dragged,
        cancelled,
        "mouseup",
        (evt) => {
          const tgt = evt.currentTarget;
          return evt.button === this.buttonToCheck && tgt instanceof Element && tgt.classList.contains("ioDwellSpring");
        }
      );
    }
  }
  reinit() {
    super.reinit();
    this.buttonToCheck = void 0;
  }
}
class DnD extends InteractionBase {
  /**
   * Creates the interaction.
   * @param cancellable - True: the interaction can be cancelled
   * @param logger - The logger to use for this interaction
   * @param name - The name of the user interaction
   */
  constructor(cancellable, logger, name) {
    const handler = {
      "onPress": (evt) => {
        this._data.copySrc(evt);
        this._data.copyTgt(evt);
      },
      "onDrag": (evt) => {
        this._data.copyTgt(evt);
      },
      "onRelease": (evt) => {
        this._data.copyTgt(evt);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(new DnDFSM(cancellable, logger, handler), new SrcTgtPointsDataImpl(), logger, name ?? DnD.name);
  }
}

var __defProp$w = Object.defineProperty;
var __defNormalProp$w = (obj, key, value) => key in obj ? __defProp$w(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$w = (obj, key, value) => {
  __defNormalProp$w(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const _HyperLinkTransition = class extends TransitionBase {
  /**
   * Creates the transition.
   * @param srcState - The source state of the transition
   * @param tgtState - The output state of the transition
   * @param action - The action to execute when going through the transition
   * @param guard - The guard to fulfil to execute the transition
   */
  constructor(srcState, tgtState, action, guard) {
    super(srcState, tgtState, action, guard);
  }
  accept(event) {
    return event.currentTarget !== null && isHyperLink(event.currentTarget);
  }
  getAcceptedEvents() {
    return _HyperLinkTransition.acceptedEvents;
  }
};
let HyperLinkTransition = _HyperLinkTransition;
__publicField$w(HyperLinkTransition, "acceptedEvents", /* @__PURE__ */ new Set(["click", "auxclick"]));

class HyperLinkClickedFSM extends FSMImpl {
  constructor(logger, dataHandler) {
    super(logger, dataHandler);
    new HyperLinkTransition(
      this.initState,
      this.addTerminalState("clicked"),
      (evt) => {
        this.dataHandler?.initToClickedHandler(evt);
      }
    );
  }
}
class HyperLinkClicked extends InteractionBase {
  /**
   * Creates the interaction.
   * @param logger - The logger to use for this interaction
   * @param name - The name of the user interaction
   */
  constructor(logger, name) {
    const handler = {
      "initToClickedHandler": (event) => {
        this._data.copy(event);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(new HyperLinkClickedFSM(logger, handler), new WidgetDataImpl(), logger, name ?? HyperLinkClicked.name);
  }
  onNewNodeRegistered(node) {
    if (isHyperLink(node)) {
      this.registerActionHandlerInput(node);
    }
  }
  onNodeUnregistered(node) {
    if (isHyperLink(node)) {
      this.unregisterActionHandlerInput(node);
    }
  }
}

var __defProp$v = Object.defineProperty;
var __defNormalProp$v = (obj, key, value) => key in obj ? __defProp$v(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$v = (obj, key, value) => {
  __defNormalProp$v(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class KeysDownFSM extends FSMImpl {
  /**
   * Creates the FSM.
   * @param logger - The logger to use for this interaction
   * @param dataHandler - The data handler the FSM will use
   */
  constructor(logger, dataHandler) {
    super(logger, dataHandler);
    __publicField$v(this, "currentCodes");
    this.currentCodes = [];
    const pressed = this.addStdState("pressed");
    const actionkp = (evt) => {
      this.currentCodes.push(evt.code);
      this.dataHandler?.onKeyPressed(evt);
    };
    new KeyTransition(this.initState, pressed, "keydown", actionkp);
    new KeyTransition(pressed, pressed, "keydown", actionkp);
    new KeyTransition(
      pressed,
      this.addTerminalState("ended"),
      "keyup",
      void 0,
      (evt) => this.currentCodes.includes(evt.code)
    );
  }
  reinit() {
    this.currentCodes.length = 0;
    super.reinit();
  }
}
class KeysDown extends InteractionBase {
  /**
   * Creates the user interaction.
   * @param logger - The logger to use for this interaction
   * @param name - The name of the user interaction
   */
  constructor(logger, name) {
    const handler = {
      "onKeyPressed": (event) => {
        this._data.addKey(event);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(new KeysDownFSM(logger, handler), new KeysDataImpl(), logger, name ?? KeysDown.name);
  }
}

var __defProp$u = Object.defineProperty;
var __defNormalProp$u = (obj, key, value) => key in obj ? __defProp$u(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$u = (obj, key, value) => {
  __defNormalProp$u(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class LongTouchFSM extends FSMImpl {
  /**
   * Creates the long touch FSM
   * @param duration - Defines the duration of the touch interaction.
   * @param logger - The logger to use for this interaction
   * @param dataHandler - The data handler the FSM will use
   */
  constructor(duration, logger, dataHandler) {
    super(logger, dataHandler);
    __publicField$u(this, "duration");
    __publicField$u(this, "currentTouchID");
    if (duration <= 0) {
      throw new Error("Incorrect duration");
    }
    this.duration = duration;
    this.currentTouchID = void 0;
    const touched = this.addStdState("touched");
    const cancelled = this.addCancellingState("cancelled");
    new TouchTransition(
      this.initState,
      touched,
      "touchstart",
      (event) => {
        if (event.changedTouches[0] !== void 0) {
          this.currentTouchID = event.changedTouches[0].identifier;
          this.dataHandler?.tap(event);
        }
      }
    );
    new TouchTransition(
      touched,
      cancelled,
      "touchmove",
      void 0,
      (ev) => ev.changedTouches[0] !== void 0 && ev.changedTouches[0].identifier === this.currentTouchID
    );
    new TouchTransition(
      touched,
      cancelled,
      "touchend",
      void 0,
      (ev) => ev.changedTouches[0] !== void 0 && ev.changedTouches[0].identifier === this.currentTouchID
    );
    new TimeoutTransition(touched, this.addTerminalState("timeouted"), () => this.duration);
  }
  reinit() {
    super.reinit();
    this.currentTouchID = void 0;
  }
}
class LongTouch extends InteractionBase {
  /**
   * Creates the long tap interaction
   * @param duration - The duration of the touch required to ends the user interaction
   * If this duration is not reached, the interaction is cancelled.
   * @param logger - The logger to use for this interaction
   * @param name - The name of the user interaction
   */
  constructor(duration, logger, name) {
    const handler = {
      "tap": (evt) => {
        if (evt.changedTouches[0] !== void 0) {
          this._data.copy(TouchDataImpl.mergeTouchEventData(evt.changedTouches[0], evt, Array.from(evt.touches)));
        }
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(new LongTouchFSM(duration, logger, handler), new TouchDataImpl(), logger, name ?? LongTouch.name);
  }
}

var __defProp$t = Object.defineProperty;
var __defNormalProp$t = (obj, key, value) => key in obj ? __defProp$t(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$t = (obj, key, value) => {
  __defNormalProp$t(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class MouseEnterFSM extends FSMImpl {
  /**
   * Creates the FSM
   * @param withBubbling - True: event bubbling will be done
   * @param logger - The logger to use for this interaction
   * @param dataHandler - The data handler the FSM will use
   */
  constructor(withBubbling, logger, dataHandler) {
    super(logger, dataHandler);
    /**
     * Indicates if event bubbling is enabled for the interaction
     */
    __publicField$t(this, "withBubbling");
    this.withBubbling = withBubbling;
    const entered = this.addTerminalState("entered");
    const action = (event) => {
      this.dataHandler?.onEnter(event);
    };
    if (this.withBubbling) {
      new MouseTransition(this.initState, entered, "mouseover", action);
    } else {
      new MouseTransition(this.initState, entered, "mouseenter", action);
    }
  }
}
class MouseEnter extends InteractionBase {
  /**
   * Creates the interaction.
   * @param withBubbling - True: the event bubbling will be done
   * @param logger - The logger to use for this interaction
   * @param name - The name of the user interaction
   */
  constructor(withBubbling, logger, name) {
    const handler = {
      "onEnter": (evt) => {
        this._data.copy(evt);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(new MouseEnterFSM(withBubbling, logger, handler), new PointDataImpl(), logger, name ?? MouseEnter.name);
  }
}

var __defProp$s = Object.defineProperty;
var __defNormalProp$s = (obj, key, value) => key in obj ? __defProp$s(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$s = (obj, key, value) => {
  __defNormalProp$s(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class MouseLeaveFSM extends FSMImpl {
  /**
   * Creates the FSM
   * @param withBubbling - True: event bubbling will be done
   * @param logger - The logger to use for this interaction
   * @param dataHandler - The data handler the FSM will use
   */
  constructor(withBubbling, logger, dataHandler) {
    super(logger, dataHandler);
    /**
     * Indicates if event bubbling is enabled for the interaction
     */
    __publicField$s(this, "withBubbling");
    this.withBubbling = withBubbling;
    const exited = new TerminalState(this, "exited");
    const action = (event) => {
      this.dataHandler?.onExit(event);
    };
    if (this.withBubbling) {
      new MouseTransition(this.initState, exited, "mouseout", action);
    } else {
      new MouseTransition(this.initState, exited, "mouseleave", action);
    }
  }
}
class MouseLeave extends InteractionBase {
  /**
   * Creates the interaction.
   * @param withBubbling - True: the event bullebing will be done
   * @param logger - The logger to use for this interaction
   * @param name - The name of the user interaction
   */
  constructor(withBubbling, logger, name) {
    const handler = {
      "onExit": (evt) => {
        this._data.copy(evt);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(new MouseLeaveFSM(withBubbling, logger, handler), new PointDataImpl(), logger, name ?? MouseLeave.name);
  }
}

class MouseMoveFSM extends FSMImpl {
  /**
   * Creates the FSM
   * @param logger - The logger to use for this interaction
   * @param dataHandler - The data handler the FSM will use
   */
  constructor(logger, dataHandler) {
    super(logger, dataHandler);
    new MouseTransition(
      this.initState,
      this.addTerminalState("moved"),
      "mousemove",
      (event) => {
        this.dataHandler?.onMove(event);
      }
    );
  }
}
class MouseMove extends InteractionBase {
  /**
   * Creates the interaction.
   * @param logger - The logger to use for this interaction
   * @param name - The name of the user interaction
   */
  constructor(logger, name) {
    const handler = {
      "onMove": (evt) => {
        this._data.copy(evt);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(new MouseMoveFSM(logger, handler), new PointDataImpl(), logger, name ?? MouseMove.name);
  }
}

var __defProp$r = Object.defineProperty;
var __defNormalProp$r = (obj, key, value) => key in obj ? __defProp$r(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$r = (obj, key, value) => {
  __defNormalProp$r(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const _ScrollTransition = class extends TransitionBase {
  /**
   * Creates the transition.
   * @param srcState - The source state of the transition
   * @param tgtState - The output state of the transition
   * @param action - The action to execute when going through the transition
   * @param guard - The guard to fulfil to execute the transition
   */
  constructor(srcState, tgtState, action, guard) {
    super(srcState, tgtState, action, guard);
  }
  accept(event) {
    return event.type === "scroll";
  }
  getAcceptedEvents() {
    return _ScrollTransition.acceptedEvents;
  }
};
let ScrollTransition = _ScrollTransition;
__publicField$r(ScrollTransition, "acceptedEvents", /* @__PURE__ */ new Set(["scroll"]));

var __defProp$q = Object.defineProperty;
var __defNormalProp$q = (obj, key, value) => key in obj ? __defProp$q(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$q = (obj, key, value) => {
  __defNormalProp$q(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class ScrollDataImpl extends InteractionDataBase {
  constructor() {
    super(...arguments);
    __publicField$q(this, "scrollXData", 0);
    __publicField$q(this, "scrollYData", 0);
  }
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

class ScrollFSM extends FSMImpl {
  constructor(logger, dataHandler) {
    super(logger, dataHandler);
    new ScrollTransition(
      this.initState,
      this.addTerminalState("scrolled"),
      (evt) => {
        this.dataHandler?.initToScroll(evt);
      }
    );
  }
}
class Scroll extends InteractionBase {
  /**
   * Creates the interaction.
   * @param logger - The logger to use for this interaction
   * @param name - The name of the user interaction
   */
  constructor(logger, name) {
    const handler = {
      "initToScroll": (event) => {
        this._data.setScrollData(event);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(new ScrollFSM(logger, handler), new ScrollDataImpl(), logger, name ?? Scroll.name);
  }
}

var __defProp$p = Object.defineProperty;
var __defNormalProp$p = (obj, key, value) => key in obj ? __defProp$p(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$p = (obj, key, value) => {
  __defNormalProp$p(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const _SpinnerChangedTransition = class extends TransitionBase {
  /**
   * Creates the transition.
   * @param srcState - The source state of the transition
   * @param tgtState - The output state of the transition
   * @param action - The action to execute when going through the transition
   * @param guard - The guard to fulfil to execute the transition
   */
  constructor(srcState, tgtState, action, guard) {
    super(srcState, tgtState, action, guard);
  }
  accept(event) {
    return event.currentTarget !== null && isSpinner(event.currentTarget);
  }
  getAcceptedEvents() {
    return _SpinnerChangedTransition.acceptedEvents;
  }
};
let SpinnerChangedTransition = _SpinnerChangedTransition;
__publicField$p(SpinnerChangedTransition, "acceptedEvents", /* @__PURE__ */ new Set(["input"]));

var __defProp$o = Object.defineProperty;
var __defNormalProp$o = (obj, key, value) => key in obj ? __defProp$o(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$o = (obj, key, value) => {
  __defNormalProp$o(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const _SpinnerChangedFSM = class extends FSMImpl {
  /**
   * @returns The time gap between the two spinner events.
   */
  static getTimeGap() {
    return _SpinnerChangedFSM.timeGap;
  }
  /**
   * Sets The time gap between the two spinner events.
   * @param timeGapBetweenClicks - The time gap between the two spinner events. Not done if negative.
   */
  static setTimeGap(timeGapBetweenClicks) {
    if (timeGapBetweenClicks > 0) {
      _SpinnerChangedFSM.timeGap = timeGapBetweenClicks;
    }
  }
  constructor(logger, dataHandler) {
    super(logger, dataHandler);
    const changed = this.addStdState("changed");
    const spinnerAction = (evt) => {
      this.dataHandler?.initToChangedHandler(evt);
    };
    new SpinnerChangedTransition(this.initState, changed, spinnerAction);
    new SpinnerChangedTransition(changed, changed, spinnerAction);
    new TimeoutTransition(changed, this.addTerminalState("ended"), _SpinnerChangedFSM.timeGapSupplier);
  }
};
let SpinnerChangedFSM = _SpinnerChangedFSM;
/** The time gap between the two spinner events. */
__publicField$o(SpinnerChangedFSM, "timeGap", 300);
/**
 * The supplier that provides the time gap.
 * @returns The time gap
 */
__publicField$o(SpinnerChangedFSM, "timeGapSupplier", () => _SpinnerChangedFSM.getTimeGap());
class SpinnerChanged extends InteractionBase {
  /**
   * Creates the interaction.
   * @param logger - The logger to use for this interaction
   * @param name - The name of the user interaction
   */
  constructor(logger, name) {
    const handler = {
      "initToChangedHandler": (event) => {
        this._data.copy(event);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(new SpinnerChangedFSM(logger, handler), new WidgetDataImpl(), logger, name ?? SpinnerChanged.name);
  }
  onNewNodeRegistered(node) {
    if (isSpinner(node)) {
      this.registerActionHandlerInput(node);
    }
  }
  onNodeUnregistered(node) {
    if (isSpinner(node)) {
      this.unregisterActionHandlerInput(node);
    }
  }
}

class TapDataImpl extends PointsDataImpl {
  /**
   * Creates the interaction data
   */
  constructor() {
    super();
  }
  get lastId() {
    return this.pointsData.at(-1)?.identifier;
  }
}

var __defProp$n = Object.defineProperty;
var __defNormalProp$n = (obj, key, value) => key in obj ? __defProp$n(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$n = (obj, key, value) => {
  __defNormalProp$n(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class TapFSM extends FSMImpl {
  /**
   * Creates the Tap FSM
   * @param nbTaps - The number of taps to support
   * @param logger - The logger to use for this interaction
   * @param dataHandler - The data handler the FSM will use
   */
  constructor(nbTaps, logger, dataHandler) {
    super(logger, dataHandler);
    __publicField$n(this, "countTaps");
    __publicField$n(this, "nbTaps");
    __publicField$n(this, "touchID");
    __publicField$n(this, "downState");
    __publicField$n(this, "cancelState");
    this.nbTaps = nbTaps;
    this.countTaps = 0;
    this.downState = this.addStdState("down");
    const up = this.addStdState("up");
    this.cancelState = this.addCancellingState("cancelled");
    const action = (event) => {
      this.touchID = event.changedTouches[0].identifier;
      this.countTaps++;
      this.dataHandler?.tap(event);
    };
    new TouchTransition(this.initState, this.downState, "touchstart", action);
    new TouchTransition(up, this.downState, "touchstart", action);
    new TouchTransition(
      this.downState,
      this.cancelState,
      "touchmove",
      void 0,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (evt) => evt.changedTouches[0].identifier === this.touchID
    );
    new TouchTransition(
      this.downState,
      this.cancelState,
      "touchstart",
      void 0,
      (evt) => Array.from(evt.touches).some((touch) => touch.identifier === this.touchID)
    );
    new TouchTransition(
      this.downState,
      this.downState,
      "touchstart",
      // Replacing the current tap (but not increment)
      (event) => {
        this.touchID = event.changedTouches[0].identifier;
        this.dataHandler?.tap(event);
      },
      // To detect the event is lost, checking it is not part of the touches any more
      (evt) => Array.from(evt.touches).filter((touch) => touch.identifier === this.touchID).length === 0
    );
    new TouchTransition(
      this.downState,
      this.addTerminalState("ended"),
      "touchend",
      void 0,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (evt) => evt.changedTouches[0].identifier === this.touchID && this.nbTaps === this.countTaps
    );
    new TouchTransition(
      this.downState,
      up,
      "touchend",
      void 0,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (evt) => evt.changedTouches[0].identifier === this.touchID && this.nbTaps !== this.countTaps
    );
    new TouchTransition(up, this.cancelState, "touchmove");
    new TimeoutTransition(up, this.cancelState, () => 1e3);
  }
  reinit() {
    super.reinit();
    this.countTaps = 0;
  }
}
class Tap extends InteractionBase {
  /**
   * Creates the tap interaction
   * @param numberTaps - The number of taps expected to end the interaction.
   * If this number is not reached after a timeout, the interaction is cancelled.
   * @param logger - The logger to use for this interaction
   * @param name - The name of the user interaction
   */
  constructor(numberTaps, logger, name) {
    const handler = {
      "tap": (evt) => {
        if (evt.changedTouches.length > 0) {
          const touch = new TouchDataImpl();
          touch.copy(TouchDataImpl.mergeTouchEventData(evt.changedTouches[0], evt, Array.from(evt.touches)));
          this._data.addPoint(touch);
        }
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(new TapFSM(numberTaps, logger, handler), new TapDataImpl(), logger, name ?? Tap.name);
  }
}

var __defProp$m = Object.defineProperty;
var __defNormalProp$m = (obj, key, value) => key in obj ? __defProp$m(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$m = (obj, key, value) => {
  __defNormalProp$m(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const _TextInputChangedTransition = class extends TransitionBase {
  /**
   * Creates the transition.
   * @param srcState - The source state of the transition
   * @param tgtState - The output state of the transition
   * @param action - The action to execute when going through the transition
   * @param guard - The guard to fulfil to execute the transition
   */
  constructor(srcState, tgtState, action, guard) {
    super(srcState, tgtState, action, guard);
  }
  accept(event) {
    return event.currentTarget !== null && isTextInput(event.currentTarget);
  }
  getAcceptedEvents() {
    return _TextInputChangedTransition.acceptedEvents;
  }
};
let TextInputChangedTransition = _TextInputChangedTransition;
__publicField$m(TextInputChangedTransition, "acceptedEvents", /* @__PURE__ */ new Set(["input"]));

var __defProp$l = Object.defineProperty;
var __defNormalProp$l = (obj, key, value) => key in obj ? __defProp$l(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$l = (obj, key, value) => {
  __defNormalProp$l(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class TextInputChangedFSM extends FSMImpl {
  constructor(logger, dataHandler, timeSet) {
    super(logger, dataHandler);
    /** The time gap between the two spinner events. */
    __publicField$l(this, "_timeGap", 1e3);
    /**
     * The supplier that provides the time gap.
     * @returns The time gap
     */
    __publicField$l(this, "timeGapSupplier", () => this.getTimeGap());
    if (timeSet !== void 0) {
      this._timeGap = timeSet;
    }
    const changed = this.addStdState("changed");
    new TextInputChangedTransition(
      this.initState,
      changed,
      (evt) => {
        this.dataHandler?.initToChangedHandler(evt);
      }
    );
    new TextInputChangedTransition(
      changed,
      changed,
      (evt) => {
        this.dataHandler?.initToChangedHandler(evt);
      }
    );
    new TimeoutTransition(changed, this.addTerminalState("ended"), this.timeGapSupplier);
  }
  /**
   * @returns The time gap between the two spinner events.
   */
  getTimeGap() {
    return this._timeGap;
  }
}
class TextInputChanged extends InteractionBase {
  constructor(logger, timeGap, name) {
    const handler = {
      "initToChangedHandler": (event) => {
        this._data.copy(event);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(
      new TextInputChangedFSM(logger, handler, timeGap),
      new WidgetDataImpl(),
      logger,
      name ?? TextInputChanged.name
    );
  }
  onNewNodeRegistered(node) {
    if (isTextInput(node)) {
      this.registerActionHandlerInput(node);
    }
  }
  onNodeUnregistered(node) {
    if (isTextInput(node)) {
      this.unregisterActionHandlerInput(node);
    }
  }
}

class TouchStartFSM extends FSMImpl {
  constructor(logger, dataHandler) {
    super(logger, dataHandler);
    new TouchTransition(
      this.initState,
      this.addTerminalState("touched"),
      "touchstart",
      (event) => {
        this.dataHandler?.initToTouch(event);
      }
    );
  }
}
class TouchStart extends InteractionBase {
  /**
   * Creates the interaction.
   * @param logger - The logger to use for this interaction
   * @param name - The name of the user interaction
   */
  constructor(logger, name) {
    const handler = {
      "initToTouch": (evt) => {
        this._data.copy(TouchDataImpl.mergeTouchEventData(evt.changedTouches[0], evt, Array.from(evt.touches)));
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(new TouchStartFSM(logger, handler), new TouchDataImpl(), logger, name ?? TouchStart.name);
  }
}

function rotate(logger, pxTolerance) {
  return new InteractionBuilderImpl((name) => new XTouchDnD(
    2,
    logger,
    new RotationTouchDataImpl(),
    name,
    void 0,
    true
  )).then((data) => data.touch1.diffClientX < pxTolerance && data.touch1.diffClientY < pxTolerance).name(rotate.name).build();
}
function scale(logger, pxTolerance) {
  return new InteractionBuilderImpl((name) => new XTouchDnD(
    2,
    logger,
    new ScaleTouchDataImpl(),
    name,
    void 0,
    true
  )).then((data) => data.scalingRatio(pxTolerance) !== 0).name(scale.name).build();
}

var __defProp$k = Object.defineProperty;
var __defNormalProp$k = (obj, key, value) => key in obj ? __defProp$k(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$k = (obj, key, value) => {
  __defNormalProp$k(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const _WheelTransition = class extends TransitionBase {
  /**
   * Creates the transition.
   * @param srcState - The source state of the transition
   * @param tgtState - The output state of the transition
   * @param action - The action to execute when going through the transition
   * @param guard - The guard to fulfil to execute the transition
   */
  constructor(srcState, tgtState, action, guard) {
    super(srcState, tgtState, action, guard);
  }
  accept(event) {
    return event instanceof WheelEvent && this.getAcceptedEvents().has(event.type);
  }
  getAcceptedEvents() {
    return _WheelTransition.acceptedEvents;
  }
};
let WheelTransition = _WheelTransition;
__publicField$k(WheelTransition, "acceptedEvents", /* @__PURE__ */ new Set(["wheel"]));

var __defProp$j = Object.defineProperty;
var __defNormalProp$j = (obj, key, value) => key in obj ? __defProp$j(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$j = (obj, key, value) => {
  __defNormalProp$j(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class WheelDataImpl extends PointDataImpl {
  constructor() {
    super(...arguments);
    __publicField$j(this, "deltaModeData", 0);
    __publicField$j(this, "deltaXData", 0);
    __publicField$j(this, "deltaYData", 0);
    __publicField$j(this, "deltaZData", 0);
  }
  flush() {
    super.flush();
    this.deltaModeData = 0;
    this.deltaXData = 0;
    this.deltaYData = 0;
    this.deltaZData = 0;
  }
  copy(data) {
    super.copy(data);
    this.deltaXData = data.deltaX;
    this.deltaYData = data.deltaY;
    this.deltaZData = data.deltaZ;
    this.deltaModeData = data.deltaMode;
  }
  get deltaMode() {
    return this.deltaModeData;
  }
  get deltaX() {
    return this.deltaXData;
  }
  get deltaY() {
    return this.deltaYData;
  }
  get deltaZ() {
    return this.deltaZData;
  }
}

class WheelFSM extends FSMImpl {
  /**
   * Creates the FSM
   * @param logger - The logger to use for this interaction
   * @param dataHandler - The data handler the FSM will use
   */
  constructor(logger, dataHandler) {
    super(logger, dataHandler);
    new WheelTransition(
      this.initState,
      this.addTerminalState("moved"),
      (evt) => {
        this.dataHandler?.initToMoved(evt);
      }
    );
  }
}
class Wheel extends InteractionBase {
  /**
   * Creates the interaction.
   * @param logger - The logger to use for this interaction
   * @param fsm - The optional FSM provided for the interaction
   * @param data - The interaction data to use
   * @param name - The name of the user interaction
   */
  constructor(logger, fsm, data, name) {
    const handler = {
      "initToMoved": (evt) => {
        this._data.copy(evt);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(fsm ?? new WheelFSM(logger, handler), data ?? new WheelDataImpl(), logger, name ?? Wheel.name);
  }
}

var __defProp$i = Object.defineProperty;
var __defNormalProp$i = (obj, key, value) => key in obj ? __defProp$i(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$i = (obj, key, value) => {
  __defNormalProp$i(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class ConcurrentXOrFSM extends FSMImpl {
  /**
   * Creates the FSM
   * @param fsms - The main concurrent FSMs
   * @param logger - The logger to use for logging FSM messages
   * @param dataHandler - The data handler the FSM will use
   */
  constructor(fsms, logger, dataHandler) {
    if (new Set(fsms.map((fsm) => fsm.constructor.name)).size !== fsms.length) {
      throw new Error("Cannot create an XOR interaction using two interactions of the same type");
    }
    super(logger, dataHandler);
    /**
     * The main fsms
     */
    __publicField$i(this, "_conccurFSMs");
    const handler = {
      "fsmStarts": () => {
        this.onStarting();
      },
      "fsmUpdates": () => {
        this.onUpdating();
      },
      "fsmStops": () => {
        this.onTerminating();
      },
      "fsmCancels": () => {
        this.onCancelling();
      },
      "fsmError": (err) => {
        this.notifyHandlerOnError(err);
      }
    };
    this._conccurFSMs = Array.from(fsms);
    for (const fsm of this._conccurFSMs) {
      fsm.addHandler(handler);
    }
  }
  process(event) {
    const startedFSM = this._conccurFSMs.find((fsm) => fsm.started);
    if (startedFSM === void 0) {
      return this._conccurFSMs.some((conccurFSM) => conccurFSM.process(event));
    }
    return startedFSM.process(event);
  }
  getAllConccurFSMs() {
    return Array.from(this._conccurFSMs);
  }
  get started() {
    return this._conccurFSMs.some((fsm) => fsm.started);
  }
  // eslint-disable-next-line accessor-pairs
  set log(log) {
    super.log = log;
    for (const fsm of this._conccurFSMs) {
      fsm.log = log;
    }
  }
  uninstall() {
    super.uninstall();
    for (const fsm of this._conccurFSMs) {
      fsm.uninstall();
    }
  }
  fullReinit() {
    for (const fsm of this._conccurFSMs) {
      fsm.fullReinit();
    }
    super.fullReinit();
  }
  reinit() {
    for (const fsm of this._conccurFSMs) {
      fsm.reinit();
    }
    super.reinit();
  }
  acceptVisitor(visitor) {
    visitor.visitXOrConcurrentFSM(this);
  }
}

var __defProp$h = Object.defineProperty;
var __defNormalProp$h = (obj, key, value) => key in obj ? __defProp$h(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$h = (obj, key, value) => {
  __defNormalProp$h(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Or extends ConcurrentInteraction {
  constructor(i1, i2, logger) {
    const handler = {
      "reinitData": () => {
      }
    };
    super(new ConcurrentXOrFSM([i1.fsm, i2.fsm], logger, handler), {
      "flush": () => {
      }
    }, logger, `${i1.name}-${i2.name}`);
    __publicField$h(this, "i1");
    __publicField$h(this, "i2");
    this.i1 = i1;
    this.i2 = i2;
  }
  get data() {
    return this.i1.fsm.started ? this.i1.data : this.i2.data;
  }
  uninstall() {
    this.i1.uninstall();
    this.i2.uninstall();
  }
  reinit() {
    this.i1.reinit();
    this.i2.reinit();
    super.reinit();
  }
  fullReinit() {
    this.i1.fullReinit();
    this.i2.fullReinit();
    super.fullReinit();
  }
  reinitData() {
    this.i1.reinitData();
    this.i2.reinitData();
    super.reinitData();
  }
}

var __defProp$g = Object.defineProperty;
var __defNormalProp$g = (obj, key, value) => key in obj ? __defProp$g(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$g = (obj, key, value) => {
  __defNormalProp$g(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class ThenDataImpl {
  constructor(dx) {
    __publicField$g(this, "dx");
    this.dx = dx;
  }
  flush() {
    for (const data of this.dx) {
      data.flush();
    }
  }
}

class ThenFSM extends FSMImpl {
  constructor(fsms, logger) {
    super(logger);
    let currentState = this.initState;
    const last = fsms.length - 1;
    for (const [i, fsm] of fsms.entries()) {
      if (i === last) {
        new SubFSMTransition(currentState, new TerminalState(this, i.toString()), fsm);
      } else {
        const state = new StdState(this, i.toString());
        new SubFSMTransition(currentState, state, fsm);
        currentState = state;
      }
    }
  }
}

var __defProp$f = Object.defineProperty;
var __defNormalProp$f = (obj, key, value) => key in obj ? __defProp$f(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$f = (obj, key, value) => {
  __defNormalProp$f(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Then extends InteractionBase {
  constructor(ix, logger) {
    super(
      new ThenFSM(ix.map((inter) => inter.fsm), logger),
      new ThenDataImpl(ix.map((inter) => inter.data)),
      logger,
      ""
    );
    __publicField$f(this, "ix");
    this.ix = ix;
  }
  uninstall() {
    super.uninstall();
    for (const inter of this.ix) {
      inter.uninstall();
    }
  }
  reinit() {
    super.reinit();
    for (const inter of this.ix) {
      inter.reinit();
    }
  }
  fullReinit() {
    super.fullReinit();
    for (const inter of this.ix) {
      inter.fullReinit();
    }
  }
  reinitData() {
    super.reinitData();
    for (const inter of this.ix) {
      inter.reinitData();
    }
  }
}

var __defProp$e = Object.defineProperty;
var __defNormalProp$e = (obj, key, value) => key in obj ? __defProp$e(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$e = (obj, key, value) => {
  __defNormalProp$e(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class LoggingData {
  constructor(date, msg, level, name, type, sessionID, stack, frontVersion) {
    __publicField$e(this, "name");
    __publicField$e(this, "sessionID");
    __publicField$e(this, "date");
    __publicField$e(this, "msg");
    __publicField$e(this, "level");
    __publicField$e(this, "type");
    __publicField$e(this, "stack");
    __publicField$e(this, "frontVersion");
    this.frontVersion = frontVersion;
    this.stack = stack;
    this.sessionID = sessionID;
    this.type = type;
    this.name = name;
    this.level = level;
    this.msg = msg;
    this.date = date;
  }
  toString() {
    const withstack = this.stack === void 0 ? "" : `, ${this.stack}`;
    const withversion = this.frontVersion === void 0 ? "" : ` ${this.frontVersion}`;
    return `${this.type}${withversion} [${this.sessionID}] [${this.level}:${this.name}] at ${this.date}: '${this.msg}'${withstack}`;
  }
}
class UsageLog {
  constructor(name, sessionID, date, frontVersion) {
    __publicField$e(this, "name");
    __publicField$e(this, "sessionID");
    __publicField$e(this, "date");
    __publicField$e(this, "duration");
    __publicField$e(this, "cancelled");
    __publicField$e(this, "frontVersion");
    this.frontVersion = frontVersion;
    this.date = date;
    this.sessionID = sessionID;
    this.name = name;
    this.duration = 0;
    this.cancelled = false;
  }
  toString() {
    const withversion = this.frontVersion === void 0 ? "" : ` v:${this.frontVersion}`;
    return `Usage.${withversion} id:${this.sessionID} binding:${this.name} date:${this.date} duration:${this.duration} cancelled:${String(this.cancelled)}`;
  }
}
class LoggerImpl {
  constructor(version) {
    __publicField$e(this, "writeConsole");
    __publicField$e(this, "serverAddress");
    __publicField$e(this, "sessionID");
    __publicField$e(this, "frontVersion");
    __publicField$e(this, "ongoingBindings");
    this.frontVersion = version;
    this.ongoingBindings = [];
    this.serverAddress = void 0;
    this.writeConsole = true;
    this.sessionID = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }
  processLoggingData(data) {
    if (this.writeConsole) {
      console.log(data.toString());
    }
    if (this.serverAddress !== void 0 && data.type === "ERR") {
      const rq = new XMLHttpRequest();
      rq.open("POST", `${this.serverAddress}/api/err`, true);
      rq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      rq.send(JSON.stringify(data));
    }
  }
  formatError(ex) {
    if (ex instanceof Error) {
      return `${ex.message} ${ex.stack ?? ""}`;
    }
    return String(ex);
  }
  logBindingErr(msg, ex, bindingName = "") {
    this.processLoggingData(new LoggingData(
      performance.now(),
      msg,
      "binding",
      bindingName,
      "ERR",
      this.sessionID,
      this.formatError(ex),
      this.frontVersion
    ));
  }
  logBindingMsg(msg, bindingName = "") {
    this.processLoggingData(new LoggingData(
      performance.now(),
      msg,
      "binding",
      bindingName,
      "INFO",
      this.sessionID,
      void 0,
      this.frontVersion
    ));
  }
  logCmdErr(msg, ex, cmdName = "") {
    this.processLoggingData(new LoggingData(
      performance.now(),
      msg,
      "command",
      cmdName,
      "ERR",
      this.sessionID,
      this.formatError(ex),
      this.frontVersion
    ));
  }
  logCmdMsg(msg, cmdName = "") {
    this.processLoggingData(new LoggingData(
      performance.now(),
      msg,
      "command",
      cmdName,
      "INFO",
      this.sessionID,
      void 0,
      this.frontVersion
    ));
  }
  logInteractionErr(msg, ex, interactionName = "") {
    this.processLoggingData(new LoggingData(
      performance.now(),
      msg,
      "interaction",
      interactionName,
      "ERR",
      this.sessionID,
      this.formatError(ex),
      this.frontVersion
    ));
  }
  logInteractionMsg(msg, interactionName = "") {
    this.processLoggingData(new LoggingData(
      performance.now(),
      msg,
      "interaction",
      interactionName,
      "INFO",
      this.sessionID,
      void 0,
      this.frontVersion
    ));
  }
  logBindingStart(bindingName) {
    this.ongoingBindings.push(new UsageLog(bindingName, this.sessionID, performance.now(), this.frontVersion));
  }
  logBindingEnd(bindingName, cancelled) {
    const logs = this.ongoingBindings.filter((bind) => bindingName.includes(bind.name));
    this.ongoingBindings = this.ongoingBindings.filter((bind) => !logs.includes(bind));
    if (logs.length === 1) {
      const log = logs[0];
      log.name = bindingName;
      log.duration = performance.now() - log.date;
      log.cancelled = cancelled;
      if (this.writeConsole) {
        console.log(log.toString());
      }
      if (this.serverAddress !== void 0) {
        const rq = new XMLHttpRequest();
        rq.open("POST", `${this.serverAddress}/api/usage`, true);
        rq.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        rq.send(JSON.stringify(log));
      }
    }
  }
}

var __defProp$d = Object.defineProperty;
var __defNormalProp$d = (obj, key, value) => key in obj ? __defProp$d(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$d = (obj, key, value) => {
  __defNormalProp$d(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class BindingsImpl extends Bindings {
  constructor(history, logger) {
    super();
    __publicField$d(this, "observer");
    __publicField$d(this, "undoHistoryData");
    __publicField$d(this, "logger");
    this.undoHistoryData = history;
    this.logger = logger ?? new LoggerImpl();
  }
  setLinterRules(...rules) {
    this.observer?.checker.setLinterRules(...rules);
  }
  get undoHistory() {
    return this.undoHistoryData;
  }
  nodeBinder(accInit) {
    return new UpdateBinder(
      this.undoHistory,
      this.logger,
      this.observer,
      void 0,
      accInit
    );
  }
  buttonBinder(accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new ButtonPressed(this.logger));
  }
  checkboxBinder(accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new BoxChecked(this.logger));
  }
  colorPickerBinder(accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new ColorPicked(this.logger));
  }
  comboBoxBinder(accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new ComboBoxSelected(this.logger));
  }
  spinnerBinder(accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new SpinnerChanged(this.logger));
  }
  dateBinder(accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new DatePicked(this.logger));
  }
  hyperlinkBinder(accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new HyperLinkClicked(this.logger));
  }
  textInputBinder(timeout, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new TextInputChanged(this.logger, timeout));
  }
  touchDnDBinder(cancellable, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new TouchDnD(this.logger, cancellable));
  }
  touchStartBinder(accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new TouchStart(this.logger));
  }
  reciprocalTouchDnDBinder(handle, spring, accInit) {
    const anim = new DwellSpringAnimation(handle, spring);
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new TouchDnD(this.logger, true)).on(handle).then((_c, i) => {
      anim.process(i);
    }).endOrCancel(() => {
      anim.end();
    });
  }
  reciprocalMouseOrTouchDnD(handle, spring, accInit) {
    const anim = new DwellSpringAnimation(handle, spring);
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new Or(
      new TouchDnD(this.logger, true),
      new DnD(true, this.logger),
      this.logger
    )).on(handle).then((_c, i) => {
      anim.process(i);
    }).endOrCancel(() => {
      anim.end();
    });
  }
  multiTouchBinder(nbTouches, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new MultiTouch(nbTouches, false, this.logger));
  }
  twoTouchBinder(accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(twoTouch(this.logger));
  }
  threeTouchBinder(accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new ThreeTouchDnD(this.logger));
  }
  fourTouchBinder(accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new FourTouchDnD(this.logger));
  }
  tapBinder(nbTap, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new Tap(nbTap, this.logger));
  }
  longTouchBinder(duration, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new LongTouch(duration, this.logger));
  }
  panBinder(cancellable, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new TouchDnD(this.logger, cancellable));
  }
  panVerticalBinder(pxTolerance, cancellable, minLength, minVelocity, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(vPan(this.logger, cancellable, pxTolerance, minLength, minVelocity));
  }
  panHorizontalBinder(pxTolerance, cancellable, minLength, minVelocity, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(hPan(this.logger, cancellable, pxTolerance, minLength, minVelocity));
  }
  panLeftBinder(pxTolerance, cancellable, minLength, minVelocity, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(leftPan(this.logger, cancellable, pxTolerance, minLength, minVelocity));
  }
  panRightBinder(pxTolerance, cancellable, minLength, minVelocity, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(rightPan(this.logger, cancellable, pxTolerance, minLength, minVelocity));
  }
  panTopBinder(pxTolerance, cancellable, minLength, minVelocity, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(topPan(this.logger, cancellable, pxTolerance, minLength, minVelocity));
  }
  panBottomBinder(pxTolerance, cancellable, minLength, minVelocity, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(bottomPan(this.logger, cancellable, pxTolerance, minLength, minVelocity));
  }
  twoPanVerticalBinder(pxTolerance, minLength, minVelocity, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(twoVPan(this.logger, pxTolerance, minLength, minVelocity));
  }
  twoPanHorizontalBinder(pxTolerance, minLength, minVelocity, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(twoHPan(this.logger, pxTolerance, minLength, minVelocity));
  }
  twoPanLeftBinder(pxTolerance, minLength, minVelocity, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(twoLeftPan(this.logger, pxTolerance, minLength, minVelocity));
  }
  twoPanRightBinder(pxTolerance, minLength, minVelocity, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(twoRightPan(this.logger, pxTolerance, minLength, minVelocity));
  }
  twoPanTopBinder(pxTolerance, minLength, minVelocity, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(twoTopPan(this.logger, pxTolerance, minLength, minVelocity));
  }
  twoPanBottomBinder(pxTolerance, minLength, minVelocity, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(twoBottomPan(this.logger, pxTolerance, minLength, minVelocity));
  }
  rotateBinder(pxTolerance, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(rotate(this.logger, pxTolerance));
  }
  scaleBinder(pxTolerance, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(scale(this.logger, pxTolerance));
  }
  clickBinder(accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new Click(this.logger));
  }
  dbleClickBinder(accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new DoubleClick(this.logger));
  }
  mouseUpBinder(accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new MouseUp(this.logger));
  }
  mouseDownBinder(accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new MouseDown(this.logger));
  }
  longMouseDownBinder(duration, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new LongMouseDown(duration, this.logger));
  }
  clicksBinder(nbClicks, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new Clicks(nbClicks, this.logger));
  }
  mouseLeaveBinder(withBubbling, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new MouseLeave(withBubbling, this.logger));
  }
  mouseEnterBinder(withBubbling, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new MouseEnter(withBubbling, this.logger));
  }
  mouseMoveBinder(accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new MouseMove(this.logger));
  }
  wheelBinder(accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new Wheel(this.logger));
  }
  scrollBinder(accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new Scroll(this.logger));
  }
  dndBinder(cancellable, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new DnD(cancellable, this.logger));
  }
  reciprocalDndBinder(handle, spring, accInit) {
    const anim = new DwellSpringAnimation(handle, spring);
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new DnD(true, this.logger)).on(handle).then((_c, i) => {
      anim.process(i);
    }).endOrCancel(() => {
      anim.end();
    });
  }
  dragLockBinder(accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new DragLock(this.logger));
  }
  keyUpBinder(modifierAccepted, accInit) {
    return new KeysBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new KeyUp(this.logger, modifierAccepted));
  }
  keyDownBinder(modifierAccepted, accInit) {
    return new KeysBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new KeyDown(this.logger, modifierAccepted));
  }
  keysDownBinder(accInit) {
    return new KeysBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new KeysDown(this.logger));
  }
  keysTypeBinder(accInit) {
    return new KeysBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new KeysTyped(this.logger));
  }
  keyTypeBinder(accInit) {
    return new KeysBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new KeyTyped(this.logger));
  }
  mouseDownOrTouchStartBinder(accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new Or(new MouseDown(this.logger), new TouchStart(this.logger), this.logger));
  }
  tapsOrClicksBinder(nbTap, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new Or(new Tap(nbTap, this.logger), new Clicks(nbTap, this.logger), this.logger));
  }
  longpressOrTouchBinder(duration, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(
      () => new Or(new LongMouseDown(duration, this.logger), new LongTouch(duration, this.logger), this.logger)
    );
  }
  combine(interactions, accInit) {
    return new UpdateBinder(this.undoHistory, this.logger, this.observer, void 0, accInit).usingInteraction(() => new Then(interactions, this.logger));
  }
  undoRedoBinder(undo, redo, catchFn = () => {
  }) {
    return [
      this.buttonBinder().on(undo).toProduce(() => new Undo(this.undoHistory)).catch(catchFn).bind(),
      this.buttonBinder().on(redo).toProduce(() => new Redo(this.undoHistory)).catch(catchFn).bind()
    ];
  }
  clear() {
    this.observer?.clearObservedBindings();
    this.undoHistory.clear();
  }
  setBindingObserver(obs) {
    this.observer?.clearObservedBindings();
    this.observer = obs;
  }
  acceptVisitor(visitor) {
    visitor.visitBindings(this);
  }
}

class UndoableCommand extends CommandBase {
  getUndoName() {
    return this.constructor.name;
  }
  getVisualSnapshot() {
    return void 0;
  }
}

var __defProp$c = Object.defineProperty;
var __defNormalProp$c = (obj, key, value) => key in obj ? __defProp$c(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$c = (obj, key, value) => {
  __defNormalProp$c(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class FocusHTMLElement extends CommandBase {
  constructor(elt) {
    super();
    __publicField$c(this, "element");
    this.element = elt;
  }
  execution() {
    this.element.focus();
  }
  canExecute() {
    return this.element instanceof HTMLElement;
  }
}

var __defProp$b = Object.defineProperty;
var __defNormalProp$b = (obj, key, value) => key in obj ? __defProp$b(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$b = (obj, key, value) => {
  __defNormalProp$b(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class RedoNTimes extends CommandBase {
  constructor(undoHistory, numberOfRedos) {
    super();
    __publicField$b(this, "history");
    __publicField$b(this, "numberOfRedos");
    this.history = undoHistory;
    this.numberOfRedos = numberOfRedos;
  }
  canExecute() {
    return this.history.getRedo().length >= this.numberOfRedos;
  }
  execution() {
    for (let i = 0; i < this.numberOfRedos; i++) {
      this.history.redo();
    }
  }
}

var __defProp$a = Object.defineProperty;
var __defNormalProp$a = (obj, key, value) => key in obj ? __defProp$a(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$a = (obj, key, value) => {
  __defNormalProp$a(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class SetProperty extends UndoableCommand {
  constructor(obj, prop, newvalue) {
    super();
    __publicField$a(this, "obj");
    __publicField$a(this, "prop");
    __publicField$a(this, "newvalue");
    __publicField$a(this, "mementoValue");
    this.obj = obj;
    this.prop = prop;
    this.newvalue = newvalue;
    this.mementoValue = void 0;
  }
  createMemento() {
    this.mementoValue = this.obj[this.prop];
  }
  execution() {
    this.obj[this.prop] = this.newvalue;
  }
  redo() {
    this.execution();
  }
  undo() {
    this.obj[this.prop] = this.mementoValue;
  }
  getUndoName() {
    return `Set '${String(this.prop)}' value: ${String(this.newvalue)}`;
  }
}

var __defProp$9 = Object.defineProperty;
var __defNormalProp$9 = (obj, key, value) => key in obj ? __defProp$9(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$9 = (obj, key, value) => {
  __defNormalProp$9(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class SetProperties extends UndoableCommand {
  constructor(obj, newvalues) {
    super();
    __publicField$9(this, "obj");
    __publicField$9(this, "_newvalues");
    __publicField$9(this, "compositeCmds");
    this.obj = obj;
    this.compositeCmds = [];
    this._newvalues = newvalues;
    this.newvalues = newvalues;
  }
  get newvalues() {
    return this._newvalues;
  }
  set newvalues(value) {
    this._newvalues = value;
    for (const key in value) {
      this.compositeCmds.push(new SetProperty(this.obj, key, value[key]));
    }
  }
  execute() {
    for (const cmd of this.compositeCmds) {
      void cmd.execute();
    }
    return super.execute();
  }
  execution() {
  }
  redo() {
    for (const cmd of this.compositeCmds) {
      cmd.redo();
    }
  }
  undo() {
    for (const cmd of this.compositeCmds) {
      cmd.undo();
    }
  }
}

var __defProp$8 = Object.defineProperty;
var __defNormalProp$8 = (obj, key, value) => key in obj ? __defProp$8(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$8 = (obj, key, value) => {
  __defNormalProp$8(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class TransferArrayItem extends UndoableCommand {
  /**
   * Creates the command.
   * @param srcArray - The array to take the transferred element from.
   * @param tgtArray - The array to put the transferred element in.
   * @param srcIndex - The index at which the element is located in the source array.
   * @param tgtIndex - The index at which the element must be put in the destination array.
   * @param cmdName - The name of the command.
   */
  constructor(srcArray, tgtArray, srcIndex, tgtIndex, cmdName) {
    super();
    /**
     * The array to take the transferred element from.
     */
    __publicField$8(this, "_srcArray");
    /**
     * The array to put the transferred element in.
     */
    __publicField$8(this, "_tgtArray");
    /**
     * The index at which the element is located in the source array.
     */
    __publicField$8(this, "_srcIndex");
    /**
     * The index at which the element must be put in the target array.
     */
    __publicField$8(this, "_tgtIndex");
    /**
     * The name of the command.
     */
    __publicField$8(this, "cmdName");
    this._srcArray = srcArray;
    this._tgtArray = tgtArray;
    this._srcIndex = srcIndex;
    this._tgtIndex = tgtIndex;
    this.cmdName = cmdName;
  }
  execution() {
    this.redo();
  }
  canExecute() {
    return this._srcIndex >= 0 && this._srcIndex < this._srcArray.length && (this._tgtIndex >= 0 && this._tgtIndex <= this._tgtArray.length);
  }
  getUndoName() {
    return this.cmdName;
  }
  redo() {
    const elt = this._srcArray[this._srcIndex];
    if (elt !== void 0) {
      this._srcArray.splice(this._srcIndex, 1);
      this._tgtArray.splice(this._tgtIndex, 0, elt);
    }
  }
  undo() {
    const elt = this._tgtArray[this._tgtIndex];
    if (elt !== void 0) {
      this._tgtArray.splice(this._tgtIndex, 1);
      this._srcArray.splice(this._srcIndex, 0, elt);
    }
  }
  get srcArray() {
    return this._srcArray;
  }
  set srcArray(value) {
    this._srcArray = value;
  }
  get tgtArray() {
    return this._tgtArray;
  }
  set tgtArray(value) {
    this._tgtArray = value;
  }
  get srcIndex() {
    return this._srcIndex;
  }
  set srcIndex(value) {
    this._srcIndex = value;
  }
  get tgtIndex() {
    return this._tgtIndex;
  }
  set tgtIndex(value) {
    this._tgtIndex = value;
  }
}

var __defProp$7 = Object.defineProperty;
var __defNormalProp$7 = (obj, key, value) => key in obj ? __defProp$7(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$7 = (obj, key, value) => {
  __defNormalProp$7(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class UndoNTimes extends CommandBase {
  constructor(undoHistory, numberOfUndos) {
    super();
    __publicField$7(this, "history");
    __publicField$7(this, "numberOfUndos");
    this.history = undoHistory;
    this.numberOfUndos = numberOfUndos;
  }
  canExecute() {
    return this.history.getUndo().length >= this.numberOfUndos;
  }
  execution() {
    for (let i = 0; i < this.numberOfUndos; i++) {
      this.history.undo();
    }
  }
}

var __defProp$6 = Object.defineProperty;
var __defNormalProp$6 = (obj, key, value) => key in obj ? __defProp$6(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$6 = (obj, key, value) => {
  __defNormalProp$6(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class NotFSM extends ConcurrentAndFSM {
  constructor(mainFSM, negFSM, logger) {
    super([mainFSM], logger, [negFSM]);
    __publicField$6(this, "mainFSM");
    this.mainFSM = mainFSM;
    negFSM.addHandler({
      "fsmStops": () => {
        this.mainFSM.onCancelling();
        throw new CancelFSMError();
      }
    });
  }
}

var __defProp$5 = Object.defineProperty;
var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$5 = (obj, key, value) => {
  __defNormalProp$5(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class VisitorFSMDepthFirst {
  constructor() {
    __publicField$5(this, "visited");
    this.visited = /* @__PURE__ */ new Set();
  }
  visitAndConcurrentFSM(fsm) {
    for (const concFSM of fsm.getAllConccurFSMs()) {
      concFSM.acceptVisitor(this);
    }
  }
  visitXOrConcurrentFSM(fsm) {
    for (const concFSM of fsm.getAllConccurFSMs()) {
      concFSM.acceptVisitor(this);
    }
  }
  visitInitState(state) {
    if (this.alreadyVisited(state)) {
      return;
    }
    for (const tr of state.transitions) {
      tr.acceptVisitor(this);
    }
  }
  visitState(state) {
    if (this.alreadyVisited(state)) {
      return;
    }
    for (const tr of state.transitions) {
      tr.acceptVisitor(this);
    }
  }
  visitCancellingState(_state) {
  }
  visitTerminalState(_state) {
  }
  visitFSM(fsm) {
    fsm.initState.acceptVisitor(this);
  }
  visitTransition(transition) {
    transition.target.acceptVisitor(this);
  }
  visitTimeoutTransition(transition) {
    transition.target.acceptVisitor(this);
  }
  clear() {
    this.visited.clear();
  }
  alreadyVisited(state) {
    const already = this.visited.has(state);
    if (!already) {
      this.visited.add(state);
    }
    return already;
  }
}

var __defProp$4 = Object.defineProperty;
var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$4 = (obj, key, value) => {
  __defNormalProp$4(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class Not extends ConcurrentInteraction {
  constructor(i1, not, logger, name) {
    super(new NotFSM(i1.fsm, not.fsm, logger), i1.data, logger, name);
    __publicField$4(this, "mainInteraction");
    __publicField$4(this, "negInteraction");
    this.mainInteraction = i1;
    this.negInteraction = not;
  }
  uninstall() {
    this.mainInteraction.uninstall();
    this.negInteraction.uninstall();
    super.uninstall();
  }
  reinit() {
    this.mainInteraction.reinit();
    this.negInteraction.reinit();
    super.reinit();
  }
  fullReinit() {
    this.mainInteraction.fullReinit();
    this.negInteraction.fullReinit();
    super.fullReinit();
  }
  reinitData() {
    this.mainInteraction.reinitData();
    this.negInteraction.reinitData();
    super.reinitData();
  }
}

var __defProp$3 = Object.defineProperty;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$3 = (obj, key, value) => {
  __defNormalProp$3(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class TimedClickFSM extends FSMImpl {
  /**
   * Creates the FSM
   * @param duration - The max duration of the click
   * @param logger - The logger to use for this interaction
   * @param button - The button to be used
   * @param dataHandler - The data handler the FSM will use
   */
  constructor(duration, logger, button, dataHandler) {
    super(logger, dataHandler);
    __publicField$3(this, "currentButton");
    __publicField$3(this, "buttonToConsider");
    if (duration <= 0) {
      throw new Error("Incorrect duration");
    }
    this.buttonToConsider = button;
    const pressed = this.addStdState("pressed");
    const cancelled = this.addCancellingState("cancelled");
    new MouseTransition(
      this.initState,
      pressed,
      "mousedown",
      (evt) => {
        this.setButtonToCheck(evt.button);
        this.dataHandler?.initToClicked(evt);
      },
      (evt) => this.buttonToConsider === void 0 || evt.button === this.buttonToConsider
    );
    new MouseTransition(
      pressed,
      this.addTerminalState("clicked", true),
      "mouseup",
      (evt) => {
        this.dataHandler?.initToClicked(evt);
      },
      (evt) => this.currentButton === void 0 || evt.button === this.currentButton
    );
    new MouseTransition(pressed, cancelled, "mousemove");
    new TimeoutTransition(pressed, cancelled, () => duration);
  }
  setButtonToCheck(evtButton) {
    this.currentButton = this.buttonToConsider ?? evtButton;
  }
  reinit() {
    super.reinit();
    this.currentButton = void 0;
  }
}
class TimedClick extends InteractionBase {
  /**
   * Creates the interaction.
   * @param duration - The duration of the touch required to ends the user interaction
   * If this duration is not reached, the interaction is cancelled.
   * @param logger - The logger to use for this interaction
   * @param button - The mouse button to use
   * @param fsm - The optional FSM provided for the interaction
   * @param data - The interaction data to use
   * @param name - The name of the user interaction
   */
  constructor(duration, logger, button, fsm, data, name) {
    super(fsm ?? new TimedClickFSM(duration, logger, button), data ?? new PointDataImpl(), logger, name ?? TimedClick.name);
    this.fsm.dataHandler = {
      "initToClicked": (evt) => {
        this._data.copy(evt);
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
  }
}

class TimedTapFSM extends TapFSM {
  constructor(duration, nbTaps, logger, dataHandler) {
    super(nbTaps, logger, dataHandler);
    if (duration <= 0) {
      throw new Error("Incorrect duration");
    }
    new TimeoutTransition(this.downState, this.cancelState, () => duration);
  }
}
class TimedTap extends InteractionBase {
  /**
   * Creates the timed tap interaction
   * @param duration - The max duration before a timeout while touching.
   * @param numberTaps - The number of taps expected to end the interaction.
   * If this number is not reached after a timeout, the interaction is cancelled.
   * @param logger - The logger to use for this interaction
   * @param name - The name of the user interaction
   */
  constructor(duration, numberTaps, logger, name) {
    const handler = {
      "tap": (evt) => {
        if (evt.changedTouches.length > 0) {
          const touch = new TouchDataImpl();
          touch.copy(TouchDataImpl.mergeTouchEventData(evt.changedTouches[0], evt, Array.from(evt.touches)));
          this._data.addPoint(touch);
        }
      },
      "reinitData": () => {
        this.reinitData();
      }
    };
    super(new TimedTapFSM(duration, numberTaps, logger, handler), new TapDataImpl(), logger, name ?? TimedTap.name);
  }
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => {
  __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class FittsLawDataImpl {
  /**
   * Creates the data.
   * @param t - The time in ms. Be careful about fingerprinting protection:
   * https://developer.mozilla.org/en-US/docs/Web/API/Performance/now#reduced_time_precision
   * @param w - The width of the target object
   * @param h - The height of the target object
   * @param d - the distance from the first mouse event to the center of the target object
   */
  constructor(t, w, h, d) {
    __publicField$2(this, "t");
    __publicField$2(this, "w");
    __publicField$2(this, "h");
    __publicField$2(this, "d");
    this.d = d;
    this.h = h;
    this.w = w;
    this.t = t;
  }
  /**
   * The ID part of the Fitt's law.
   * @param we - Effective target width (std dev on distances), to be used instead of the classical distance.
   * @returns The ID
   */
  getID(we) {
    return Math.log2(this.d / (we ?? this.w) + 1);
  }
}
class FittsLaw {
  /**
   * @param bSrc - The source binding.
   * @param bTgt - The target binding.
   * @param target - The optional target object. If not provided, the target object will be inferred
   * from event data.
   */
  constructor(bSrc, bTgt, target) {
    __publicField$2(this, "obsSrc");
    __publicField$2(this, "providedTarget");
    __publicField$2(this, "data");
    __publicField$2(this, "_startX");
    __publicField$2(this, "_startY");
    __publicField$2(this, "_target");
    __publicField$2(this, "handler");
    this.data = [];
    this.providedTarget = target;
    this.handler = (evt) => {
      if (this._startX === void 0) {
        this._startX = evt.screenX;
        this._startY = evt.screenY;
      }
      this._target = this.providedTarget ?? (evt.target instanceof Element ? evt.target : void 0);
    };
    this.obsSrc = bSrc.produces.subscribe(() => {
      this.reinit();
      document.body.addEventListener("mousemove", this.handler);
      const t0 = performance.now();
      const obsTgt = bTgt.produces.subscribe(() => {
        const t1 = performance.now();
        this.data.push(new FittsLawDataImpl(
          t1 - t0,
          this._target?.clientWidth ?? Number.NaN,
          this._target?.clientHeight ?? Number.NaN,
          this.computeD()
        ));
        obsTgt.unsubscribe();
        document.body.removeEventListener("mousemove", this.handler);
      });
    });
  }
  computeD() {
    if (this._startX === void 0 || this.providedTarget === void 0) {
      return Number.NaN;
    }
    const a = this.providedTarget.clientLeft + this.providedTarget.clientWidth / 2 + this._startX;
    const b = this.providedTarget.clientTop + this.providedTarget.clientHeight / 2 + this._startY;
    return Math.hypot(a, b);
  }
  /**
   * Computes the effective target width (std dev on distances).
   * @returns The effective target width.
   */
  get we() {
    const ds = this.data.map((d) => d.d);
    const mean = ds.reduce((a, b) => a + b) / ds.length;
    return Math.sqrt(ds.map((x) => (x - mean) ** 2).reduce((a, b) => a + b) / ds.length);
  }
  /**
   * Computes the a and b coefficent of the regression line.
   * @param effectiveTargetW - If true, will consider the effective target width. Otherwise will consider
   * the computed distances.
   * @returns the regression lien coefficients.
   */
  getAB(effectiveTargetW = false) {
    const w = effectiveTargetW ? this.we : void 0;
    const xs = this.data.map((d) => d.getID(w));
    const ys = this.data.map((d) => d.t);
    let sumx = 0;
    let sumy = 0;
    let sumxy = 0;
    let sumxx = 0;
    let sumyy = 0;
    for (const [i, y] of ys.entries()) {
      sumx += xs[i] ?? 0;
      sumy += y;
      sumxy += (xs[i] ?? 0) * y;
      sumxx += (xs[i] ?? 0) ** 2;
      sumyy += y * y;
    }
    const tmp = ys.length * sumxy - sumx * sumy;
    const tmp2 = ys.length * sumxx - sumx ** 2;
    const a = tmp / tmp2;
    const b = (sumy - a * sumx) / ys.length;
    const r = (tmp / Math.sqrt(tmp2 * (ys.length * sumyy - sumy ** 2))) ** 2;
    return [a, b, r];
  }
  /**
   * Cleans the object
   */
  uninstall() {
    this.obsSrc.unsubscribe();
    this.data.length = 0;
  }
  reinit() {
    this._startX = void 0;
    this._startY = void 0;
    this._target = void 0;
  }
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => {
  __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class UndoableTreeNodeImpl {
  constructor(undoable, id, parent) {
    __publicField$1(this, "lastChildUndone");
    __publicField$1(this, "children");
    __publicField$1(this, "id");
    __publicField$1(this, "parent");
    __publicField$1(this, "undoable");
    __publicField$1(this, "cacheVisualSnap");
    this.undoable = undoable;
    this.id = id;
    this.children = new Array();
    this.parent = parent;
    this.cacheVisualSnap = undoable.getVisualSnapshot();
  }
  undo() {
    if (this.parent !== void 0) {
      this.parent.lastChildUndone = this;
    }
    this.undoable.undo();
  }
  redo() {
    this.undoable.redo();
  }
  get visualSnapshot() {
    return this.cacheVisualSnap;
  }
}
class UndoableTreeNodeDTOImpl {
  constructor(node, fn) {
    __publicField$1(this, "children");
    __publicField$1(this, "id");
    __publicField$1(this, "undoable");
    this.id = node.id;
    this.undoable = fn(node.undoable);
    this.children = node.children.map((child) => new UndoableTreeNodeDTOImpl(child, fn));
  }
  /**
   * Produces a tree node from the DTO node. This operates recurcively on
   * children, so that it converts all the tree node.
   * @param dto - The DTO to convert
   * @param fn - The convertion method for the undoable.
   * @param parent - The parent node of the one to create.
   * @returns The created tree node (and its children) and the list of created nodes.
   */
  static toNode(dto, fn, parent) {
    const node = new UndoableTreeNodeImpl(fn(dto.undoable), dto.id, parent);
    const res = dto.children.map((child) => UndoableTreeNodeDTOImpl.toNode(child, fn, node));
    node.children.push(...res.map((currNodeTree) => currNodeTree[0]));
    const nodes = [node, ...res.flatMap((currNodeTree) => currNodeTree[1])];
    return [node, nodes];
  }
}
class TreeUndoHistoryImpl extends TreeUndoHistory {
  constructor(keepPath = false) {
    super();
    __publicField$1(this, "idCounter");
    __publicField$1(this, "_currentNode");
    __publicField$1(this, "undoableNodes");
    __publicField$1(this, "undoPublisher");
    __publicField$1(this, "redoPublisher");
    __publicField$1(this, "root");
    __publicField$1(this, "_path");
    __publicField$1(this, "_keepPath");
    this._keepPath = keepPath;
    this._path = [];
    this.undoableNodes = [];
    this.idCounter = 0;
    this.root = new UndoableTreeNodeImpl({
      getUndoName() {
        return "";
      },
      getVisualSnapshot() {
        return "root";
      },
      redo() {
      },
      undo() {
      }
    }, -1, void 0);
    this._currentNode = this.root;
    this.undoPublisher = new Subject();
    this.redoPublisher = new Subject();
  }
  add(undoable) {
    const node = new UndoableTreeNodeImpl(undoable, this.idCounter, this.currentNode);
    this.undoableNodes[this.idCounter] = node;
    this.currentNode.children.push(node);
    this._currentNode = node;
    this.addToPath();
    this.idCounter++;
    this.undoPublisher.next(undoable);
    this.redoPublisher.next(void 0);
  }
  get currentNode() {
    return this._currentNode;
  }
  clear() {
    this.root.children.length = 0;
    this._currentNode = this.root;
    this._path.length = 0;
    this.undoableNodes.length = 0;
    this.idCounter = 0;
    this.undoPublisher.next(void 0);
    this.redoPublisher.next(void 0);
  }
  delete(id) {
    if (this.keepPath) {
      return;
    }
    const node = this.undoableNodes[id];
    if (node === void 0) {
      return;
    }
    let nodeBranch = this.currentNode;
    while (nodeBranch !== this.root) {
      if (nodeBranch.id === id) {
        return;
      }
      nodeBranch = nodeBranch.parent ?? this.root;
    }
    this.undoableNodes[id] = void 0;
    if (node.parent !== void 0) {
      remove(node.parent.children, node);
      if (node.parent.lastChildUndone === node) {
        node.parent.lastChildUndone = void 0;
      }
    }
    for (const child of Array.from(node.children)) {
      this.delete(child.id);
    }
    if (this.currentNode === node) {
      this._currentNode = this.root;
    }
  }
  goTo(id) {
    if (this.currentNode.id === id || this.undoableNodes.length === 0 || id >= this.undoableNodes.length || id < -1) {
      return;
    }
    if (this.currentNode === this.root) {
      this.goToFromRoot(id);
    } else {
      this.goFromOneNodeToAnotherOne(id);
    }
    this._currentNode = this.undoableNodes[id] ?? this.root;
    this.addToPath();
    this.undoPublisher.next(this.getLastUndo());
    this.redoPublisher.next(this.getLastRedo());
  }
  goToFromRoot(id) {
    const undoables = this.gatherToRoot(this.undoableNodes[id]);
    for (let i = undoables.length - 1; i >= 0; i--) {
      undoables[i]?.redo();
    }
  }
  gatherToRoot(node) {
    const path = new Array();
    let currentNode = node;
    while (currentNode !== this.root && currentNode !== void 0) {
      path.push(currentNode);
      currentNode = currentNode.parent;
    }
    return path.reverse();
  }
  goFromOneNodeToAnotherOne(id) {
    const pathSrc = this.gatherToRoot(this.currentNode);
    const pathTo = id === -1 ? [] : this.gatherToRoot(this.undoableNodes[id]);
    let i = 0;
    while (pathSrc[i] === pathTo[i]) {
      i++;
    }
    for (let j = pathSrc.length - 1; j > i; j--) {
      pathSrc[j]?.undo();
    }
    if (i < pathSrc.length) {
      pathSrc[i]?.undo();
    }
    for (let j = i; j < pathTo.length; j++) {
      pathTo[j]?.redo();
    }
  }
  redo() {
    const node = this.currentNode.lastChildUndone;
    if (node !== void 0) {
      node.undoable.redo();
      this._currentNode = node;
      this.addToPath();
      this.undoPublisher.next(node.undoable);
      this.redoPublisher.next(this.getLastRedo());
    }
  }
  undo() {
    if (this.currentNode !== this.root) {
      const currentUndoable = this.currentNode.undoable;
      this.currentNode.undo();
      this._currentNode = this.currentNode.parent ?? this.root;
      this.addToPath();
      this.undoPublisher.next(this.getLastUndo());
      this.redoPublisher.next(currentUndoable);
    }
  }
  getPositions() {
    const positions = /* @__PURE__ */ new Map();
    this.getPositionNode(this.root, positions, 0);
    return positions;
  }
  getPositionNode(node, positions, counter) {
    const [child0, child1] = node.children;
    if (child0 === void 0) {
      positions.set(node.id, counter);
      return counter + 1;
    }
    if (child1 === void 0) {
      const newCounter2 = this.getPositionNode(child0, positions, counter);
      positions.set(node.id, positions.get(child0.id) ?? -1);
      return newCounter2;
    }
    let newCounter = counter;
    for (let i = 0; i < Math.floor(node.children.length / 2); i++) {
      newCounter = this.getPositionNode(node.children[i], positions, newCounter);
    }
    if (node.children.length % 2 === 0) {
      positions.set(node.id, newCounter);
      newCounter++;
    } else {
      const value = node.children[Math.floor(node.children.length / 2)];
      newCounter = this.getPositionNode(value, positions, newCounter);
      positions.set(node.id, positions.get(value.id) ?? -1);
    }
    for (let i = Math.ceil(node.children.length / 2); i < node.children.length; i++) {
      newCounter = this.getPositionNode(node.children[i], positions, newCounter);
    }
    return newCounter;
  }
  getLastOrEmptyRedoMessage() {
    return this.getLastRedoMessage() ?? "";
  }
  getLastOrEmptyUndoMessage() {
    return this.getLastUndoMessage() ?? "";
  }
  getLastRedo() {
    if (this.currentNode.lastChildUndone !== void 0) {
      return this.currentNode.lastChildUndone.undoable;
    }
    return this.currentNode.children[0]?.undoable;
  }
  getLastRedoMessage() {
    return this.getLastRedo()?.getUndoName();
  }
  getLastUndo() {
    return this.currentNode === this.root ? void 0 : this.currentNode.undoable;
  }
  getLastUndoMessage() {
    return this.getLastUndo()?.getUndoName();
  }
  undosObservable() {
    return this.undoPublisher;
  }
  redosObservable() {
    return this.redoPublisher;
  }
  get path() {
    return this._path;
  }
  get keepPath() {
    return this._keepPath;
  }
  addToPath() {
    if (this.keepPath) {
      this._path.push(this._currentNode.id);
    }
  }
  export(fn) {
    return {
      "roots": this.root.children.map((child) => new UndoableTreeNodeDTOImpl(child, fn)),
      "path": this.path
    };
  }
  import(dtoHistory, fn) {
    this.clear();
    if (this.keepPath) {
      this._path.push(...dtoHistory.path);
    }
    const res = dtoHistory.roots.map((root) => UndoableTreeNodeDTOImpl.toNode(root, fn, this.root));
    this.root.children.push(...res.map((currRoot) => currRoot[0]));
    for (const currNode of res.flatMap((currRoot) => currRoot[1])) {
      this.undoableNodes[currNode.id] = currNode;
    }
    this._currentNode = this.root;
    this.idCounter = Math.max(...this._path) + 1;
    const gotoId = this.path.at(-1);
    if (gotoId !== void 0) {
      this.goTo(gotoId);
      this.goTo(-1);
    }
    this.undoPublisher.next(this.getLastUndo());
    this.redoPublisher.next(this.getLastRedo());
  }
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class UndoHistoryImpl extends UndoHistory {
  /**
   * Create the undo history
   */
  constructor() {
    super();
    /**
     * Contains the undoable objects.
     */
    __publicField(this, "undos");
    /**
     * Contains the redoable objects.
     */
    __publicField(this, "redos");
    /**
     * The maximal number of undo.
     */
    __publicField(this, "sizeMax");
    __publicField(this, "undoPublisher");
    __publicField(this, "redoPublisher");
    this.sizeMax = 0;
    this.undos = [];
    this.redos = [];
    this.sizeMax = 20;
    this.undoPublisher = new Subject();
    this.redoPublisher = new Subject();
  }
  undosObservable() {
    return this.undoPublisher;
  }
  redosObservable() {
    return this.redoPublisher;
  }
  clear() {
    if (this.undos.length > 0) {
      this.undos.length = 0;
      this.undoPublisher.next(void 0);
    }
    this.clearRedo();
  }
  clearRedo() {
    if (this.redos.length > 0) {
      this.redos.length = 0;
      this.redoPublisher.next(void 0);
    }
  }
  add(undoable) {
    if (this.sizeMax > 0) {
      if (this.undos.length === this.sizeMax) {
        this.undos.shift();
      }
      this.undos.push(undoable);
      this.undoPublisher.next(undoable);
      this.clearRedo();
    }
  }
  undo() {
    const undoable = this.undos.pop();
    if (undoable !== void 0) {
      try {
        undoable.undo();
      } finally {
        this.redos.push(undoable);
        this.undoPublisher.next(this.getLastUndo());
        this.redoPublisher.next(undoable);
      }
    }
  }
  redo() {
    const undoable = this.redos.pop();
    if (undoable !== void 0) {
      try {
        undoable.redo();
      } finally {
        this.undos.push(undoable);
        this.undoPublisher.next(undoable);
        this.redoPublisher.next(this.getLastRedo());
      }
    }
  }
  getLastUndoMessage() {
    return this.undos.at(-1)?.getUndoName();
  }
  getLastRedoMessage() {
    return this.redos.at(-1)?.getUndoName();
  }
  getLastOrEmptyUndoMessage() {
    return this.getLastUndoMessage() ?? "";
  }
  getLastOrEmptyRedoMessage() {
    return this.getLastRedoMessage() ?? "";
  }
  getLastUndo() {
    return this.undos.at(-1);
  }
  getLastRedo() {
    return this.redos.at(-1);
  }
  getSizeMax() {
    return this.sizeMax;
  }
  setSizeMax(max) {
    if (max >= 0) {
      const removed = this.undos.splice(0, this.undos.length - max);
      if (this.undos.length === 0 && removed.length > 0) {
        this.undoPublisher.next(void 0);
      }
      this.sizeMax = max;
    }
  }
  getUndo() {
    return this.undos;
  }
  getRedo() {
    return this.redos;
  }
}

export { AnonBinding, AnonCmd, Binder, BindingImpl, Bindings, BindingsContext, BindingsImpl, BoxCheckPressedTransition, BoxChecked, ButtonPressed, ButtonPressedTransition, CancelFSMError, CancellingState, CheckerImpl, Click, ClickFSM, ClickTransition, Clicks, ClicksFSM, ColorPicked, ColorPickedTransition, ComboBoxSelected, ComboBoxTransition, CommandBase, ConcurrentAndFSM, ConcurrentInteraction, ConcurrentXOrFSM, DatePicked, DatePickedTransition, DnD, DoubleClick, DoubleClickFSM, DragLock, DwellSpringAnimation, EscapeKeyPressureTransition, FSMImpl, FittsLaw, FittsLawDataImpl, FocusHTMLElement, FourTouchDataImpl, FourTouchDnD, GeneralTwoTouchDataImpl, HyperLinkClicked, HyperLinkTransition, InitState, InteractionBase, InteractionBuilderImpl, InteractionDataBase, KeyCode, KeyDataImpl, KeyDown, KeyDownFSM, KeyTransition, KeyTyped, KeyTypedFSM, KeyUp, KeyUpFSM, KeysBinder, KeysDataImpl, KeysDown, KeysDownFSM, KeysTyped, KeysTypedFSM, LoggerImpl, LoggingData, LongMouseDown, LongMouseDownFSM, LongTouch, MouseDown, MouseEnter, MouseEnterFSM, MouseLeave, MouseLeaveFSM, MouseMove, MouseMoveFSM, MousePointsDataImpl, MouseTransition, MouseUp, MouseUpFSM, MultiTouch, MultiTouchDataBase, MultiTouchDataImpl, MultiTouchFSM, MustBeUndoableCmdError, Not, NotFSM, OneTouchDnDFSM, Or, OutputStateBase, PointDataImpl, PointingDataBase, PointsDataImpl, Redo, RedoNTimes, RotationTouchDataImpl, ScaleTouchDataImpl, Scroll, ScrollDataImpl, ScrollFSM, ScrollTransition, SetProperties, SetProperty, SpinnerChanged, SpinnerChangedFSM, SpinnerChangedTransition, SrcTgtDataBase, SrcTgtPointsDataImpl, SrcTgtTouchDataImpl, StateBase, StdState, SubFSMTransition, Tap, TapDataImpl, TapFSM, TerminalState, TextInputChanged, TextInputChangedTransition, Then, ThenDataImpl, ThenFSM, ThreeTouchDataImpl, ThreeTouchDnD, TimedClick, TimedClickFSM, TimedTap, TimeoutTransition, TouchDataImpl, TouchDnD, TouchDnDFSM, TouchStart, TouchTransition, TransferArrayItem, TransitionBase, TreeUndoHistory, TreeUndoHistoryImpl, TwoPanDataImpl, TwoTouchDataImpl, Undo, UndoHistory, UndoHistoryImpl, UndoNTimes, UndoableCommand, UpdateBinder, UsageLog, VisitorFSMDepthFirst, Wheel, WheelDataImpl, WheelFSM, WheelTransition, WidgetDataImpl, XTouchDnD, bottomPan, eventTypes, getTouch, hPan, isButton, isCheckBox, isColorChoice, isComboBox, isDatePicker, isEltRef, isHyperLink, isKeyDownEvent, isKeyUpEvent, isOutputStateType, isSpinner, isTextInput, isUndoableType, isWhenAtEnd, isWhenAtStart, isWhenAtThen, isWhenStrict, keyEventTypes, leftPan, mouseEventTypes, remove, removeAt, rightPan, rotate, scale, topPan, touchEventTypes, twoBottomPan, twoHPan, twoLeftPan, twoRightPan, twoTopPan, twoTouch, twoVPan, vPan };
//# sourceMappingURL=interacto.mjs.map
