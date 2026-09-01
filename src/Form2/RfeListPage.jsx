import { Fragment, useEffect, useMemo, useState } from "react"

import { supabase } from "../lib/supabaseClient"
import { FORM_CONFIG } from "./formConfig"
import { buildFormDataFromVersion } from "./loadRfeVersion"

// =============================================================================
// RFE LIST PAGE
// =============================================================================
//
// One row per RFE, showing its LATEST version (all columns). Each row:
//   - Edit        -> reopen the wizard prefilled with the latest version
//                    (saving creates the next version)
//   - expand (▸)  -> a panel with a version picker for THAT RFE and, for the
//                    chosen version, a subtable of its row plus its
//                    quantities, components and kit build
//
// Table names come from FORM_CONFIG so this page stays in step with submitForm.
// =============================================================================

const {
    version: VERSION,
    quantities: QUANTITIES,
    components: COMPONENTS,
    componentQuantities: COMPONENT_QUANTITIES,
    componentFinishing: COMPONENT_FINISHING,
    kitBuilds: KIT_BUILDS,
    kitItems: KIT_ITEMS,
    kitQuantities: KIT_QUANTITIES
} = FORM_CONFIG

// Child "fields" steps that live in their own table (e.g. Mailing).
const CHILD_STEPS = FORM_CONFIG.steps.filter(
    step =>
        step.type === "fields" &&
        step.db &&
        step.db.table &&
        step.db.role !== "version"
)


function columnsOf(rows) {
    return [
        ...rows.reduce((set, row) => {
            Object.keys(row).forEach(key => set.add(key))
            return set
        }, new Set())
    ]
}


function renderCell(value) {

    if (value === null || value === undefined || value === "") {
        return <span className="text-gray-400">—</span>
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No"
    }

    if (typeof value === "object") {
        return <code className="text-xs">{JSON.stringify(value)}</code>
    }

    return String(value)
}


