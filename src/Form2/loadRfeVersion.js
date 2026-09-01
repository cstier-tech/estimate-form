import { buildInitialFormData, makeBlankComponent } from "./formState"

// =============================================================================
// REBUILD form state from a stored RFE version
// =============================================================================
//
// The inverse of submitForm.js: given a version row plus the already-fetched
// child rows, produce a `formData` object the wizard can be seeded with so a
// user can edit a past RFE. Saving it runs submitForm again with the same
// rfe_id, which creates the next version.
// =============================================================================

const str = value => (value === null || value === undefined ? "" : String(value))


export function buildFormDataFromVersion({
    config,
    version,
    quantities = [],
    components = [],
    componentQuantities = [],
    componentFinishing = [],
    kitBuilds = [],
    kitItems = [],
    kitQuantities = [],
    // { [tableName]: row } for child "fields" steps (e.g. Mailing)
    childRowsByTable = {}
}) {

    const data = buildInitialFormData(config)

    const qtyCfg = config.quantities
    const compCfg = config.components
    const cqCfg = config.componentQuantities
    const finCfg = config.componentFinishing
    const kbCfg = config.kitBuilds
    const kiCfg = config.kitItems
    const kqCfg = config.kitQuantities

    // ---- plain fields ----
    for (const step of config.steps) {

        if (step.type !== "fields" || !step.db) {
            continue
        }

        const source =
            step.db.role === "version"
                ? version
                : childRowsByTable[step.db.table]

        if (!source) {
            continue
        }

        for (const field of step.fields || []) {
            data[field.name] = source[field.name] ?? ""
        }
    }

    // ---- RFE quantities (ordered quote levels) ----
    const orderedQtys = quantities
        .filter(row => row[qtyCfg.fk] === version.id)
        .sort(
            (a, b) =>
                Number(a[qtyCfg.sortColumn] || 0) -
                Number(b[qtyCfg.sortColumn] || 0)
        )

    data.quantities = orderedQtys.length
        ? orderedQtys.map(row => str(row[qtyCfg.valueColumn]))
        : [""]

    // ---- components ----
    const versionComponents = components.filter(
        row => row[compCfg.fk] === version.id
    )

    // DB Components.id -> the id the form uses (component_key when present)
    const formIdByDbId = new Map(
        versionComponents.map(row => [
            row.id,
            row.component_key || row.id
        ])
    )

    if (versionComponents.length > 0) {

        data.components = versionComponents.map(row => {

            const component = makeBlankComponent()

            for (const [dbColumn, stateKey] of Object.entries(compCfg.fieldMap)) {
                if (row[dbColumn] !== undefined && row[dbColumn] !== null) {
                    component[stateKey] = row[dbColumn]
                }
            }

            component.id = row.component_key || row.id || component.id
            component.saved = true

            component.quantities = orderedQtys.length
                ? orderedQtys.map(qtyRow => {
                    const match = componentQuantities.find(
                        cq =>
                            cq[cqCfg.componentFk] === row.id &&
                            cq[cqCfg.rfeQuantityFk] === qtyRow.id
                    )
                    return match ? str(match[cqCfg.valueColumn]) : ""
                })
                : [""]

            component.finishingOps = componentFinishing
                .filter(fin => fin[finCfg.componentFk] === row.id)
                .map(fin => ({
                    value: fin[finCfg.operationColumn],
                    details: fin[finCfg.detailsColumn] || {}
                }))

            component.requiresFinishing = component.finishingOps.length > 0
            component.SameQty = false

            return component
        })
    }

    // ---- kitting ----
    const kitBuild = kitBuilds.find(
        row => row[kbCfg.fk] === version.id
    ) || null

    data.kits = kitBuild
        ? kitItems
            .filter(item => item[kiCfg.buildFk] === kitBuild.id)
            .map(item => {

                const qtyRow = kitQuantities.find(
                    q => q[kqCfg.kitFk] === item.id
                )

                const dbComponentId = item[kiCfg.componentFk]

                return {
                    id: crypto.randomUUID(),
                    source: item[kiCfg.sourceColumn] || "manual",
                    componentId: dbComponentId
                        ? formIdByDbId.get(dbComponentId) ?? null
                        : null,
                    name: item[kiCfg.nameColumn] || "",
                    qtyPerKit: qtyRow ? str(qtyRow[kqCfg.valueColumn]) : "",
                    overageAction: item[kiCfg.overageColumn] || ""
                }
            })
        : []

    return data
}
