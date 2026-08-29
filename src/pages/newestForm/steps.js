// Wizard step definitions. `when` marks a step conditional on form state;
// steps without it are always shown.

export const STEPS = [
    { id: "overview", label: "Project Overview" },
    // { id: "quantities", label: "Quantities to Quote" },
    // { id: "services", label: "Service Type" },
    { id: "components", label: "Components" },
    { id: "kitting", label: "Kitting", when: (state) => state.services.serviceTypes.includes("Kitting") },
    { id: "mailing", label: "Mailing", when: (state) => state.services.serviceTypes.includes("Mailing") },
    { id: "packing", label: "Packing" },
    { id: "review", label: "Review & Submit" },
]

// The steps currently applicable to the given form state, in order.
export const visibleSteps = (state) => STEPS.filter((step) => !step.when || step.when(state))