// A plain table of every key found across `rows`.
function DataTable({ rows, empty = "Nothing here." }) {

    if (!rows || rows.length === 0) {
        return <p className="text-sm text-gray-500">{empty}</p>
    }

    const columns = columnsOf(rows)

    return (
        <div className="overflow-x-auto border border-gray-200 rounded-md">
            <table className="min-w-full text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        {columns.map(column => (
                            <th
                                key={column}
                                className="px-3 py-2 text-left font-semibold whitespace-nowrap"
                            >
                                {column}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr
                            key={row.id ?? i}
                            className="odd:bg-white even:bg-gray-50"
                        >
                            {columns.map(column => (
                                <td
                                    key={column}
                                    className="px-3 py-2 align-top whitespace-nowrap"
                                >
                                    {renderCell(row[column])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}


function Section({ title, children }) {
    return (
        <div className="mt-4">
            <h4 className="font-semibold mb-2 text-sm">{title}</h4>
            {children}
        </div>
    )
}


// Quantities / components / kit build for one version.
function VersionDetails({ version, data }) {

    const quantities = data.quantities
        .filter(row => row[QUANTITIES.fk] === version.id)
        .sort(
            (a, b) =>
                Number(a[QUANTITIES.sortColumn] || 0) -
                Number(b[QUANTITIES.sortColumn] || 0)
        )

    const components = data.components
        .filter(row => row[COMPONENTS.fk] === version.id)
        .map(component => ({
            ...component,
            qtys: data.componentQuantities
                .filter(
                    q => q[COMPONENT_QUANTITIES.componentFk] === component.id
                )
                .map(q => q[COMPONENT_QUANTITIES.valueColumn])
                .join(", ")
        }))

    const kitBuild =
        data.kitBuilds.find(row => row[KIT_BUILDS.fk] === version.id) || null

    const kitItemRows = kitBuild
        ? data.kitItems
            .filter(row => row[KIT_ITEMS.buildFk] === kitBuild.id)
            .map(item => ({
                ...item,
                qty_per_kit: (
                    data.kitQuantities.find(
                        q => q[KIT_QUANTITIES.kitFk] === item.id
                    ) || {}
                )[KIT_QUANTITIES.valueColumn] ?? null
            }))
        : []

    return (
        <div>

            <Section title="Version">
                <DataTable rows={[version]} />
            </Section>

            <Section title="Quantities">
                {quantities.length > 0 ? (
                    <ul className="list-disc pl-6 text-sm">
                        {quantities.map(row => (
                            <li key={row.id}>
                                {row[QUANTITIES.valueColumn]}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">No quantities.</p>
                )}
            </Section>

            <Section title="Components">
                <DataTable rows={components} empty="No components." />
            </Section>

            <Section title="Kit Build">
                {kitBuild ? (
                    <div className="flex flex-col gap-3">
                        <DataTable rows={[kitBuild]} />
                        <div>
                            <h5 className="font-medium mb-1 text-xs">
                                Kit Items
                            </h5>
                            <DataTable
                                rows={kitItemRows}
                                empty="No kit items."
                            />
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">
                        No kit build for this version.
                    </p>
                )}
            </Section>

        </div>
    )
}


function RfeListPage({ onEdit }) {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [data, setData] = useState({
        versions: [],
        quantities: [],
        components: [],
        componentQuantities: [],
        componentFinishing: [],
        kitBuilds: [],
        kitItems: [],
        kitQuantities: [],
        childRows: {}
    })

    // rfe_id -> expanded?  and  rfe_id -> chosen version id
    const [expanded, setExpanded] = useState(() => new Set())
    const [versionChoice, setVersionChoice] = useState({})

    useEffect(() => {

        let cancelled = false

        async function load() {

            setLoading(true)
            setError("")

            const fixed = [
                supabase.from(VERSION.table).select("*"),
                supabase.from(QUANTITIES.table).select("*"),
                supabase.from(COMPONENTS.table).select("*"),
                supabase.from(COMPONENT_QUANTITIES.table).select("*"),
                supabase.from(COMPONENT_FINISHING.table).select("*"),
                supabase.from(KIT_BUILDS.table).select("*"),
                supabase.from(KIT_ITEMS.table).select("*"),
                supabase.from(KIT_QUANTITIES.table).select("*")
            ]

            const childQueries = CHILD_STEPS.map(step =>
                supabase.from(step.db.table).select("*")
            )

            const results = await Promise.all([...fixed, ...childQueries])
            const failed = results.find(result => result.error)

            if (cancelled) {
                return
            }

            if (failed) {
                setError(failed.error.message)
                setLoading(false)
                return
            }

            const rows = results.map(result => result.data || [])

            const [
                versions,
                quantities,
                components,
                componentQuantities,
                componentFinishing,
                kitBuilds,
                kitItems,
                kitQuantities
            ] = rows

            const childRows = {}
            CHILD_STEPS.forEach((step, i) => {
                childRows[step.db.table] = rows[fixed.length + i]
            })

            setData({
                versions,
                quantities,
                components,
                componentQuantities,
                componentFinishing,
                kitBuilds,
                kitItems,
                kitQuantities,
                childRows
            })
            setLoading(false)
        }

        load()

        return () => {
            cancelled = true
        }
    }, [])

    // All versions of one RFE, newest first.
    const versionsByRfe = useMemo(() => {

        const map = new Map()

        for (const version of data.versions) {
            const key = version[VERSION.fk]
            if (!map.has(key)) {
                map.set(key, [])
            }
            map.get(key).push(version)
        }

        for (const list of map.values()) {
            list.sort(
                (a, b) =>
                    Number(b.version_number || 0) -
                    Number(a.version_number || 0)
            )
        }

        return map
    }, [data.versions])

    // Latest version per RFE, for the main table (newest RFE first).
    const latestVersions = useMemo(
        () =>
            [...versionsByRfe.values()]
                .map(list => list[0])
                .sort((a, b) =>
                    String(b.created_at || "").localeCompare(
                        String(a.created_at || "")
                    )
                ),
        [versionsByRfe]
    )

    const columns = useMemo(
        () => columnsOf(latestVersions),
        [latestVersions]
    )

    if (loading) {
        return <p className="p-4">Loading RFEs…</p>
    }

    if (error) {
        return (
            <p className="p-4 text-red-700">
                Error loading RFEs: {error}
            </p>
        )
    }

    function toggle(rfeId) {
        setExpanded(prev => {
            const next = new Set(prev)
            if (next.has(rfeId)) {
                next.delete(rfeId)
            } else {
                next.add(rfeId)
            }
            return next
        })
    }

    function handleEdit(version) {

        const childRowsByTable = {}

        for (const step of CHILD_STEPS) {
            const fk = step.db.fk || "version_id"
            childRowsByTable[step.db.table] = (
                data.childRows[step.db.table] || []
            ).find(row => row[fk] === version.id)
        }

        const formData = buildFormDataFromVersion({
            config: FORM_CONFIG,
            version,
            quantities: data.quantities,
            components: data.components,
            componentQuantities: data.componentQuantities,
            componentFinishing: data.componentFinishing,
            kitBuilds: data.kitBuilds,
            kitItems: data.kitItems,
            kitQuantities: data.kitQuantities,
            childRowsByTable
        })

        onEdit({ rfeId: version[VERSION.fk], formData })
    }

    if (latestVersions.length === 0) {
        return (
            <div className="p-4">
                <h2 className="text-lg font-semibold mb-3">All RFEs</h2>
                <p className="text-sm text-gray-500">
                    No RFEs have been submitted yet.
                </p>
            </div>
        )
    }

    return (
        <div className="p-4">

            <h2 className="text-lg font-semibold mb-3">
                All RFEs ({latestVersions.length})
            </h2>

            <div className="overflow-x-auto border border-gray-200 rounded-md">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-3 py-2" />
                            <th className="px-3 py-2" />
                            {columns.map(column => (
                                <th
                                    key={column}
                                    className="px-3 py-2 text-left font-semibold whitespace-nowrap"
                                >
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {latestVersions.map(latest => {

                            const rfeId = latest[VERSION.fk]
                            const isOpen = expanded.has(rfeId)
                            const versions = versionsByRfe.get(rfeId) || [latest]

                            const chosenId = String(
                                versionChoice[rfeId] ?? latest.id
                            )
                            const selectedVersion =
                                versions.find(
                                    v => String(v.id) === chosenId
                                ) || latest

                            return (
                                <Fragment key={rfeId}>

                                    <tr className="border-t border-gray-200">
                                        <td className="px-3 py-2 align-top">
                                            <button
                                                type="button"
                                                onClick={() => toggle(rfeId)}
                                                aria-label={
                                                    isOpen ? "Collapse" : "Expand"
                                                }
                                                className="w-6 h-6 rounded border border-gray-300 bg-white hover:bg-gray-50"
                                            >
                                                {isOpen ? "▾" : "▸"}
                                            </button>
                                        </td>
                                        <td className="px-3 py-2 align-top">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(latest)}
                                                className="px-3 py-1 text-xs rounded-md border border-gray-300 bg-white hover:bg-gray-50 whitespace-nowrap"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                        {columns.map(column => (
                                            <td
                                                key={column}
                                                className="px-3 py-2 align-top whitespace-nowrap"
                                            >
                                                {renderCell(latest[column])}
                                            </td>
                                        ))}
                                    </tr>

                                    {isOpen && (
                                        <tr>
                                            <td
                                                colSpan={columns.length + 2}
                                                className="px-4 py-4 bg-gray-50 border-t border-gray-200"
                                            >
                                                <div className="flex flex-wrap items-end gap-3 mb-2">
                                                    <label className="flex flex-col text-sm">
                                                        <span className="font-medium mb-1">
                                                            Version
                                                        </span>
                                                        <select
                                                            className="border border-gray-300 rounded-md px-3 py-2"
                                                            value={chosenId}
                                                            onChange={event =>
                                                                setVersionChoice(
                                                                    prev => ({
                                                                        ...prev,
                                                                        [rfeId]:
                                                                            event
                                                                                .target
                                                                                .value
                                                                    })
                                                                )
                                                            }
                                                        >
                                                            {versions.map(
                                                                (v, i) => (
                                                                    <option
                                                                        key={v.id}
                                                                        value={v.id}
                                                                    >
                                                                        v
                                                                        {v.version_number ??
                                                                            "?"}
                                                                        {i === 0
                                                                            ? " (latest)"
                                                                            : ""}
                                                                    </option>
                                                                )
                                                            )}
                                                        </select>
                                                    </label>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                selectedVersion
                                                            )
                                                        }
                                                        className="px-3 py-2 text-xs rounded-md border border-gray-300 bg-white hover:bg-gray-50"
                                                    >
                                                        Edit this version
                                                    </button>
                                                </div>

                                                <VersionDetails
                                                    version={selectedVersion}
                                                    data={data}
                                                />
                                            </td>
                                        </tr>
                                    )}

                                </Fragment>
                            )
                        })}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default RfeListPage
