import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"

import FormSection from "../components/FormSection"
import Quantities2 from "../form_sections/Quantities2"
import Button from "../components/Button"
import Versions2 from "../form_sections/Versions2"
import ProjectOverview from "../form_sections/ProjectOverview"
import CheckboxInput from "../components/CheckboxInput"
import ServiceType from "../form_sections/ServiceType"
import Components2 from "../form_sections/Components2"
import Kitting from "../form_sections/Kitting"
import Mailing from "../form_sections/Mailing"

function NewestForm({ projectToEdit = null, onSaved }) {

    // PROJECT OVERVIEW
    const [clientName, setClientName] = useState('Prefilled Client...')
    const [customerNumber, setCustomerNumber] = useState('Prefilled Number...')
    const [projName, setProjName] = useState('')
    const [projDesc, setProjDesc] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [salesRep, setSalesRep] = useState('Internal sales rep')
    const [prevJobNo, setPrevJobNo] = useState('')
    const [prevEstNo, setPrevEstNo] = useState('')
    const [jobType, setJobType] = useState('')

    // QUANTITIES TO QUOTE
    const [qtysToQuote, setQtysToQuote] = useState([''])
    const updateQtyToQuoteCount = () => {
        setQtysToQuote(prev =>
            [...prev, '']
        )
    }
    const updateQtyToQuoteVal = (index, v) => {
        setQtysToQuote(prev => (
            prev.map((qty, i) => (
                i === index ? v : qty
            )))
        )
    }
    const removeQtyToQuote = (qtyToQuoteIndex) => {
        setQtysToQuote(prev =>
            prev.filter((_, index) => index !== qtyToQuoteIndex)
        )
    }

    // VERSIONS
    const [versions, setVersions] = useState([])
    const addVersion = () => {
        setVersions(prev => (
            [...prev, {
                Version: '',
                quantities: ['']

            }]
        ))
    }
    const updateVersion = (index, field, value) => {
        setVersions(prev => (
            prev.map((version, i) => (
                i === index
                    ? {
                        ...version, [field]: value
                    }
                    : version
            ))
        ))
    }
    const updateVersionQtyCount = (versionIndex) => {
        setVersions(prev =>
            prev.map((version, i) =>
                i === versionIndex
                    ? {
                        ...version,
                        quantities: [...version.quantities, '']
                    } : version
            )
        )
    }
    const updateVersionQtyVal = (versionIndex, qtyIndex, value) => {
        setVersions(prev => (
            prev.map((version, i) => (
                i === versionIndex ?
                    {
                        ...version, quantities: version.quantities.map((qty, j) => (
                            j === qtyIndex ? value : qty
                        ))
                    } : version
            ))
        ))
    }
    const removeVersion = (versionIndex) => {
        setVersions(prev =>
            prev.filter((_, index) => index !== versionIndex)
        )
    }

    const [hasMultipleVersions, setHasMultipleVersions] = useState(false)
    const handleHasVersions = (e) => {
        if (!versions.length) {
            addVersion();
        }
        setHasMultipleVersions(e.target.checked)
    }

    //SERVICE TYPES
    const [serviceTypes, setServiceTypes] = useState([])
    const [isOtherType, setIsOtherType] = useState(false)
    const [otherServiceTypes, setOtherServiceTypes] = useState('')

    const handleServiceTypes = (e) => {
        const { checked, name } = e.target

        setServiceTypes(prev =>
            checked
                ? [...prev, name]
                : prev.filter(item => item !== name)
        )

        // Kitting was just turned on
        if (name === 'Kitting' && checked) {
            setKits(prev => {
                const existingComponentIds = new Set(
                    prev.map(kit => kit.componentId)
                )

                const newKits = components
                    .filter(component =>
                        component.saved &&
                        !existingComponentIds.has(component.id)
                    )
                    .map(component => ({
                        componentId: component.id,
                        source: 'component',
                        Kit: component.Component,
                        quantities: [...component.quantities],
                        OverageAction: ''
                    }))

                return [...prev, ...newKits]
            })
        }
    }

    // COMPONENTS / KITS
    const [components, setComponents] = useState([
        {
            id: crypto.randomUUID(),
            Component: '',
            Size: '',
            FlatSize: '',
            Stock: '',
            Coating: '',
            quantities: [''],
            saved: false,
            finishingOps: [],
            SameQty: false,
        }
    ])
    const addComponent = () => {
        setComponents(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                Component: '',
                Size: '',
                FlatSize: '',
                Stock: '',
                Coating: '',
                quantities: [''],
                saved: false,
                finishingOps: [],
                SameQty: false,
            }
        ])
    }
    const saveComponent = (index) => {
        const component = components[index]

        // FIRST SAVE
        if (!component.saved) {

            // Mark component as saved
            setComponents(prev =>
                prev.map((item, i) =>
                    i === index
                        ? { ...item, saved: true }
                        : item
                )
            )

            // Create the corresponding kit
            if (serviceTypes.includes('Kitting')) {
                setKits(prev => [
                    ...prev,
                    {
                        componentId: component.id,
                        source: 'component',
                        Kit: component.Component,
                        quantities: [...component.quantities],
                        OverageAction: ''
                    }
                ])
            }

            return
        }

        // RESAVE
        const confirmed = window.confirm(
            'This component has already been saved. Saving your changes will also update its kit. Do you want to continue?'
        )

        if (!confirmed) {
            return
        }

        // Update the component's saved state
        setComponents(prev =>
            prev.map((item, i) =>
                i === index
                    ? { ...item, saved: true }
                    : item
            )
        )

        // Update the corresponding kit
        if (serviceTypes.includes('Kitting')) {
            setKits(prev =>
                prev.map(kit =>
                    kit.componentId === component.id
                        ? {
                            ...kit,
                            Kit: component.Component
                        }
                        : kit
                )
            )
        }
    }
    const updateComponent = (index, field, value) => {
        setComponents(prev => (
            prev.map((component, i) => (
                i === index
                    ? {
                        ...component, [field]: value
                    }
                    : component
            ))
        ))
    }
    const updateComponentQtyCount = (componentIndex) => {
        setComponents(prev =>
            prev.map((component, i) =>
                i === componentIndex
                    ? {
                        ...component,
                        quantities: [...component.quantities, '']
                    } : component
            )
        )
    }
    const updateComponentQtyVal = (componentIndex, qtyIndex, value) => {
        setComponents(prev => (
            prev.map((component, i) => (
                i === componentIndex ?
                    {
                        ...component, quantities: component.quantities.map((qty, j) => (
                            j === qtyIndex ? value : qty
                        ))
                    } : component
            ))
        ))
    }
    const removeComponent = (componentIndex) => {
        setComponents(prev =>
            prev.filter((_, index) => index !== componentIndex)
        )
    }
    const removeComponentQty = (componentIndex, qtyIndex) => {
        setComponents(prev =>
            prev.map((component, i) =>
                i === componentIndex
                    ? {
                        ...component,
                        quantities: component.quantities.filter(
                            (_, j) => j !== qtyIndex
                        )
                    }
                    : component
            )
        )
    }
    const handleSameQty = (componentIndex, checked) => {
        setComponents(prev =>
            prev.map((component, i) =>
                i === componentIndex
                    ? {
                        ...component,
                        SameQty: checked,
                        quantities: checked
                            ? [...qtysToQuote]
                            : component.quantities
                    }
                    : component
            )
        )
    }

    useEffect(() => {
        setComponents(prev =>
            prev.map(component =>
                component.SameQty
                    ? {
                        ...component,
                        quantities: [...qtysToQuote]
                    }
                    : component
            )
        )
    }, [qtysToQuote])


    // KITTING
    const [kits, setKits] = useState([])

    const addKit = () => {
        setKits(prev => [
            ...prev,
            {
                source: 'manual',
                Kit: '',
                quantities: [''],
                OverageAction: ''
            }
        ])
    }
    const updateKit = (index, field, value) => {
        setKits(prev => (
            prev.map((kit, i) => (
                i === index
                    ? {
                        ...kit, [field]: value
                    }
                    : kit
            ))
        ))
    }
    const updateKitQtyCount = (kitIndex) => {
        setKits(prev =>
            prev.map((kit, i) =>
                i === kitIndex
                    ? {
                        ...kit,
                        quantities: [...kit.quantities, '']
                    } : kit
            )
        )
    }
    const updateKitQtyVal = (kitIndex, qtyIndex, value) => {
        setKits(prev => (
            prev.map((kit, i) => (
                i === kitIndex ?
                    {
                        ...kit, quantities: kit.quantities.map((qty, j) => (
                            j === qtyIndex ? value : qty
                        ))
                    } : kit
            ))
        ))
    }
    const removeKit = (kitIndex) => {
        setKits(prev =>
            prev.filter((_, index) => index !== kitIndex)
        )
    }
    const removeKitQty = (kitIndex, qtyIndex) => {
        setKits(prev =>
            prev.map((kit, i) =>
                i === kitIndex
                    ? {
                        ...kit,
                        quantities: kit.quantities.filter(
                            (_, j) => j !== qtyIndex
                        )
                    }
                    : kit
            )
        )
    }


    // FINISHING
    const handleComponentFinishingOps = (componentIndex, e) => {
        const { name, checked } = e.target

        setComponents(prev =>
            prev.map((component, i) => {
                if (i !== componentIndex) return component

                if (checked) {
                    return {
                        ...component,
                        finishingOps: [
                            ...component.finishingOps,
                            {
                                value: name,
                                details: {}
                            }
                        ]
                    }
                }

                return {
                    ...component,
                    finishingOps: component.finishingOps.filter(
                        op => op.value !== name
                    )
                }
            })
        )
    }
    const updateComponentFinishingOpDetail = (
        componentIndex,
        opValue,
        fieldName,
        value
    ) => {
        setComponents(prev =>
            prev.map((component, i) =>
                i === componentIndex
                    ? {
                        ...component,
                        finishingOps: component.finishingOps.map(op =>
                            op.value === opValue
                                ? {
                                    ...op,
                                    details: {
                                        ...op.details,
                                        [fieldName]: value
                                    }
                                }
                                : op
                        )
                    }
                    : component
            )
        )
    }


    // MAILING
    const [classOfMail, setClassOfMail] = useState('')
    const [indicia, setIndicia] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('')
    const [permitType, setPermitType] = useState('')
    const [nonprofitAuth, setNonprofitAuth] = useState('')
    const [mailingFrom, setMailingFrom] = useState('')
    const [permitOwner, setPermitOwner] = useState('')
    const [exactCompanyName, setExactCompanyName] = useState('')
    const [exactCompanyAddress, setExactCompanyAddress] = useState('')



    useEffect(() => {
        if (!projectToEdit) {
            return
        }

        // =====================================================
        // PROJECT
        // =====================================================

        setClientName(projectToEdit.client_name || "")
        setCustomerNumber(projectToEdit.customer_number || "")
        setProjName(projectToEdit.project_name || "")
        setProjDesc(projectToEdit.project_description || "")
        setDueDate(projectToEdit.due_date || "")
        setSalesRep(projectToEdit.sales_rep || "")
        setPrevJobNo(projectToEdit.previous_job_number || "")
        setPrevEstNo(projectToEdit.previous_estimate_number || "")
        setJobType(projectToEdit.job_type || "")
        setHasMultipleVersions(
            projectToEdit.has_multiple_versions || false
        )

        // =====================================================
        // SERVICE TYPES
        // =====================================================

        let savedServices = projectToEdit.service_types || []

        if (typeof savedServices === "string") {
            try {
                savedServices = JSON.parse(savedServices)
            } catch {
                savedServices = []
            }
        }

        if (!Array.isArray(savedServices)) {
            savedServices = []
        }

        const checkedServices = savedServices
            .filter(service => service?.source === "check")
            .map(service => service.value)

        const customServices = savedServices
            .filter(service => service?.source === "custom")
            .map(service => service.value)

        setServiceTypes(checkedServices)
        setOtherServiceTypes(customServices.join(", "))
        setIsOtherType(customServices.length > 0)

        // =====================================================
        // PROJECT QUANTITIES
        // =====================================================

        if (!projectToEdit.has_multiple_versions) {
            const quantities = (projectToEdit.projectQuantities || [])
                .map(row => row.quantity)

            setQtysToQuote(
                quantities.length > 0
                    ? quantities.map(String)
                    : [""]
            )
        }

        // =====================================================
        // VERSIONS
        // =====================================================

        const loadedVersions = (projectToEdit.versions || []).map(version => ({
            id: version.id,

            Version: version.version || "",

            quantities:
                (version.quantities || []).length > 0
                    ? version.quantities.map(row => String(row.quantity))
                    : [""]
        }))

        setVersions(loadedVersions)

        // =====================================================
        // COMPONENTS
        // =====================================================

        const loadedComponents = (projectToEdit.components || []).map(
            component => ({
                // Keep the database ID as the React ID.
                // This lets kits continue to reference it.
                id: component.id,

                Component: component.component_name || "",
                Size: component.size || "",
                FlatSize: component.flat_size || "",
                Stock: component.stock || "",
                Coating: component.coating || "",

                quantities:
                    (component.quantities || []).length > 0
                        ? component.quantities.map(row =>
                            String(row.quantity)
                        )
                        : [""],

                saved: component.saved || false,

                finishingOps:
                    (component.finishingOps || []).map(operation => ({
                        id: operation.id,
                        value: operation.operation,
                        details: operation.details || {}
                    })),

                SameQty: false
            })
        )

        setComponents(
            loadedComponents.length > 0
                ? loadedComponents
                : [{
                    id: crypto.randomUUID(),
                    Component: "",
                    Size: "",
                    FlatSize: "",
                    Stock: "",
                    Coating: "",
                    quantities: [""],
                    saved: false,
                    finishingOps: [],
                    SameQty: false
                }]
        )

        // =====================================================
        // KITS
        // =====================================================

        const loadedKits = (projectToEdit.kits || []).map(kit => ({
            id: kit.id,

            // Important:
            // Convert database component_id back into
            // the React componentId.
            componentId: kit.component_id || null,

            source: kit.source || "manual",

            Kit: kit.kit_name || "",

            quantities:
                (kit.quantities || []).length > 0
                    ? kit.quantities.map(row => String(row.quantity))
                    : [""],

            OverageAction: kit.overage_action || ""
        }))

        setKits(loadedKits)

        // =====================================================
        // MAILING
        // =====================================================

        const mailing = projectToEdit.mailing

        if (mailing) {
            setClassOfMail(mailing.class_of_mail || "")
            setIndicia(mailing.indicia || "")
            setPaymentMethod(mailing.payment_method || "")
            setPermitType(mailing.permit_type || "")
            setNonprofitAuth(mailing.nonprofit_auth || "")
            setMailingFrom(mailing.mailing_from || "")
            setPermitOwner(mailing.permit_owner || "")
            setExactCompanyName(mailing.exact_company_name || "")
            setExactCompanyAddress(mailing.exact_company_address || "")
        } else {
            setClassOfMail("")
            setIndicia("")
            setPaymentMethod("")
            setPermitType("")
            setNonprofitAuth("")
            setMailingFrom("")
            setPermitOwner("")
            setExactCompanyName("")
            setExactCompanyAddress("")
        }

    }, [projectToEdit])


    async function replaceProjectChildren(projectId) {
    // =====================================================
    // GET EXISTING CHILD IDS
    // =====================================================

    const [
        versionsResult,
        componentsResult,
        kitsResult
    ] = await Promise.all([
        supabase
            .from("Versions")
            .select("id")
            .eq("project_id", projectId),

        supabase
            .from("Components")
            .select("id")
            .eq("project_id", projectId),

        supabase
            .from("Kits")
            .select("id")
            .eq("project_id", projectId)
    ])

    if (versionsResult.error) {
        throw versionsResult.error
    }

    if (componentsResult.error) {
        throw componentsResult.error
    }

    if (kitsResult.error) {
        throw kitsResult.error
    }

    const versionIds =
        (versionsResult.data || []).map(row => row.id)

    const componentIds =
        (componentsResult.data || []).map(row => row.id)

    const kitIds =
        (kitsResult.data || []).map(row => row.id)

    // =====================================================
    // PROJECT QUANTITIES
    // =====================================================

    let result = await supabase
        .from("Project Quantities")
        .delete()
        .eq("project_id", projectId)

    if (result.error) {
        throw result.error
    }

    // =====================================================
    // KIT QUANTITIES
    // =====================================================

    if (kitIds.length > 0) {
        result = await supabase
            .from("Kit Quantities")
            .delete()
            .in("kit_id", kitIds)

        if (result.error) {
            throw result.error
        }
    }

    // =====================================================
    // KITS
    // =====================================================

    result = await supabase
        .from("Kits")
        .delete()
        .eq("project_id", projectId)

    if (result.error) {
        throw result.error
    }

    // =====================================================
    // VERSION QUANTITIES
    // =====================================================

    if (versionIds.length > 0) {
        result = await supabase
            .from("Version Quantities")
            .delete()
            .in("version_id", versionIds)

        if (result.error) {
            throw result.error
        }
    }

    // =====================================================
    // VERSIONS
    // =====================================================

    result = await supabase
        .from("Versions")
        .delete()
        .eq("project_id", projectId)

    if (result.error) {
        throw result.error
    }

    // =====================================================
    // COMPONENT QUANTITIES
    // =====================================================

    if (componentIds.length > 0) {
        result = await supabase
            .from("Component Quantities")
            .delete()
            .in("component_id", componentIds)

        if (result.error) {
            throw result.error
        }
    }

    // =====================================================
    // COMPONENT FINISHING
    // =====================================================

    if (componentIds.length > 0) {
        result = await supabase
            .from("Component Finishing")
            .delete()
            .in("component_id", componentIds)

        if (result.error) {
            throw result.error
        }
    }

    // =====================================================
    // COMPONENTS
    // =====================================================

    result = await supabase
        .from("Components")
        .delete()
        .eq("project_id", projectId)

    if (result.error) {
        throw result.error
    }

    // =====================================================
    // MAILING
    // =====================================================

    result = await supabase
        .from("Mailing")
        .delete()
        .eq("project_id", projectId)

    if (result.error) {
        throw result.error
    }
}


    // SUBMIT FORM HANDLER
    async function handleSubmit(e) {
        e.preventDefault()

        try {
            // =====================================================
            // BUILD SERVICE TYPES
            // =====================================================

            const finalServiceTypes = [
                ...serviceTypes.map(type => ({
                    source: "check",
                    value: type
                })),

                ...otherServiceTypes
                    .split(",")
                    .map(item => ({
                        source: "custom",
                        value: item.trim()
                    }))
                    .filter(item => item.value)
            ]

            // =====================================================
            // PROJECT DATA
            // =====================================================

            const projectData = {
                client_name: clientName,
                customer_number: customerNumber,
                project_name: projName,
                project_description: projDesc,
                due_date: dueDate || null,
                sales_rep: salesRep,
                previous_job_number: prevJobNo,
                previous_estimate_number: prevEstNo,
                job_type: jobType,
                has_multiple_versions: hasMultipleVersions,
                service_types: finalServiceTypes
            }

            let project

            // =====================================================
            // CREATE OR UPDATE PROJECT
            // =====================================================

            if (projectToEdit) {
                // EDIT EXISTING PROJECT

                const {
                    data: updatedProject,
                    error: projectError
                } = await supabase
                    .from("Projects")
                    .update(projectData)
                    .eq("id", projectToEdit.id)
                    .select()
                    .single()

                if (projectError) {
                    console.error("PROJECT UPDATE ERROR:", projectError)
                    alert(
                        `Error updating project: ${projectError.message}`
                    )
                    return
                }

                project = updatedProject

                // =================================================
                // DELETE EXISTING CHILD DATA
                // =================================================

                await replaceProjectChildren(project.id)

            } else {
                // CREATE NEW PROJECT

                const {
                    data: newProject,
                    error: projectError
                } = await supabase
                    .from("Projects")
                    .insert(projectData)
                    .select()
                    .single()

                if (projectError) {
                    console.error("PROJECT ERROR:", projectError)
                    alert(
                        `Error saving project: ${projectError.message}`
                    )
                    return
                }

                project = newProject
            }

            console.log(
                projectToEdit
                    ? "Project updated:"
                    : "Project created:",
                project
            )

            // =====================================================
            // 2. PROJECT QUANTITIES
            // Only used when there are NOT multiple versions
            // =====================================================

            if (!hasMultipleVersions) {

                const projectQuantityRows = qtysToQuote
                    .filter(qty => qty !== '' && qty !== null)
                    .map(qty => ({
                        project_id: project.id,
                        quantity: Number(qty)
                    }))

                if (projectQuantityRows.length > 0) {

                    const { error: projectQuantitiesError } = await supabase
                        .from('Project Quantities')
                        .insert(projectQuantityRows)

                    if (projectQuantitiesError) {
                        console.error(
                            'PROJECT QUANTITIES ERROR:',
                            projectQuantitiesError
                        )

                        alert(
                            `Error saving project quantities: ${projectQuantitiesError.message}`
                        )

                        return
                    }
                }
            }


            // =====================================================
            // 3. VERSIONS
            // Only used when there ARE multiple versions
            // =====================================================

            // This will let us match each React version to
            // its database-generated UUID.
            const versionIdMap = new Map()

            if (hasMultipleVersions && versions.length > 0) {

                for (let versionIndex = 0; versionIndex < versions.length; versionIndex++) {

                    const version = versions[versionIndex]

                    // Insert version
                    const { data: versionRow, error: versionError } = await supabase
                        .from('Versions')
                        .insert({
                            project_id: project.id,
                            version: version.Version
                        })
                        .select()
                        .single()

                    if (versionError) {
                        console.error('VERSION ERROR:', versionError)

                        alert(
                            `Error saving version: ${versionError.message}`
                        )

                        return
                    }

                    console.log('Version created:', versionRow)

                    // Save the database ID so we can use it below
                    versionIdMap.set(versionIndex, versionRow.id)


                    // =================================================
                    // 4. VERSION QUANTITIES
                    // =================================================

                    const versionQuantityRows = version.quantities
                        .filter(qty => qty !== '' && qty !== null)
                        .map(qty => ({
                            version_id: versionRow.id,
                            quantity: Number(qty)
                        }))

                    if (versionQuantityRows.length > 0) {

                        const { error: versionQuantitiesError } = await supabase
                            .from('Version Quantities')
                            .insert(versionQuantityRows)

                        if (versionQuantitiesError) {
                            console.error(
                                'VERSION QUANTITIES ERROR:',
                                versionQuantitiesError
                            )

                            alert(
                                `Error saving quantities for version ${version.Version}: ${versionQuantitiesError.message}`
                            )

                            return
                        }
                    }
                }
            }


            // =====================================================
            // 5. COMPONENTS
            // =====================================================

            // We need to keep track of:
            //
            // React component UUID
            //          ↓
            // Database component UUID
            //
            // because Kits currently use component.id from React.

            const componentIdMap = new Map()

            for (const component of components) {

                const { data: componentRow, error: componentError } = await supabase
                    .from('Components')
                    .insert({
                        project_id: project.id,
                        component_name: component.Component,
                        size: component.Size,
                        flat_size: component.FlatSize,
                        stock: component.Stock,
                        coating: component.Coating,
                        saved: component.saved
                    })
                    .select()
                    .single()

                if (componentError) {
                    console.error('COMPONENT ERROR:', componentError)

                    alert(
                        `Error saving component: ${componentError.message}`
                    )

                    return
                }

                console.log('Component created:', componentRow)

                // Map React ID → Supabase ID
                componentIdMap.set(
                    component.id,
                    componentRow.id
                )


                // =================================================
                // 6. COMPONENT QUANTITIES
                // =================================================

                const componentQuantityRows = component.quantities
                    .filter(qty => qty !== '' && qty !== null)
                    .map(qty => ({
                        component_id: componentRow.id,
                        quantity: Number(qty)
                    }))

                if (componentQuantityRows.length > 0) {

                    const { error: componentQuantitiesError } = await supabase
                        .from('Component Quantities')
                        .insert(componentQuantityRows)

                    if (componentQuantitiesError) {
                        console.error(
                            'COMPONENT QUANTITIES ERROR:',
                            componentQuantitiesError
                        )

                        alert(
                            `Error saving quantities for component ${component.Component}: ${componentQuantitiesError.message}`
                        )

                        return
                    }
                }


                // =================================================
                // 7. COMPONENT FINISHING
                // =================================================

                if ((component.finishingOps || []).length > 0) {

                    const finishingRows = component.finishingOps.map(op => ({
                        component_id: componentRow.id,
                        operation: op.value,
                        details: op.details
                    }))

                    const { error: finishingError } = await supabase
                        .from('Component Finishing')
                        .insert(finishingRows)

                    if (finishingError) {
                        console.error(
                            'COMPONENT FINISHING ERROR:',
                            finishingError
                        )

                        alert(
                            `Error saving finishing operations for ${component.Component}: ${finishingError.message}`
                        )

                        return
                    }
                }
            }


            // =====================================================
            // 8. KITS
            // =====================================================

            for (const kit of kits) {

                // If this is a component-generated kit,
                // convert the React component ID into
                // the actual Supabase component ID.
                let databaseComponentId = null

                if (kit.componentId) {

                    databaseComponentId =
                        componentIdMap.get(kit.componentId)

                    if (!databaseComponentId) {
                        console.error(
                            'Could not find database component ID for kit:',
                            kit
                        )

                        alert(
                            `Could not connect kit "${kit.Kit}" to its component.`
                        )

                        return
                    }
                }


                const { data: kitRow, error: kitError } = await supabase
                    .from('Kits')
                    .insert({
                        project_id: project.id,
                        component_id: databaseComponentId,
                        source: kit.source,
                        kit_name: kit.Kit,
                        overage_action: kit.OverageAction
                    })
                    .select()
                    .single()

                if (kitError) {
                    console.error('KIT ERROR:', kitError)

                    alert(
                        `Error saving kit: ${kitError.message}`
                    )

                    return
                }

                console.log('Kit created:', kitRow)


                // =================================================
                // 9. KIT QUANTITIES
                // =================================================

                const kitQuantityRows = kit.quantities
                    .filter(qty => qty !== '' && qty !== null)
                    .map(qty => ({
                        kit_id: kitRow.id,
                        quantity: Number(qty)
                    }))

                if (kitQuantityRows.length > 0) {

                    const { error: kitQuantitiesError } = await supabase
                        .from('Kit Quantities')
                        .insert(kitQuantityRows)

                    if (kitQuantitiesError) {
                        console.error(
                            'KIT QUANTITIES ERROR:',
                            kitQuantitiesError
                        )

                        alert(
                            `Error saving quantities for kit ${kit.Kit}: ${kitQuantitiesError.message}`
                        )

                        return
                    }
                }
            }


            // =====================================================
            // 10. MAILING
            // =====================================================

            // Only save mailing information if Mailing
            // was selected as a service type.

            if (serviceTypes.includes('Mailing')) {

                const { error: mailingError } = await supabase
                    .from('Mailing')
                    .insert({
                        project_id: project.id,
                        class_of_mail: classOfMail,
                        indicia: indicia,
                        payment_method: paymentMethod,
                        permit_type: permitType,
                        nonprofit_auth: nonprofitAuth,
                        mailing_from: mailingFrom,
                        permit_owner: permitOwner,
                        exact_company_name: exactCompanyName,
                        exact_company_address: exactCompanyAddress
                    })

                if (mailingError) {
                    console.error('MAILING ERROR:', mailingError)

                    alert(
                        `Error saving mailing information: ${mailingError.message}`
                    )

                    return
                }
            }


            // =====================================================
            // SUCCESS
            // =====================================================

            alert(
                projectToEdit
                    ? "Project updated successfully!"
                    : "Project saved successfully!"
            )

            if (onSaved) {
                onSaved(project)
            }
        } catch (error) {

            console.error('UNEXPECTED SUBMIT ERROR:', error)

            alert(
                `Something went wrong while saving the form: ${error.message}`
            )
        }
    }

    return (
        <div>
            <FormSection legend='Project Overview'>
                <ProjectOverview
                    clientName={clientName}
                    setClientName={setClientName}
                    customerNumber={customerNumber}
                    setCustomerNumber={setCustomerNumber}
                    projName={projName}
                    setProjName={setProjName}
                    projDesc={projDesc}
                    setProjDesc={setProjDesc}
                    jobType={jobType}
                    setJobType={setJobType}
                    dueDate={dueDate}
                    setDueDate={setDueDate}
                    salesRep={salesRep}
                    setSalesRep={setSalesRep}
                    prevJobNo={prevJobNo}
                    setPrevJobNo={setPrevJobNo}
                    prevEstNo={prevEstNo}
                    setPrevEstNo={setPrevEstNo}
                />
                <CheckboxInput label='Multiple Versions?' name='HasMultipleVersions' checked={hasMultipleVersions} onChange={handleHasVersions} />
                {!hasMultipleVersions &&
                    <Quantities2
                        updateQtyCount={updateQtyToQuoteCount}
                        updateQtyVal={updateQtyToQuoteVal}
                        qtys={qtysToQuote}
                        removeQty={removeQtyToQuote}
                        label="Total Finished Qty(s)"
                    />
                }
                {hasMultipleVersions &&
                    <>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 auto-rows-fr">
                            {versions.map((version, index) => (
                                <Versions2
                                    key={index}
                                    version={version}
                                    index={index}
                                    updateVersion={updateVersion}
                                    updateVersionQtyCount={updateVersionQtyCount}
                                    updateVersionQtyVal={updateVersionQtyVal}
                                    removeVersion={removeVersion}
                                />
                            ))}
                            <div className="mt-3 bg-gray-50 border border-gray-300 rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-100" onClick={addVersion}>
                                <strong>Add Version</strong>
                                {/* <Button label='Add Version' onClick={addVersion} /> */}
                            </div>

                        </div>
                    </>
                }

            </FormSection>
            <ServiceType
                serviceTypes={serviceTypes}
                handleServiceTypes={handleServiceTypes}
                isOtherType={isOtherType}
                setIsOtherType={setIsOtherType}
                otherServiceTypes={otherServiceTypes}
                setOtherServiceTypes={setOtherServiceTypes}
            />

            <FormSection legend='Components'>
                {components.map((component, index) => (
                    <Components2
                        key={index}
                        component={component}
                        index={index}
                        updateComponent={updateComponent}
                        updateComponentQtyCount={updateComponentQtyCount}
                        updateComponentQtyVal={updateComponentQtyVal}
                        saveComponent={saveComponent}
                        removeComponent={removeComponent}
                        removeComponentQty={removeComponentQty}
                        handleFinishingOps={handleComponentFinishingOps}
                        updateFinishingOpDetail={updateComponentFinishingOpDetail}
                        handleSameQty={handleSameQty}
                    />
                ))}
                <Button
                    label="Add Component"
                    onClick={addComponent}
                    size="lgFull"
                />
            </FormSection>
            {serviceTypes.includes('Kitting') &&
                <FormSection legend="Kitting">

                    {kits.map((kit, index) => (
                        <Kitting
                            key={kit.componentId || index}
                            kit={kit}
                            index={index}
                            updateKit={updateKit}
                            updateKitQtyCount={updateKitQtyCount}
                            updateKitQtyVal={updateKitQtyVal}
                            removeKit={removeKit}
                            removeKitQty={removeKitQty}
                        />
                    ))}

                    <Button
                        label="Add Kit"
                        onClick={addKit}
                        size="lgFull"
                    />

                </FormSection>
            }

            {serviceTypes.includes('Mailing') &&
                <Mailing
                    classOfMail={classOfMail}
                    setClassOfMail={setClassOfMail}
                    indicia={indicia}
                    setIndicia={setIndicia}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    permitType={permitType}
                    setPermitType={setPermitType}
                    nonprofitAuth={nonprofitAuth}
                    setNonprofitAuth={setNonprofitAuth}
                    mailingFrom={mailingFrom}
                    setMailingFrom={setMailingFrom}
                    permitOwner={permitOwner}
                    setPermitOwner={setPermitOwner}
                    exactCompanyName={exactCompanyName}
                    setExactCompanyName={setExactCompanyName}
                    exactCompanyAddress={exactCompanyAddress}
                    setExactCompanyAddress={setExactCompanyAddress}
                />
            }


            <div className="flex mt-3">
                <Button label='Submit' onClick={handleSubmit} size="lgFull" variant="info" />
            </div>

        </div>


    )
}

export default NewestForm