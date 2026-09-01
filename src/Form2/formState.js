// Initial form state, derived from the config.
//
// Adding a plain field to a `type: "fields"` step in formConfig.js is enough for
// it to render, update, and (if the step has a `db` block) save. This builder is
// what keeps that promise: every configured field name gets seeded here so the
// input is controlled from the first render.

export function makeBlankComponent() {

    return {
        id: crypto.randomUUID(),
        Component: "",
        Source: "",
        JobNo: "",
        Size: "",
        Stock: "",
        Coating: "",
        FlatSize: "",
        quantities: [""],
        SameQty: false,
        requiresFinishing: false,
        saved: false,
        finishingOps: []
    }
}


import { createPackDistributionRow } from "../pages/newestForm/factories"

export function buildInitialFormData(config) {

    const initial = {}

    // ---- fields declared by the config ----
    for (const step of config.steps) {

        if (step.type !== "fields") {
            continue
        }

        for (const field of step.fields || []) {
            initial[field.name] = field.defaultValue ?? ""
        }
    }

    // ---- structural state the wizard steps rely on ----
    return {
        ...initial,

        quantities: [""],

        components: [makeBlankComponent()],

        packDistribution: [[createPackDistributionRow(0)]],

        // Kit items. The kit count per quote level is the RFE `quantities`
        // above; each item keeps a single scalar qty-per-kit.
        kits: [],

        service_types: [],
        other_service_types: ""
    }
}
