import { supabase } from "../lib/supabaseClient"
import { getVisibleFields } from "./fieldVisibility"

// =============================================================================
// CONFIG-DRIVEN SUBMIT
// =============================================================================
//
// Walks FORM_CONFIG and writes the submission:
//
//   RFEs ─┬─ RFE Versions (the "version" fields step)
//         ├─ RFE Quantities
//         ├─ Components ─┬─ Component Quantities
//         │              └─ Component Finishing
//         └─ every other `fields` step with a `db.table`  (Mailing, ...)
//              one row, linked by `db.fk` (default "version_id"),
//              column name === field `name`.
//
// Returns { ok: true, rfeId, versionId } or { ok: false, error }.
// =============================================================================


function isBlank(value) {
    return String(value ?? "").trim() === ""
}


// Coerce a field value to what the column expects.
function normalize(value, field) {

    if (field.type === "date") {
        return isBlank(value) ? null : value
    }

    if (field.type === "number") {
        return isBlank(value) ? null : Number(value)
    }

    return value
}


// Build { columnName: value } for a fields step, skipping hidden fields.
function buildFieldRow(step, formData) {

    const row = {}

    for (const field of getVisibleFields(step.fields, formData)) {
        row[field.name] = normalize(formData[field.name], field)
    }

    return row
}


// Run a Supabase query, throw on error so the caller's try/catch handles it.
async function run(label, query) {

    const { data, error } = await query

    if (error) {
        error.step = label
        throw error
    }

    return data
}


