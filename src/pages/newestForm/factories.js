// Default shapes for a new blank component and the kit generated from one.

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

// One empty pack-distribution row: its own pack type plus a qty-per-pack /
// number-of-packs split.
export function createPackDistributionRow() {
    return { packType: "", qtyPerPack: "", numberOfPacks: "" }
}

export function kitFromComponent(component) {
    return {
        componentId: component.id,
        source: "component",
        Kit: component.Component,
        quantities: [...component.quantities],
        OverageAction: ""
    }
}
