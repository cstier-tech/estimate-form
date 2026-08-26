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
                componentsResult,
                kitsResult,
                versionsResult,
                projectQuantitiesResult,
                versionQuantitiesResult,
                componentQuantitiesResult,
                componentFinishingResult,
                kitQuantitiesResult,
                mailingResult
            ] = await Promise.all([
                supabase
                    .from("Projects")
                    .select("*")
                    .order("created_at", { ascending: false }),

                supabase
                    .from("Components")
                    .select("*"),

                supabase
                    .from("Kits")
                    .select("*"),

                supabase
                    .from("Versions")
                    .select("*"),

                supabase
                    .from("Project Quantities")
                    .select("*"),

                supabase
                    .from("Version Quantities")
                    .select("*"),

                supabase
                    .from("Component Quantities")
                    .select("*"),

                supabase
                    .from("Component Finishing")
                    .select("*"),

                supabase
                    .from("Kit Quantities")
                    .select("*"),

                supabase
                    .from("Mailing")
                    .select("*")
            ])

            if (projectsResult.error) throw projectsResult.error
            if (componentsResult.error) throw componentsResult.error
            if (kitsResult.error) throw kitsResult.error
            if (versionsResult.error) throw versionsResult.error
            if (projectQuantitiesResult.error) throw projectQuantitiesResult.error
            if (versionQuantitiesResult.error) throw versionQuantitiesResult.error
            if (componentQuantitiesResult.error) throw componentQuantitiesResult.error
            if (componentFinishingResult.error) throw componentFinishingResult.error
            if (kitQuantitiesResult.error) throw kitQuantitiesResult.error
            if (mailingResult.error) throw mailingResult.error

            const projectsData = projectsResult.data || []
            const componentsData = componentsResult.data || []
            const kitsData = kitsResult.data || []
            const versionsData = versionsResult.data || []
            const projectQuantitiesData = projectQuantitiesResult.data || []
            const versionQuantitiesData = versionQuantitiesResult.data || []
            const componentQuantitiesData = componentQuantitiesResult.data || []
            const componentFinishingData = componentFinishingResult.data || []
            const kitQuantitiesData = kitQuantitiesResult.data || []
            const mailingData = mailingResult.data || []

            const projectsWithDetails = projectsData.map(project => {
                const components = componentsData
                    .filter(component =>
                        component.project_id === project.id
                    )
                    .map(component => ({
                        ...component,

                        quantities: componentQuantitiesData
                            .filter(quantity =>
                                quantity.component_id === component.id
                            ),

                        finishingOps: componentFinishingData
                            .filter(finishing =>
                                finishing.component_id === component.id
                            )
                    }))

                const kits = kitsData
                    .filter(kit =>
                        kit.project_id === project.id
                    )
                    .map(kit => ({
                        ...kit,

                        quantities: kitQuantitiesData
                            .filter(quantity =>
                                quantity.kit_id === kit.id
                            )
                    }))

                const versions = versionsData
                    .filter(version =>
                        version.project_id === project.id
                    )
                    .map(version => ({
                        ...version,

                        quantities: versionQuantitiesData
                            .filter(quantity =>
                                quantity.version_id === version.id
                            )
                    }))

                return {
                    ...project,

                    components,
                    kits,
                    versions,

                    projectQuantities: projectQuantitiesData.filter(
                        quantity =>
                            quantity.project_id === project.id
                    ),

                    mailing: mailingData.find(
                        mailing =>
                            mailing.project_id === project.id
                    ) || null
                }
            })

            setProjects(projectsWithDetails)

        } catch (error) {
            console.error("PROJECT FETCH ERROR:", error)
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    function formatServiceTypes(serviceTypes) {
        if (!serviceTypes) {
            return ""
        }

        let services = serviceTypes

        // If Supabase returned JSON as a string, parse it
        if (typeof services === "string") {
            try {
                services = JSON.parse(services)
            } catch (error) {
                console.error("Could not parse service_types:", error)
                return ""
            }
        }

        if (!Array.isArray(services)) {
            return ""
        }

        return services
            .map((service) => {
                if (typeof service === "string") {
                    return service
                }

                return service?.value || ""
            })
            .filter(Boolean)
            .join(", ")
    }

    if (loading) {
        return <p>Loading projects...</p>
    }

    if (error) {
        return (
            <p className="text-red-600">
                Error loading projects: {error}
            </p>
        )
    }
    if (showForm) {
        return (
            <div className='mx-auto max-w-3xl'>
                <NewestForm
                    project={editingProject}
                    onCancel={() => {
                        setShowForm(false)
                        setEditingProject(null)
                        fetchProjects()
                    }}
                />
            </div>
        )
    }
    return (

        <div className="overflow-x-auto">
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
            <table className="w-full border-collapse border border-gray-300 bg-white rounded-md">
                <caption className="sr-only">
                    All Projects
                </caption>

                <thead>
                    <tr className="bg-gray-100">
                        <th scope="col" className="border border-gray-300 px-4 py-2">
                            Project
                        </th>

                        <th scope="col" className="border border-gray-300 px-4 py-2">
                            Client
                        </th>

                        <th scope="col" className="border border-gray-300 px-4 py-2">
                            Customer #
                        </th>

                        <th scope="col" className="border border-gray-300 px-4 py-2">
                            Due Date
                        </th>

                        <th scope="col" className="border border-gray-300 px-4 py-2">
                            Sales Rep
                        </th>

                        <th scope="col" className="border border-gray-300 px-4 py-2">
                            Job Type
                        </th>

                        <th scope="col" className="border border-gray-300 px-4 py-2">
                            Services
                        </th>

                        <th scope="col" className="border border-gray-300 px-4 py-2">
                            Details
                        </th>

                        <th scope="col" className="border border-gray-300 px-4 py-2">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {projects.length === 0 ? (
                        <tr>
                            <td
                                colSpan="9"
                                className="border border-gray-300 px-4 py-6 text-center"
                            >
                                No projects found.
                            </td>
                        </tr>
                    ) : (
                        projects.map((project) => (
                            <tr key={project.id}>
                                <td className="border border-gray-300 px-4 py-2">
                                    {project.project_name}
                                </td>

                                <td className="border border-gray-300 px-4 py-2">
                                    {project.client_name}
                                </td>

                                <td className="border border-gray-300 px-4 py-2">
                                    {project.customer_number}
                                </td>

                                <td className="border border-gray-300 px-4 py-2">
                                    {project.due_date
                                        ? new Date(
                                            project.due_date
                                        ).toLocaleDateString()
                                        : ""}
                                </td>

                                <td className="border border-gray-300 px-4 py-2">
                                    {project.sales_rep}
                                </td>

                                <td className="border border-gray-300 px-4 py-2">
                                    {project.job_type}
                                </td>

                                <td className="border border-gray-300 px-4 py-2">
                                    {formatServiceTypes(
                                        project.service_types
                                    )}
                                </td>

                                <td className="border border-gray-300 px-4 py-2">
                                    <details>
                                        <summary className="cursor-pointer font-medium">
                                            View Details
                                        </summary>

                                        <div className="mt-4 space-y-6">

                                            {/* COMPONENTS */}
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
                                                            {project.project_name}
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
                                                                (component) => (
                                                                    <tr key={component.id}>
                                                                        <td className="border border-gray-300 px-3 py-2">
                                                                            {component.component_name}
                                                                        </td>

                                                                        <td className="border border-gray-300 px-3 py-2">
                                                                            {component.size}
                                                                        </td>

                                                                        <td className="border border-gray-300 px-3 py-2">
                                                                            {component.flat_size}
                                                                        </td>

                                                                        <td className="border border-gray-300 px-3 py-2">
                                                                            {component.stock}
                                                                        </td>

                                                                        <td className="border border-gray-300 px-3 py-2">
                                                                            {component.coating}
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                        </tbody>
                                                    </table>
                                                )}
                                            </section>

                                            {/* KITS */}
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
                                                            {project.project_name}
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
                                                            {project.kits.map((kit) => (
                                                                <tr key={kit.id}>
                                                                    <td className="border border-gray-300 px-3 py-2">
                                                                        {kit.kit_name}
                                                                    </td>

                                                                    <td className="border border-gray-300 px-3 py-2">
                                                                        {kit.source}
                                                                    </td>

                                                                    <td className="border border-gray-300 px-3 py-2">
                                                                        {kit.overage_action}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                )}
                                            </section>

                                            {/* VERSIONS */}
                                            <section>
                                                <h3 className="mb-2 font-semibold">
                                                    Versions
                                                </h3>

                                                {project.versions.length === 0 ? (
                                                    <p className="text-gray-500">
                                                        No versions.
                                                    </p>
                                                ) : (
                                                    <table className="w-full border-collapse border border-gray-300">
                                                        <caption className="sr-only">
                                                            Versions for{" "}
                                                            {project.project_name}
                                                        </caption>

                                                        <thead>
                                                            <tr className="bg-sky-50">
                                                                <th
                                                                    scope="col"
                                                                    className="border border-gray-300 px-3 py-2 text-left"
                                                                >
                                                                    Version
                                                                </th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            {project.versions.map(
                                                                (version) => (
                                                                    <tr key={version.id}>
                                                                        <td className="border border-gray-300 px-3 py-2">
                                                                            {version.version}
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
                                <td className="border border-gray-300 px-4 py-2">
                                    <button
                                        type="button"
                                        onClick={() => onEdit(project)}
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