export async function submitForm({ formData, selectedRFEId, config }) {

    try {

        // -----------------------------------------------------------------
        // 1. PARENT RFE
        // -----------------------------------------------------------------

        let rfeId = selectedRFEId

        if (!rfeId) {

            const rfe = await run(
                "create RFE",
                supabase
                    .from(config.parent.table)
                    .insert({})
                    .select()
                    .single()
            )

            rfeId = rfe.id
        }


        // -----------------------------------------------------------------
        // 2. NEXT VERSION NUMBER
        // -----------------------------------------------------------------

        const versionCfg = config.version

        const existingVersions = await run(
            "load versions",
            supabase
                .from(versionCfg.table)
                .select(versionCfg.numberColumn)
                .eq(versionCfg.fk, rfeId)
        )

        const nextVersionNumber =
            existingVersions.length > 0
                ? Math.max(
                    ...existingVersions.map(
                        row => Number(row[versionCfg.numberColumn]) || 0
                    )
                ) + 1
                : 1


        // -----------------------------------------------------------------
        // 3. VERSION ROW  (the fields step flagged role: "version")
        // -----------------------------------------------------------------

        const versionStep = config.steps.find(
            step =>
                step.type === "fields" &&
                step.db &&
                step.db.role === "version"
        )

        if (!versionStep) {
            throw new Error(
                'No fields step is flagged db.role === "version" in formConfig.js'
            )
        }

        const version = await run(
            "save version",
            supabase
                .from(versionStep.db.table)
                .insert({
                    ...buildFieldRow(versionStep, formData),
                    [versionCfg.fk]: rfeId,
                    [versionCfg.numberColumn]: nextVersionNumber
                })
                .select()
                .single()
        )

        const versionId = version.id


        // -----------------------------------------------------------------
        // 4. RFE QUANTITIES
        // -----------------------------------------------------------------

        const qtyCfg = config.quantities

        const quantityRows = formData.quantities
            .map((value, index) => ({ value, index }))
            .filter(entry => !isBlank(entry.value))
            .map(entry => ({
                [qtyCfg.valueColumn]: Number(entry.value),
                [qtyCfg.fk]: versionId,
                [qtyCfg.sortColumn]: entry.index
            }))

        let savedQuantities = []

        if (quantityRows.length > 0) {
            savedQuantities = await run(
                "save quantities",
                supabase
                    .from(qtyCfg.table)
                    .insert(quantityRows)
                    .select()
            )
        }

        // original quote-level index -> saved RFE quantity row
        const rfeQtyByIndex = new Map(
            savedQuantities.map(
                row => [row[qtyCfg.sortColumn], row]
            )
        )


        // -----------------------------------------------------------------
        // 5. COMPONENTS
        // -----------------------------------------------------------------

        const compCfg = config.components

        const activeComponents = formData.components.filter(
            component => !isBlank(component.Component)
        )

        const componentRows = activeComponents.map(component => {

            const row = { [compCfg.fk]: versionId }

            for (const [column, key] of Object.entries(compCfg.fieldMap)) {
                row[column] = component[key]
            }

            return row
        })

        let savedComponents = []

        if (componentRows.length > 0) {
            savedComponents = await run(
                "save components",
                supabase
                    .from(compCfg.table)
                    .insert(componentRows)
                    .select()
            )
        }


        // -----------------------------------------------------------------
        // 6. COMPONENT QUANTITIES  (paired on original quote-level index)
        // -----------------------------------------------------------------

        const cqCfg = config.componentQuantities
        const componentQuantityRows = []

        activeComponents.forEach((component, i) => {

            const savedComponent = savedComponents[i]

            if (!savedComponent) {
                return
            }

            formData.quantities.forEach((_, levelIndex) => {

                const rfeQuantity = rfeQtyByIndex.get(levelIndex)
                const value = component.quantities?.[levelIndex]

                if (!rfeQuantity || isBlank(value)) {
                    return
                }

                componentQuantityRows.push({
                    [cqCfg.componentFk]: savedComponent.id,
                    [cqCfg.rfeQuantityFk]: rfeQuantity.id,
                    [cqCfg.valueColumn]: Number(value)
                })
            })
        })

        if (componentQuantityRows.length > 0) {
            await run(
                "save component quantities",
                supabase
                    .from(cqCfg.table)
                    .insert(componentQuantityRows)
            )
        }


        // -----------------------------------------------------------------
        // 7. COMPONENT FINISHING
        // -----------------------------------------------------------------

        const finCfg = config.componentFinishing
        const finishingRows = []

        activeComponents.forEach((component, i) => {

            const savedComponent = savedComponents[i]

            if (!savedComponent || !component.finishingOps) {
                return
            }

            component.finishingOps.forEach(operation => {
                finishingRows.push({
                    [finCfg.operationColumn]: operation.value,
                    [finCfg.detailsColumn]: operation.details || {},
                    [finCfg.componentFk]: savedComponent.id
                })
            })
        })

        if (finishingRows.length > 0) {
            await run(
                "save component finishing",
                supabase
                    .from(finCfg.table)
                    .insert(finishingRows)
            )
        }


        // -----------------------------------------------------------------
        // 8. KITS  (one Kit Build per version -> Kit Items -> Kit Quantities)
        // -----------------------------------------------------------------

        const kitItems = formData.kits || []

        if (kitItems.length > 0) {

            const kbCfg = config.kitBuilds
            const kiCfg = config.kitItems
            const kqCfg = config.kitQuantities

            const kitBuild = await run(
                "save kit build",
                supabase
                    .from(kbCfg.table)
                    .insert({ [kbCfg.fk]: versionId })
                    .select()
                    .single()
            )

            // local component id -> saved Components row id
            const savedComponentIdByLocalId = new Map(
                activeComponents.map((component, i) => [
                    component.id,
                    savedComponents[i]?.id
                ])
            )

            // Items the "build from components" step flagged as impossible
            // (not enough component pieces) are UI-only, not persisted.
            const persistableKits = kitItems.filter(kit => !kit.error)

            const kitItemRows = persistableKits.map(kit => ({
                [kiCfg.buildFk]: kitBuild.id,
                [kiCfg.sourceColumn]: kit.source,
                [kiCfg.nameColumn]: kit.name,
                [kiCfg.overageColumn]: kit.overageAction || null,
                [kiCfg.componentFk]:
                    kit.source === "component"
                        ? savedComponentIdByLocalId.get(kit.componentId) ?? null
                        : null
            }))

            let savedKitItems = []

            if (kitItemRows.length > 0) {
                savedKitItems = await run(
                    "save kit items",
                    supabase
                        .from(kiCfg.table)
                        .insert(kitItemRows)
                        .select()
                )
            }

            const kitQuantityRows = persistableKits
                .map((kit, i) => ({ kit, saved: savedKitItems[i] }))
                .filter(entry => entry.saved && !isBlank(entry.kit.qtyPerKit))
                .map(entry => ({
                    [kqCfg.kitFk]: entry.saved.id,
                    [kqCfg.valueColumn]: Number(entry.kit.qtyPerKit)
                }))

            if (kitQuantityRows.length > 0) {
                await run(
                    "save kit quantities",
                    supabase
                        .from(kqCfg.table)
                        .insert(kitQuantityRows)
                )
            }
        }


        // -----------------------------------------------------------------
        // 9. GENERIC CHILD FIELDS STEPS  (Mailing, and anything you add)
        // -----------------------------------------------------------------

        const childSteps = config.steps.filter(
            step =>
                step.type === "fields" &&
                step.db &&
                step.db.table &&
                step.db.role !== "version"
        )

        for (const step of childSteps) {

            const fk = step.db.fk || "version_id"

            await run(
                `save ${step.db.table}`,
                supabase
                    .from(step.db.table)
                    .insert({
                        ...buildFieldRow(step, formData),
                        [fk]: versionId
                    })
            )
        }


        // -----------------------------------------------------------------
        // 10. DONE
        // -----------------------------------------------------------------

        return { ok: true, rfeId, versionId }

    } catch (error) {

        console.error("submitForm failed:", error)
        return { ok: false, error }
    }
}
