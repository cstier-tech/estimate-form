// Single source of truth for the estimate form.
//
// Every field the form collects lives in one state tree here, and every change
// goes through `formReducer` as a named action. Load (mapProjectToFormState),
// submit, and the "what changed" diff all read this one shape instead of
// juggling ~30 separate useState values.

import { createEmptyComponent, createEmptyKitItem, createPackDistributionRow, kitItemFromComponent } from "./factories"
import { toQtyStrings } from "./quantities"
import { parseServiceTypes } from "./serviceTypes"
import { STEPS, visibleSteps } from "./steps"

// Replace one item in an array by index, leaving the rest untouched.
const replaceAt = (arr, index, updater) =>
    arr.map((item, i) => (i === index ? updater(item) : item))

// Set one item by index, padding with "" if the array is shorter than index.
const setQtyAt = (arr, index, value) => {
    const next = arr.slice()
    while (next.length <= index) next.push("")
    next[index] = value
    return next
}

// After a completed-units level is removed, drop that level's pack rows and
// slide the remaining rows' levelIndex down to match.
const shiftPackLevelsAfterRemoval = (rows, removedIndex) =>
    rows
        .filter(row => row.levelIndex !== removedIndex)
        .map(row => (row.levelIndex > removedIndex ? { ...row, levelIndex: row.levelIndex - 1 } : row))

// Mark a step visited and make it current.
function markVisited(wizard, step) {
    return { current: step, visited: { ...wizard.visited, [step]: true } }
}

// After the visible step list changes, pull `current` back onto a step that
// still exists (the nearest earlier one, otherwise the first).
function clampWizard(state) {
    const visibleIds = visibleSteps(state).map(step => step.id)
    if (visibleIds.includes(state.wizard.current)) return state.wizard

    const allIds = STEPS.map(step => step.id)
    for (let i = allIds.indexOf(state.wizard.current) - 1; i >= 0; i--) {
        if (visibleIds.includes(allIds[i])) return { ...state.wizard, current: allIds[i] }
    }
    return { ...state.wizard, current: visibleIds[0] }
}

// Any component with SameQty checked mirrors the project-level quantities.
function syncSameQty(state) {
    return {
        ...state,
        components: state.components.map(component =>
            component.SameQty
                ? { ...component, quantities: [...state.qtysToQuote] }
                : component
        ),
    }
}

export function initialFormState({ clientName = "", customerNumber = "" } = {}) {
    return {
        overview: {
            clientName,
            customerNumber,
            projName: "",
            projDesc: "",
            dueDate: "",
            salesRep: "Internal sales rep",
            prevJobNo: "",
            prevEstNo: "",
            jobType: "",
            additionalComments: "",
        },
        qtysToQuote: [""],
        services: {
            serviceTypes: [],
            isOtherType: false,
            otherServiceTypes: "",
        },
        components: [createEmptyComponent()],
        // Everything that goes into the kit. One Kit Build per version owns
        // these on save.
        kitItems: [],
        mailing: {
            classOfMail: "",
            indicia: "",
            paymentMethod: "",
            permitType: "",
            nonprofitAuth: "",
            mailingFrom: "",
            permitOwner: "",
            exactCompanyName: "",
            exactCompanyAddress: "",
        },
        // Pack rows, each tied to a completed-units level via `levelIndex`
        // (an index into qtysToQuote).
        packDistribution: [createPackDistributionRow(0)],
        wizard: {
            current: "overview",
            visited: { overview: true },
        },
    }
}

// Sort saved "Project Quantities" rows into the order the form shows levels in.
function sortProjectQuantities(rows) {
    return [...(rows || [])].sort((a, b) => {
        const ao = a.sort_order ?? 0
        const bo = b.sort_order ?? 0
        if (ao !== bo) return ao - bo
        return String(a.created_at || "").localeCompare(String(b.created_at || ""))
    })
}

