// Default shapes for a new blank component and the kit item generated from one.

export function createEmptyComponent() {
    return {
        id: crypto.randomUUID(),
        componentKey: crypto.randomUUID(),
        Component: "",
        Size: "",
        FlatSize: "",
        Stock: "",
        Coating: "",
        quantities: [""],
        saved: false,
        finishingOps: [],
        SameQty: false,
        requiresFinishing: false
    }
}

// One empty pack-distribution row, tied to a quote level (index into qtysToQuote):
// its own pack type plus a qty-per-pack / number-of-packs split.
export function createPackDistributionRow(levelIndex = 0) {
    return { levelIndex, packType: "", qtyPerPack: "", numberOfPacks: "" }
}

// A kit item stands for one thing that goes into every kit. `qtyPerKit` is a
// single scalar (how many of this item per kit) — the per-level totals are
// derived as qtyPerKit * completed units for that level.
export function createEmptyKitItem() {
    return {
        id: crypto.randomUUID(),
        componentId: null,
        source: "manual",
        name: "",
        qtyPerKit: "",
        overageAction: ""
    }
}

export function kitItemFromComponent(component) {
    return {
        id: crypto.randomUUID(),
        componentId: component.id,
        source: "component",
        name: component.Component,
        qtyPerKit: "",
        overageAction: ""
    }
}
