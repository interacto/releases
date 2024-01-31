import { Click } from "../interaction/library/Click";
import { Clicks } from "../interaction/library/Clicks";
import { DoubleClick } from "../interaction/library/DoubleClick";
import { DragLock } from "../interaction/library/DragLock";
import { KeyDown } from "../interaction/library/KeyDown";
import { KeysTyped } from "../interaction/library/KeysTyped";
import { KeyTyped } from "../interaction/library/KeyTyped";
import { KeyUp } from "../interaction/library/KeyUp";
import { LongMouseDown } from "../interaction/library/LongMouseDown";
import { MouseDown } from "../interaction/library/MouseDown";
import { MouseUp } from "../interaction/library/MouseUp";
import { MultiTouch } from "../interaction/library/MultiTouch";
import { leftPan, rightPan, vPan, hPan, topPan, bottomPan } from "../interaction/library/Pans";
import { TouchDnD } from "../interaction/library/TouchDnD";
import { twoBottomPan, twoHPan, twoLeftPan, twoRightPan, twoTopPan, twoVPan } from "../interaction/library/TwoPans";
export class CheckerImpl {
    linterRules;
    cacheIncluded;
    constructor() {
        this.linterRules = new Map();
        this.linterRules.set("same-interactions", "ignore");
        this.linterRules.set("same-data", "ignore");
        this.linterRules.set("included", "ignore");
        this.cacheIncluded = new Map();
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
        this.checkRule("same-interactions", this.getSameInteractionSeverity(binding), binding, binds, currBinding => binding.interaction.name === currBinding.interaction.name, "[same-interactions] Two bindings use the same user interaction on same widget.");
    }
    checkSameData(binding, binds) {
        this.checkRule("same-data", this.getSameDataSeverity(binding), binding, binds, currBinding => binding.interaction.data.constructor === currBinding.interaction.data.constructor, "[same-data] Two bindings use the same user interaction data type on same widget.");
    }
    checkIncluded(binding, binds) {
        this.checkRule("included", this.getIncludedSeverity(binding), binding, binds, currBinding => this.isIncluded(binding.interaction.name, currBinding.interaction.name), "[included] The interaction of the first binding is included into the interaction of a second one.");
    }
    checkRule(ruleName, severity, binding, binds, predicate, msg) {
        if (severity !== "ignore" && !binding.isWhenDefined() &&
            binds
                .filter(currBinding => currBinding.linterRules.get(ruleName) !== "ignore" && !currBinding.isWhenDefined())
                .some(currBinding => predicate(currBinding) &&
                this.isWidgetSetsIntersecting(binding.interaction.registeredNodes, currBinding.interaction.registeredNodes))) {
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
        return Array.from(w1.values()).some(widget => w2.has(widget));
    }
    printLinterMsg(severity, msg) {
        if (severity === "err") {
            throw new Error(msg);
        }
        else {
            console.warn(msg);
        }
    }
    fillCacheIncluded() {
        if (this.cacheIncluded.size === 0) {
            this.cacheIncluded.set(Click.name, new Set([DragLock.name, DoubleClick.name, Clicks.name]));
            this.cacheIncluded.set(DoubleClick.name, new Set([DragLock.name]));
            this.cacheIncluded.set(KeyDown.name, new Set([KeyTyped.name]));
            this.cacheIncluded.set(KeyUp.name, new Set([KeyTyped.name]));
            this.cacheIncluded.set(KeyTyped.name, new Set([KeysTyped.name]));
            this.cacheIncluded.set(LongMouseDown.name, new Set([Click.name, DoubleClick.name, Clicks.name]));
            this.cacheIncluded.set(MouseDown.name, new Set([LongMouseDown.name, Click.name, DoubleClick.name, Clicks.name]));
            this.cacheIncluded.set(MouseUp.name, new Set([Click.name, DoubleClick.name, Clicks.name]));
            this.cacheIncluded.set(leftPan.name, new Set([hPan.name, TouchDnD.name]));
            this.cacheIncluded.set(rightPan.name, new Set([hPan.name, TouchDnD.name]));
            this.cacheIncluded.set(topPan.name, new Set([vPan.name, TouchDnD.name]));
            this.cacheIncluded.set(bottomPan.name, new Set([vPan.name, TouchDnD.name]));
            this.cacheIncluded.set(hPan.name, new Set([TouchDnD.name]));
            this.cacheIncluded.set(vPan.name, new Set([TouchDnD.name]));
            this.cacheIncluded.set(twoHPan.name, new Set([MultiTouch.name]));
            this.cacheIncluded.set(twoVPan.name, new Set([MultiTouch.name]));
            this.cacheIncluded.set(twoLeftPan.name, new Set([twoHPan.name, MultiTouch.name]));
            this.cacheIncluded.set(twoRightPan.name, new Set([twoHPan.name, MultiTouch.name]));
            this.cacheIncluded.set(twoTopPan.name, new Set([twoVPan.name, MultiTouch.name]));
            this.cacheIncluded.set(twoBottomPan.name, new Set([twoVPan.name, MultiTouch.name]));
        }
    }
}