// A saved project (with its nested rows) -> a full form state tree.
export function mapProjectToFormState(project) {
    const savedServices = parseServiceTypes(project.service_types)
    const checkedServices = savedServices
        .filter(service => service?.source === "check")
        .map(service => service.value)
    const customServices = savedServices
        .filter(service => service?.source === "custom")
        .map(service => service.value)

    const sortedProjectQuantities = sortProjectQuantities(project.projectQuantities)
    const levelCount = sortedProjectQuantities.length
    const levelIndexById = new Map(sortedProjectQuantities.map((pq, i) => [pq.id, i]))

    // Component quantity rows now carry `project_quantity_id`; line them up with
    // the level order. Fall back to positional order for pre-migration rows.
    const componentQtyStrings = (rows) => {
        if (!rows || rows.length === 0) {
            return levelCount > 0 ? Array(levelCount).fill("") : [""]
        }
        const hasLevelRefs = rows.some(row => row.project_quantity_id != null)
        if (hasLevelRefs && levelCount > 0) {
            const out = Array(levelCount).fill("")
            rows.forEach(row => {
                const idx = levelIndexById.get(row.project_quantity_id)
                if (idx != null) out[idx] = String(row.quantity)
            })
            return out
        }
        return toQtyStrings(rows)
    }

    const loadedComponents = (project.components || []).map(component => ({
        id: crypto.randomUUID(),
        componentKey: component.component_key,
        Component: component.component_name || "",
        Size: component.size || "",
        FlatSize: component.flat_size || "",
        Stock: component.stock || "",
        Coating: component.coating || "",
        quantities: componentQtyStrings(component.quantities || []),
        saved: component.saved || false,
        finishingOps: (component.finishingOps || []).map(operation => ({
            id: operation.id,
            value: operation.operation,
            details: operation.details || {},
        })),
        SameQty: false,
        requiresFinishing: (component.finishingOps || []).length > 0,
    }))

    // Loaded components get fresh in-memory ids, so remap each kit item's saved
    // database component_id onto the matching new id (index-aligned with
    // project.components) — otherwise the item/component link breaks on re-save.
    const componentIdByDbId = new Map(
        (project.components || []).map((component, i) => [component.id, loadedComponents[i].id])
    )

    const loadedKitItems = (project.kitItems || []).map(item => ({
        id: item.id,
        componentId: item.component_id ? (componentIdByDbId.get(item.component_id) || null) : null,
        source: item.source || "manual",
        name: item.item_name || "",
        qtyPerKit: item.quantities?.length ? String(item.quantities[0].quantity) : "",
        overageAction: item.overage_action || "",
    }))

    const loadedPackDistribution = (project.packs || []).map(pack => ({
        levelIndex: levelIndexById.get(pack.project_quantity_id) ?? 0,
        packType: pack.pack_type || "",
        qtyPerPack: pack.qty_per_pack != null ? String(pack.qty_per_pack) : "",
        numberOfPacks: pack.num_of_packs != null ? String(pack.num_of_packs) : "",
    }))

    const mailing = project.mailing || {}

    const loaded = {
        overview: {
            clientName: project.client_name || "",
            customerNumber: project.customer_number || "",
            projName: project.project_name || "",
            projDesc: project.project_description || "",
            dueDate: project.due_date || "",
            salesRep: project.sales_rep || "",
            prevJobNo: project.previous_job_number || "",
            prevEstNo: project.previous_estimate_number || "",
            jobType: project.job_type || "",
            additionalComments: project.additional_comments || "",
        },
        qtysToQuote: levelCount > 0 ? sortedProjectQuantities.map(pq => String(pq.quantity)) : [""],
        services: {
            serviceTypes: checkedServices,
            isOtherType: customServices.length > 0,
            otherServiceTypes: customServices.join(", "),
        },
        components: loadedComponents.length > 0 ? loadedComponents : [createEmptyComponent()],
        kitItems: loadedKitItems,
        mailing: {
            classOfMail: mailing.class_of_mail || "",
            indicia: mailing.indicia || "",
            paymentMethod: mailing.payment_method || "",
            permitType: mailing.permit_type || "",
            nonprofitAuth: mailing.nonprofit_auth || "",
            mailingFrom: mailing.mailing_from || "",
            permitOwner: mailing.permit_owner || "",
            exactCompanyName: mailing.exact_company_name || "",
            exactCompanyAddress: mailing.exact_company_address || "",
        },
        packDistribution: loadedPackDistribution.length > 0
            ? loadedPackDistribution
            : [createPackDistributionRow(0)],
        wizard: { current: "overview", visited: {} },
    }

    // Existing project: every applicable step counts as already visited so the
    // user can jump straight to whichever section they came to edit.
    visibleSteps(loaded).forEach(step => { loaded.wizard.visited[step.id] = true })

    return loaded
}

