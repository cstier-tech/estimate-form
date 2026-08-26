import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import NewestForm from "./NewestForm"

function ProjectViewer({ onEdit }) {
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [showForm, setShowForm] = useState(false)
    const [editingProject, setEditingProject] = useState(null)

    useEffect(() => {
        fetchProjects()
    }, [])

    async function fetchProjects() {
        setLoading(true)
        setError("")

        try {
            const [
                projectsResult,
                versionsResult,
                projectQuantitiesResult,
                componentsResult,
                componentQuantitiesResult,
                componentFinishingResult,
                kitsResult,
                kitQuantitiesResult,
                mailingResult
            ] = await Promise.all([
                // =====================================================
                // PARENT PROJECTS
                // =====================================================
                supabase
                    .from("Projects")
                    .select("*")
                    .order("created_at", {
                        ascending: false
                    }),

                // =====================================================
                // PROJECT VERSIONS
                // =====================================================
                supabase
                    .from("Project Versions")
                    .select("*")
                    .order("version_number", {
                        ascending: false
                    }),

                // =====================================================
                // PROJECT QUANTITIES
                // =====================================================
                supabase
                    .from("Project Quantities")
                    .select("*"),

                // =====================================================
                // COMPONENTS
                // =====================================================
                supabase
                    .from("Components")
                    .select("*"),

                // =====================================================
                // COMPONENT QUANTITIES
                // =====================================================
                supabase
                    .from("Component Quantities")
                    .select("*"),

                // =====================================================
                // COMPONENT FINISHING
                // =====================================================
                supabase
                    .from("Component Finishing")
                    .select("*"),

                // =====================================================
                // KITS
                // =====================================================
                supabase
                    .from("Kits")
                    .select("*"),

                // =====================================================
                // KIT QUANTITIES
                // =====================================================
                supabase
                    .from("Kit Quantities")
                    .select("*"),

                // =====================================================
                // MAILING
                // =====================================================
                supabase
                    .from("Mailing")
                    .select("*")
            ])

            // =====================================================
            // ERROR HANDLING
            // =====================================================

            if (projectsResult.error) {
                throw projectsResult.error
            }

            if (versionsResult.error) {
                throw versionsResult.error
            }

            if (projectQuantitiesResult.error) {
                throw projectQuantitiesResult.error
            }

            if (componentsResult.error) {
                throw componentsResult.error
            }

            if (componentQuantitiesResult.error) {
                throw componentQuantitiesResult.error
            }

            if (componentFinishingResult.error) {
                throw componentFinishingResult.error
            }

            if (kitsResult.error) {
                throw kitsResult.error
            }

            if (kitQuantitiesResult.error) {
                throw kitQuantitiesResult.error
            }

            if (mailingResult.error) {
                throw mailingResult.error
            }

            const projectsData =
                projectsResult.data || []

            const versionsData =
                versionsResult.data || []

            const projectQuantitiesData =
                projectQuantitiesResult.data || []

            const componentsData =
                componentsResult.data || []

            const componentQuantitiesData =
                componentQuantitiesResult.data || []

            const componentFinishingData =
                componentFinishingResult.data || []

            const kitsData =
                kitsResult.data || []

            const kitQuantitiesData =
                kitQuantitiesResult.data || []

            const mailingData =
                mailingResult.data || []

            // =====================================================
            // BUILD PROJECT DATA
            // =====================================================

            const projectsWithDetails =
                projectsData.map(project => {

                    // -------------------------------------------------
                    // GET ALL VERSIONS FOR THIS PROJECT
                    // -------------------------------------------------

                    const projectVersions =
                        versionsData
                            .filter(
                                version =>
                                    version.project_id ===
                                    project.id
                            )
                            .sort(
                                (a, b) =>
                                    Number(
                                        b.version_number
                                    ) -
                                    Number(
                                        a.version_number
                                    )
                            )

                    // -------------------------------------------------
                    // MOST RECENT VERSION
                    // -------------------------------------------------

                    const latestVersion =
                        projectVersions[0] || null

                    // -------------------------------------------------
                    // NO VERSION YET
                    // -------------------------------------------------

                    if (!latestVersion) {
                        return {
                            ...project,

                            version_id: null,
                            version_number: null,

                            client_name: "",
                            customer_number: "",
                            project_name: "",
                            project_description: "",
                            due_date: null,
                            sales_rep: "",
                            previous_job_number: "",
                            previous_estimate_number: "",
                            job_type: "",
                            service_types: [],

                            projectQuantities: [],
                            components: [],
                            kits: [],
                            mailing: null,

                            versions: []
                        }
                    }

                    // -------------------------------------------------
                    // LATEST VERSION ID
                    // -------------------------------------------------

                    const versionId =
                        latestVersion.id

                    // =================================================
                    // PROJECT QUANTITIES
                    // =================================================

                    const projectQuantities =
                        projectQuantitiesData.filter(
                            quantity =>
                                quantity.version_id ===
                                versionId
                        )

                    // =================================================
                    // COMPONENTS
                    // =================================================

                    const components =
                        componentsData
                            .filter(
                                component =>
                                    component.version_id ===
                                    versionId
                            )
                            .map(component => ({
                                ...component,

                                quantities:
                                    componentQuantitiesData.filter(
                                        quantity =>
                                            quantity.component_id ===
                                            component.id
                                    ),

                                finishingOps:
                                    componentFinishingData.filter(
                                        finishing =>
                                            finishing.component_id ===
                                            component.id
                                    )
                            }))

                    // =================================================
                    // KITS
                    // =================================================

                    const kits =
                        kitsData
                            .filter(
                                kit =>
                                    kit.version_id ===
                                    versionId
                            )
                            .map(kit => ({
                                ...kit,

                                quantities:
                                    kitQuantitiesData.filter(
                                        quantity =>
                                            quantity.kit_id ===
                                            kit.id
                                    )
                            }))

                    // =================================================
                    // MAILING
                    // =================================================

                    const mailing =
                        mailingData.find(
                            mailing =>
                                mailing.version_id ===
                                versionId
                        ) || null

                    // =================================================
                    // RETURN PROJECT
                    // =================================================

                    return {
                        // Parent project information
                        ...project,

                        // Latest version information
                        version_id:
                            latestVersion.id,

                        version_number:
                            latestVersion.version_number,

                        client_name:
                            latestVersion.client_name,

                        customer_number:
                            latestVersion.customer_number,

                        project_name:
                            latestVersion.project_name,

                        project_description:
                            latestVersion.project_description,

                        due_date:
                            latestVersion.due_date,

                        sales_rep:
                            latestVersion.sales_rep,

                        previous_job_number:
                            latestVersion.previous_job_number,

                        previous_estimate_number:
                            latestVersion.previous_estimate_number,

                        job_type:
                            latestVersion.job_type,

                        service_types:
                            latestVersion.service_types,

                        // Latest version children
                        projectQuantities,

                        components,

                        kits,

                        mailing,

                        // Complete version history
                        versions:
                            projectVersions
                    }
                })

            setProjects(
                projectsWithDetails
            )
        } catch (error) {
            console.error(
                "PROJECT FETCH ERROR:",
                error
            )

            setError(
                error.message
            )
        } finally {
            setLoading(false)
        }
    }

    // =====================================================
    // FORMAT SERVICE TYPES
    // =====================================================

    function formatServiceTypes(serviceTypes) {
        if (!serviceTypes) {
            return ""
        }

        let services = serviceTypes

        // Supabase may return JSON as a string
        if (typeof services === "string") {
            try {
                services = JSON.parse(
                    services
                )
            } catch (error) {
                console.error(
                    "Could not parse service_types:",
                    error
                )

                return ""
            }
        }

        if (!Array.isArray(services)) {
            return ""
        }

        return services
            .map(service => {
                if (
                    typeof service ===
                    "string"
                ) {
                    return service
                }

                return (
                    service?.value ||
                    ""
                )
            })
            .filter(Boolean)
            .join(", ")
    }

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <p>
                Loading projects...
            </p>
        )
    }

    // =====================================================
    // ERROR
    // =====================================================

    if (error) {
        return (
            <p className="text-red-600">
                Error loading projects:{" "}
                {error}
            </p>
        )
    }

    // =====================================================
    // FORM
    // =====================================================

    if (showForm) {
        return (
            <div className="mx-auto max-w-3xl">
                <NewestForm
                    projectToEdit={
                        editingProject
                    }

                    onSaved={() => {
                        setShowForm(false)
                        setEditingProject(null)
                        fetchProjects()
                    }}

                    onCancel={() => {
                        setShowForm(false)
                        setEditingProject(null)
                        fetchProjects()
                    }}
                />
            </div>
        )
    }

    // =====================================================
    // PROJECT TABLE
    // =====================================================

    return (
        <div className="overflow-x-auto">

            {/* =================================================
                NEW PROJECT BUTTON
            ================================================= */}

            <button
                type="button"
                onClick={() => {
                    setEditingProject(null)
                    setShowForm(true)
                }}
                className="mb-4 rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
                + New Project
            </button>

            <table className="w-full border-collapse border border-gray-300 rounded-md bg-white">

                <caption className="sr-only">
                    All Projects
                </caption>

                {/* =================================================
                    TABLE HEADER
                ================================================= */}

                <thead>
                    <tr className="bg-gray-100">

                        <th
                            scope="col"
                            className="border border-gray-300 px-4 py-2"
                        >
                            Project
                        </th>

                        <th
                            scope="col"
                            className="border border-gray-300 px-4 py-2"
                        >
                            Version
                        </th>

                        <th
                            scope="col"
                            className="border border-gray-300 px-4 py-2"
                        >
                            Client
                        </th>

                        <th
                            scope="col"
                            className="border border-gray-300 px-4 py-2"
                        >
                            Customer #
                        </th>

                        <th
                            scope="col"
                            className="border border-gray-300 px-4 py-2"
                        >
                            Due Date
                        </th>

                        <th
                            scope="col"
                            className="border border-gray-300 px-4 py-2"
                        >
                            Sales Rep
                        </th>

                        <th
                            scope="col"
                            className="border border-gray-300 px-4 py-2"
                        >
                            Job Type
                        </th>

                        <th
                            scope="col"
                            className="border border-gray-300 px-4 py-2"
                        >
                            Services
                        </th>

                        <th
                            scope="col"
                            className="border border-gray-300 px-4 py-2"
                        >
                            Details
                        </th>

                        <th
                            scope="col"
                            className="border border-gray-300 px-4 py-2"
                        >
                            Actions
                        </th>

                    </tr>
                </thead>

                {/* =================================================
                    TABLE BODY
                ================================================= */}

                <tbody>

                    {projects.length === 0 ? (

                        <tr>

                            <td
                                colSpan="10"
                                className="border border-gray-300 px-4 py-6 text-center"
                            >
                                No projects found.
                            </td>

                        </tr>

                    ) : (

                        projects.map(project => (

                            <tr key={project.id}>

                                {/* =================================
                                    PROJECT
                                ================================= */}

                                <td className="border border-gray-300 px-4 py-2">

                                    {project.project_name}

                                </td>

                                {/* =================================
                                    VERSION
                                ================================= */}

                                <td className="border border-gray-300 px-4 py-2">

                                    {project.version_number
                                        ? `v${project.version_number}`
                                        : "No version"}

                                </td>

                                {/* =================================
                                    CLIENT
                                ================================= */}

                                <td className="border border-gray-300 px-4 py-2">

                                    {project.client_name}

                                </td>

                                {/* =================================
                                    CUSTOMER NUMBER
                                ================================= */}

                                <td className="border border-gray-300 px-4 py-2">

                                    {project.customer_number}

                                </td>

                                {/* =================================
                                    DUE DATE
                                ================================= */}

                                <td className="border border-gray-300 px-4 py-2">

                                    {project.due_date
                                        ? new Date(
                                            project.due_date
                                        ).toLocaleDateString()
                                        : ""}

                                </td>

                                {/* =================================
                                    SALES REP
                                ================================= */}

                                <td className="border border-gray-300 px-4 py-2">

                                    {project.sales_rep}

                                </td>

                                {/* =================================
                                    JOB TYPE
                                ================================= */}

                                <td className="border border-gray-300 px-4 py-2">

                                    {project.job_type}

                                </td>

                                {/* =================================
                                    SERVICES
                                ================================= */}

                                <td className="border border-gray-300 px-4 py-2">

                                    {formatServiceTypes(
                                        project.service_types
                                    )}

                                </td>

                                {/* =================================
                                    DETAILS
                                ================================= */}

                                <td className="border border-gray-300 px-4 py-2">

                                    <details>

                                        <summary className="cursor-pointer font-medium">
                                            View Details
                                        </summary>

                                        <div className="mt-4 space-y-6">

                                            {/* =================================
                                                PROJECT QUANTITIES
                                            ================================= */}

                                            <section>

                                                <h3 className="mb-2 font-semibold">
                                                    Quantities to Quote
                                                </h3>

                                                {project.projectQuantities.length === 0 ? (

                                                    <p className="text-gray-500">
                                                        No quantities.
                                                    </p>

                                                ) : (

                                                    <div className="flex flex-wrap gap-2">

                                                        {project.projectQuantities.map(
                                                            quantity => (

                                                                <span
                                                                    key={
                                                                        quantity.id
                                                                    }
                                                                    className="rounded bg-gray-100 px-3 py-1"
                                                                >
                                                                    {
                                                                        quantity.quantity
                                                                    }
                                                                </span>

                                                            )
                                                        )}

                                                    </div>

                                                )}

                                            </section>

                                            {/* =================================
                                                COMPONENTS
                                            ================================= */}

                                            <section>

                                                <h3 className="mb-2 font-semibold">
                                                    Components
                                                </h3>

                                                {project.components.length === 0 ? (

                                                    <p className="text-gray-500">
                                                        No components.
                                                    </p>

                                                ) : (

                                                    <table className="w-full border-collapse border border-gray-300">

                                                        <caption className="sr-only">
                                                            Components for{" "}
                                                            {
                                                                project.project_name
                                                            }
                                                        </caption>

                                                        <thead>

                                                            <tr className="bg-sky-50">

                                                                <th
                                                                    scope="col"
                                                                    className="border border-gray-300 px-3 py-2 text-left"
                                                                >
                                                                    Component
                                                                </th>

                                                                <th
                                                                    scope="col"
                                                                    className="border border-gray-300 px-3 py-2 text-left"
                                                                >
                                                                    Size
                                                                </th>

                                                                <th
                                                                    scope="col"
                                                                    className="border border-gray-300 px-3 py-2 text-left"
                                                                >
                                                                    Flat Size
                                                                </th>

                                                                <th
                                                                    scope="col"
                                                                    className="border border-gray-300 px-3 py-2 text-left"
                                                                >
                                                                    Stock
                                                                </th>

                                                                <th
                                                                    scope="col"
                                                                    className="border border-gray-300 px-3 py-2 text-left"
                                                                >
                                                                    Coating
                                                                </th>

                                                            </tr>

                                                        </thead>

                                                        <tbody>

                                                            {project.components.map(
                                                                component => (

                                                                    <tr
                                                                        key={
                                                                            component.id
                                                                        }
                                                                    >

                                                                        <td className="border border-gray-300 px-3 py-2">
                                                                            {
                                                                                component.component_name
                                                                            }
                                                                        </td>

                                                                        <td className="border border-gray-300 px-3 py-2">
                                                                            {
                                                                                component.size
                                                                            }
                                                                        </td>

                                                                        <td className="border border-gray-300 px-3 py-2">
                                                                            {
                                                                                component.flat_size
                                                                            }
                                                                        </td>

                                                                        <td className="border border-gray-300 px-3 py-2">
                                                                            {
                                                                                component.stock
                                                                            }
                                                                        </td>

                                                                        <td className="border border-gray-300 px-3 py-2">
                                                                            {
                                                                                component.coating
                                                                            }
                                                                        </td>

                                                                    </tr>

                                                                )
                                                            )}

                                                        </tbody>

                                                    </table>

                                                )}

                                            </section>

                                            {/* =================================
                                                KITS
                                            ================================= */}

                                            <section>

                                                <h3 className="mb-2 font-semibold">
                                                    Kits
                                                </h3>

                                                {project.kits.length === 0 ? (

                                                    <p className="text-gray-500">
                                                        No kits.
                                                    </p>

                                                ) : (

                                                    <table className="w-full border-collapse border border-gray-300">

                                                        <caption className="sr-only">
                                                            Kits for{" "}
                                                            {
                                                                project.project_name
                                                            }
                                                        </caption>

                                                        <thead>

                                                            <tr className="bg-sky-50">

                                                                <th
                                                                    scope="col"
                                                                    className="border border-gray-300 px-3 py-2 text-left"
                                                                >
                                                                    Kit
                                                                </th>

                                                                <th
                                                                    scope="col"
                                                                    className="border border-gray-300 px-3 py-2 text-left"
                                                                >
                                                                    Source
                                                                </th>

                                                                <th
                                                                    scope="col"
                                                                    className="border border-gray-300 px-3 py-2 text-left"
                                                                >
                                                                    Overage Action
                                                                </th>

                                                            </tr>

                                                        </thead>

                                                        <tbody>

                                                            {project.kits.map(
                                                                kit => (

                                                                    <tr
                                                                        key={
                                                                            kit.id
                                                                        }
                                                                    >

                                                                        <td className="border border-gray-300 px-3 py-2">
                                                                            {
                                                                                kit.kit_name
                                                                            }
                                                                        </td>

                                                                        <td className="border border-gray-300 px-3 py-2">
                                                                            {
                                                                                kit.source
                                                                            }
                                                                        </td>

                                                                        <td className="border border-gray-300 px-3 py-2">
                                                                            {
                                                                                kit.overage_action
                                                                            }
                                                                        </td>

                                                                    </tr>

                                                                )
                                                            )}

                                                        </tbody>

                                                    </table>

                                                )}

                                            </section>

                                            {/* =================================
                                                MAILING
                                            ================================= */}

                                            {project.mailing && (

                                                <section>

                                                    <h3 className="mb-2 font-semibold">
                                                        Mailing
                                                    </h3>

                                                    <div className="rounded border border-gray-300 p-3">

                                                        <p>
                                                            <strong>
                                                                Class of Mail:
                                                            </strong>{" "}
                                                            {
                                                                project.mailing.class_of_mail
                                                            }
                                                        </p>

                                                        <p>
                                                            <strong>
                                                                Indicia:
                                                            </strong>{" "}
                                                            {
                                                                project.mailing.indicia
                                                            }
                                                        </p>

                                                        <p>
                                                            <strong>
                                                                Payment Method:
                                                            </strong>{" "}
                                                            {
                                                                project.mailing.payment_method
                                                            }
                                                        </p>

                                                        <p>
                                                            <strong>
                                                                Permit Type:
                                                            </strong>{" "}
                                                            {
                                                                project.mailing.permit_type
                                                            }
                                                        </p>

                                                        <p>
                                                            <strong>
                                                                Nonprofit Authorization:
                                                            </strong>{" "}
                                                            {
                                                                project.mailing.nonprofit_auth
                                                            }
                                                        </p>

                                                        <p>
                                                            <strong>
                                                                Mailing From:
                                                            </strong>{" "}
                                                            {
                                                                project.mailing.mailing_from
                                                            }
                                                        </p>

                                                        <p>
                                                            <strong>
                                                                Permit Owner:
                                                            </strong>{" "}
                                                            {
                                                                project.mailing.permit_owner
                                                            }
                                                        </p>

                                                        <p>
                                                            <strong>
                                                                Exact Company Name:
                                                            </strong>{" "}
                                                            {
                                                                project.mailing.exact_company_name
                                                            }
                                                        </p>

                                                        <p>
                                                            <strong>
                                                                Exact Company Address:
                                                            </strong>{" "}
                                                            {
                                                                project.mailing.exact_company_address
                                                            }
                                                        </p>

                                                    </div>

                                                </section>

                                            )}

                                            {/* =================================
                                                VERSION HISTORY
                                            ================================= */}

                                            <section>

                                                <h3 className="mb-2 font-semibold">
                                                    Version History
                                                </h3>

                                                {project.versions.length === 0 ? (

                                                    <p className="text-gray-500">
                                                        No versions.
                                                    </p>

                                                ) : (

                                                    <table className="w-full border-collapse border border-gray-300">

                                                        <caption className="sr-only">
                                                            Version history for{" "}
                                                            {
                                                                project.project_name
                                                            }
                                                        </caption>

                                                        <thead>

                                                            <tr className="bg-sky-50">

                                                                <th
                                                                    scope="col"
                                                                    className="border border-gray-300 px-3 py-2 text-left"
                                                                >
                                                                    Version
                                                                </th>

                                                                <th
                                                                    scope="col"
                                                                    className="border border-gray-300 px-3 py-2 text-left"
                                                                >
                                                                    Created
                                                                </th>

                                                            </tr>

                                                        </thead>

                                                        <tbody>

                                                            {project.versions.map(
                                                                version => (

                                                                    <tr
                                                                        key={
                                                                            version.id
                                                                        }
                                                                    >

                                                                        <td className="border border-gray-300 px-3 py-2">

                                                                            v
                                                                            {
                                                                                version.version_number
                                                                            }

                                                                            {version.id ===
                                                                                project.version_id && (
                                                                                    <span className="ml-2 text-sm font-medium text-blue-600">
                                                                                        Current
                                                                                    </span>
                                                                                )}

                                                                        </td>

                                                                        <td className="border border-gray-300 px-3 py-2">

                                                                            {version.created_at
                                                                                ? new Date(
                                                                                    version.created_at
                                                                                ).toLocaleString()
                                                                                : ""}

                                                                        </td>

                                                                    </tr>

                                                                )
                                                            )}

                                                        </tbody>

                                                    </table>

                                                )}

                                            </section>

                                        </div>

                                    </details>

                                </td>

                                {/* =================================
                                    ACTIONS
                                ================================= */}

                                <td className="border border-gray-300 px-4 py-2">

                                    <button
                                        type="button"
                                        onClick={() => {

                                            if (onEdit) {
                                                onEdit(project)
                                                return
                                            }

                                            setEditingProject(
                                                project
                                            )

                                            setShowForm(
                                                true
                                            )
                                        }}
                                        className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                                    >
                                        Edit
                                    </button>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>
    )
}

export default ProjectViewer