export function formReducer(state, action) {
    switch (action.type) {
        case "loadProject":
            return mapProjectToFormState(action.project)

        // --- Project overview ---
        case "overview/setField":
            return {
                ...state,
                overview: { ...state.overview, [action.field]: action.value },
            }

        // --- Quantities to quote (keep SameQty components mirrored) ---
        case "qtysToQuote/add":
            return syncSameQty({ ...state, qtysToQuote: [...state.qtysToQuote, ""] })

        case "qtysToQuote/set":
            return syncSameQty({
                ...state,
                qtysToQuote: replaceAt(state.qtysToQuote, action.index, () => action.value),
            })

        case "qtysToQuote/remove":
            return syncSameQty({
                ...state,
                qtysToQuote: state.qtysToQuote.filter((_, i) => i !== action.index),
                // Pack rows are keyed to a level — drop/slide them to match.
                packDistribution: shiftPackLevelsAfterRemoval(state.packDistribution, action.index),
            })

        // --- Service types ---
        case "services/toggle": {
            const serviceTypes = action.checked
                ? [...state.services.serviceTypes, action.name]
                : state.services.serviceTypes.filter(item => item !== action.name)

            let kitItems = state.kitItems

            // Kitting just turned on: create a kit item for each saved component
            // that doesn't already have one.
            if (action.name === "Kitting" && action.checked) {
                const existingComponentIds = new Set(
                    kitItems.filter(item => item.componentId).map(item => item.componentId)
                )
                const newItems = state.components
                    .filter(component => component.saved && !existingComponentIds.has(component.id))
                    .map(kitItemFromComponent)
                kitItems = [...kitItems, ...newItems]
            }

            const next = { ...state, services: { ...state.services, serviceTypes }, kitItems }
            // Turning a service off can remove the step the user is standing on.
            return { ...next, wizard: clampWizard(next) }
        }

        case "services/setIsOtherType":
            return { ...state, services: { ...state.services, isOtherType: action.value } }

        case "services/setOtherServiceTypes":
            return { ...state, services: { ...state.services, otherServiceTypes: action.value } }

        // --- Components ---
        case "components/add":
            return { ...state, components: [...state.components, createEmptyComponent()] }

        case "components/save": {
            const component = state.components[action.index]
            if (!component) return state

            const components = replaceAt(state.components, action.index, c => ({ ...c, saved: true }))

            if (!state.services.serviceTypes.includes("Kitting")) {
                return { ...state, components }
            }

            const hasItem = state.kitItems.some(item => item.componentId === component.id)
            const kitItems = hasItem
                ? state.kitItems.map(item =>
                    item.componentId === component.id ? { ...item, name: component.Component } : item
                )
                : [...state.kitItems, kitItemFromComponent(component)]

            return { ...state, components, kitItems }
        }

        case "components/setField":
            return {
                ...state,
                components: replaceAt(state.components, action.index, c => ({
                    ...c,
                    [action.field]: action.value,
                })),
            }

        case "components/addQty":
            return {
                ...state,
                components: replaceAt(state.components, action.index, c => ({
                    ...c,
                    quantities: [...c.quantities, ""],
                })),
            }

        case "components/setQty":
            return {
                ...state,
                components: replaceAt(state.components, action.index, c => ({
                    ...c,
                    quantities: setQtyAt(c.quantities, action.qtyIndex, action.value),
                })),
            }

        case "components/remove":
            return { ...state, components: state.components.filter((_, i) => i !== action.index) }

        case "components/removeQty":
            return {
                ...state,
                components: replaceAt(state.components, action.index, c => ({
                    ...c,
                    quantities: c.quantities.filter((_, j) => j !== action.qtyIndex),
                })),
            }

        case "components/toggleRequiresFinishing":
            return {
                ...state,
                components: replaceAt(state.components, action.index, c => ({
                    ...c,
                    requiresFinishing: action.checked,
                    // Clear any picked ops when finishing is turned off.
                    finishingOps: action.checked ? c.finishingOps : [],
                })),
            }

        case "components/toggleSameQty":
            return {
                ...state,
                components: replaceAt(state.components, action.index, c => ({
                    ...c,
                    SameQty: action.checked,
                    quantities: action.checked ? [...state.qtysToQuote] : c.quantities,
                })),
            }

        case "components/toggleFinishingOp":
            return {
                ...state,
                components: replaceAt(state.components, action.index, c => {
                    if (action.checked) {
                        return {
                            ...c,
                            finishingOps: [...c.finishingOps, { value: action.name, details: {} }],
                        }
                    }
                    return {
                        ...c,
                        finishingOps: c.finishingOps.filter(op => op.value !== action.name),
                    }
                }),
            }

        case "components/setFinishingOpDetail":
            return {
                ...state,
                components: replaceAt(state.components, action.index, c => ({
                    ...c,
                    finishingOps: c.finishingOps.map(op =>
                        op.value === action.opValue
                            ? { ...op, details: { ...op.details, [action.fieldName]: action.value } }
                            : op
                    ),
                })),
            }

        // --- Kit items ---
        case "kitItems/add":
            return { ...state, kitItems: [...state.kitItems, createEmptyKitItem()] }

        case "kitItems/setField":
            return {
                ...state,
                kitItems: replaceAt(state.kitItems, action.index, item => ({
                    ...item,
                    [action.field]: action.value,
                })),
            }

        case "kitItems/remove":
            return { ...state, kitItems: state.kitItems.filter((_, i) => i !== action.index) }

        // --- Mailing ---
        case "mailing/setField":
            return { ...state, mailing: { ...state.mailing, [action.field]: action.value } }

        // --- Packing ---
        // Each row is one distribution for one completed-units level: its pack
        // type plus a qty-per-pack / number-of-packs split.
        case "packing/setDistribution":
            return { ...state, packDistribution: action.rows }

        // --- Wizard navigation ---
        case "wizard/goTo":
            return { ...state, wizard: markVisited(state.wizard, action.step) }

        case "wizard/next": {
            const ids = visibleSteps(state).map(step => step.id)
            const i = ids.indexOf(state.wizard.current)
            return { ...state, wizard: markVisited(state.wizard, ids[Math.min(i + 1, ids.length - 1)]) }
        }

        case "wizard/back": {
            const ids = visibleSteps(state).map(step => step.id)
            const i = ids.indexOf(state.wizard.current)
            return { ...state, wizard: markVisited(state.wizard, ids[Math.max(i - 1, 0)]) }
        }

        default:
            return state
    }
}
