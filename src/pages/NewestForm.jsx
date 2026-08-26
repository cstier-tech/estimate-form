import { useState, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"

import FormSection from "../components/FormSection"
import Button from "../components/Button"

import Quantities2 from "../form_sections/Quantities2"
import ProjectOverview from "../form_sections/ProjectOverview"
import ServiceType from "../form_sections/ServiceType"
import Components2 from "../form_sections/Components2"
import Kitting from "../form_sections/Kitting"
import Mailing from "../form_sections/Mailing"

function NewestForm({ projectToEdit = null, onSaved, onCancel }) {

    // =====================================================
    // PROJECT OVERVIEW
    // =====================================================

    const [clientName, setClientName] = useState("Prefilled Client...")
    const [customerNumber, setCustomerNumber] = useState("Prefilled Number...")
    const [projName, setProjName] = useState("")
    const [projDesc, setProjDesc] = useState("")
    const [dueDate, setDueDate] = useState("")
    const [salesRep, setSalesRep] = useState("Internal sales rep")
    const [prevJobNo, setPrevJobNo] = useState("")
    const [prevEstNo, setPrevEstNo] = useState("")
    const [jobType, setJobType] = useState("")


    // =====================================================
    // QUANTITIES TO QUOTE
    // =====================================================

    const [qtysToQuote, setQtysToQuote] = useState([""])

    const updateQtyToQuoteCount = () => {
        setQtysToQuote(prev => [
            ...prev,
            ""
        ])
    }

    const updateQtyToQuoteVal = (index, value) => {
        setQtysToQuote(prev =>
            prev.map((qty, i) =>
                i === index
                    ? value
                    : qty
            )
        )
    }

    const removeQtyToQuote = (qtyToQuoteIndex) => {
        setQtysToQuote(prev =>
            prev.filter(
                (_, index) =>
                    index !== qtyToQuoteIndex
            )
        )
    }


    // =====================================================
    // SERVICE TYPES
    // =====================================================

    const [serviceTypes, setServiceTypes] = useState([])
    const [isOtherType, setIsOtherType] = useState(false)
    const [otherServiceTypes, setOtherServiceTypes] = useState("")

    const handleServiceTypes = (e) => {

        const { checked, name } = e.target

        setServiceTypes(prev =>
            checked
                ? [...prev, name]
                : prev.filter(
                    item => item !== name
                )
        )

        // Kitting was just turned on
        if (name === "Kitting" && checked) {

            setKits(prev => {

                const existingComponentIds =
                    new Set(
                        prev
                            .filter(kit => kit.componentId)
                            .map(
                                kit => kit.componentId
                            )
                    )

                const newKits =
                    components
                        .filter(component =>
                            component.saved &&
                            !existingComponentIds.has(
                                component.id
                            )
                        )
                        .map(component => ({
                            componentId:
                                component.id,

                            source:
                                "component",

                            Kit:
                                component.Component,

                            quantities:
                                [...component.quantities],

                            OverageAction:
                                ""
                        }))

                return [
                    ...prev,
                    ...newKits
                ]
            })
        }
    }


    // =====================================================
    // COMPONENTS
    // =====================================================

    const [components, setComponents] = useState([
        {
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
            SameQty: false
        }
    ])

    const addComponent = () => {

        setComponents(prev => [
            ...prev,
            {
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
                SameQty: false
            }
        ])
    }

    const saveComponent = (index) => {

        const component =
            components[index]

        // FIRST SAVE
        if (!component.saved) {

            setComponents(prev =>
                prev.map((item, i) =>
                    i === index
                        ? {
                            ...item,
                            saved: true
                        }
                        : item
                )
            )

            // Create corresponding kit
            if (serviceTypes.includes("Kitting")) {

                setKits(prev => {

                    const alreadyExists =
                        prev.some(
                            kit =>
                                kit.componentId ===
                                component.id
                        )

                    if (alreadyExists) {
                        return prev
                    }

                    return [
                        ...prev,
                        {
                            componentId:
                                component.id,

                            source:
                                "component",

                            Kit:
                                component.Component,

                            quantities:
                                [...component.quantities],

                            OverageAction:
                                ""
                        }
                    ]
                })
            }

            return
        }

        // RESAVE
        const confirmed = window.confirm(
            "This component has already been saved. Saving your changes will also update its kit. Do you want to continue?"
        )

        if (!confirmed) {
            return
        }

        setComponents(prev =>
            prev.map((item, i) =>
                i === index
                    ? {
                        ...item,
                        saved: true
                    }
                    : item
            )
        )

        // Update corresponding kit
        if (serviceTypes.includes("Kitting")) {

            setKits(prev =>
                prev.map(kit =>
                    kit.componentId === component.id
                        ? {
                            ...kit,
                            Kit:
                                component.Component
                        }
                        : kit
                )
            )
        }
    }

    const updateComponent = (
        index,
        field,
        value
    ) => {

        setComponents(prev =>
            prev.map((component, i) =>
                i === index
                    ? {
                        ...component,
                        [field]: value
                    }
                    : component
            )
        )
    }

    const updateComponentQtyCount = (
        componentIndex
    ) => {

        setComponents(prev =>
            prev.map((component, i) =>
                i === componentIndex
                    ? {
                        ...component,
                        quantities: [
                            ...component.quantities,
                            ""
                        ]
                    }
                    : component
            )
        )
    }

    const updateComponentQtyVal = (
        componentIndex,
        qtyIndex,
        value
    ) => {

        setComponents(prev =>
            prev.map((component, i) =>
                i === componentIndex
                    ? {
                        ...component,
                        quantities:
                            component.quantities.map(
                                (qty, j) =>
                                    j === qtyIndex
                                        ? value
                                        : qty
                            )
                    }
                    : component
            )
        )
    }

    const removeComponent = (
        componentIndex
    ) => {

        setComponents(prev =>
            prev.filter(
                (_, index) =>
                    index !== componentIndex
            )
        )
    }

    const removeComponentQty = (
        componentIndex,
        qtyIndex
    ) => {

        setComponents(prev =>
            prev.map((component, i) =>
                i === componentIndex
                    ? {
                        ...component,
                        quantities:
                            component.quantities.filter(
                                (_, j) =>
                                    j !== qtyIndex
                            )
                    }
                    : component
            )
        )
    }

    const handleSameQty = (
        componentIndex,
        checked
    ) => {

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

    // Keep component quantities synchronized
    // with project quantities when SameQty is checked.

    useEffect(() => {

        setComponents(prev =>
            prev.map(component =>
                component.SameQty
                    ? {
                        ...component,
                        quantities:
                            [...qtysToQuote]
                    }
                    : component
            )
        )

    }, [qtysToQuote])


    // =====================================================
    // KITTING
    // =====================================================

    const [kits, setKits] = useState([])

    const addKit = () => {

        setKits(prev => [
            ...prev,
            {
                source: "manual",
                Kit: "",
                quantities: [""],
                OverageAction: ""
            }
        ])
    }

    const updateKit = (
        index,
        field,
        value
    ) => {

        setKits(prev =>
            prev.map((kit, i) =>
                i === index
                    ? {
                        ...kit,
                        [field]: value
                    }
                    : kit
            )
        )
    }

    const updateKitQtyCount = (
        kitIndex
    ) => {

        setKits(prev =>
            prev.map((kit, i) =>
                i === kitIndex
                    ? {
                        ...kit,
                        quantities: [
                            ...kit.quantities,
                            ""
                        ]
                    }
                    : kit
            )
        )
    }

    const updateKitQtyVal = (
        kitIndex,
        qtyIndex,
        value
    ) => {

        setKits(prev =>
            prev.map((kit, i) =>
                i === kitIndex
                    ? {
                        ...kit,
                        quantities:
                            kit.quantities.map(
                                (qty, j) =>
                                    j === qtyIndex
                                        ? value
                                        : qty
                            )
                    }
                    : kit
            )
        )
    }

    const removeKit = (
        kitIndex
    ) => {

        setKits(prev =>
            prev.filter(
                (_, index) =>
                    index !== kitIndex
            )
        )
    }

    const removeKitQty = (
        kitIndex,
        qtyIndex
    ) => {

        setKits(prev =>
            prev.map((kit, i) =>
                i === kitIndex
                    ? {
                        ...kit,
                        quantities:
                            kit.quantities.filter(
                                (_, j) =>
                                    j !== qtyIndex
                            )
                    }
                    : kit
            )
        )
    }


    // =====================================================
    // FINISHING
    // =====================================================

    const handleComponentFinishingOps = (
        componentIndex,
        e
    ) => {

        const {
            name,
            checked
        } = e.target

        setComponents(prev =>
            prev.map((component, i) => {

                if (i !== componentIndex) {
                    return component
                }

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
                    finishingOps:
                        component.finishingOps.filter(
                            op =>
                                op.value !== name
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
                        finishingOps:
                            component.finishingOps.map(
                                op =>
                                    op.value === opValue
                                        ? {
                                            ...op,
                                            details: {
                                                ...op.details,
                                                [fieldName]:
                                                    value
                                            }
                                        }
                                        : op
                            )
                    }
                    : component
            )
        )
    }


    // =====================================================
    // MAILING
    // =====================================================

    const [classOfMail, setClassOfMail] = useState("")
    const [indicia, setIndicia] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("")
    const [permitType, setPermitType] = useState("")
    const [nonprofitAuth, setNonprofitAuth] = useState("")
    const [mailingFrom, setMailingFrom] = useState("")
    const [permitOwner, setPermitOwner] = useState("")
    const [exactCompanyName, setExactCompanyName] = useState("")
    const [exactCompanyAddress, setExactCompanyAddress] = useState("")


    // =====================================================
    // LOAD EXISTING PROJECT
    // =====================================================

    useEffect(() => {

        if (!projectToEdit) {
            return
        }

        // =====================================================
        // PROJECT OVERVIEW
        // =====================================================

        setClientName(
            projectToEdit.client_name || ""
        )

        setCustomerNumber(
            projectToEdit.customer_number || ""
        )

        setProjName(
            projectToEdit.project_name || ""
        )

        setProjDesc(
            projectToEdit.project_description || ""
        )

        setDueDate(
            projectToEdit.due_date || ""
        )

        setSalesRep(
            projectToEdit.sales_rep || ""
        )

        setPrevJobNo(
            projectToEdit.previous_job_number || ""
        )

        setPrevEstNo(
            projectToEdit.previous_estimate_number || ""
        )

        setJobType(
            projectToEdit.job_type || ""
        )


        // =====================================================
        // SERVICE TYPES
        // =====================================================

        let savedServices =
            projectToEdit.service_types || []

        if (typeof savedServices === "string") {

            try {
                savedServices =
                    JSON.parse(savedServices)
            } catch {
                savedServices = []
            }
        }

        if (!Array.isArray(savedServices)) {
            savedServices = []
        }

        const checkedServices =
            savedServices
                .filter(
                    service =>
                        service?.source === "check"
                )
                .map(
                    service =>
                        service.value
                )

        const customServices =
            savedServices
                .filter(
                    service =>
                        service?.source === "custom"
                )
                .map(
                    service =>
                        service.value
                )

        setServiceTypes(
            checkedServices
        )

        setOtherServiceTypes(
            customServices.join(", ")
        )

        setIsOtherType(
            customServices.length > 0
        )


        // =====================================================
        // PROJECT QUANTITIES
        // =====================================================

        const quantities =
            (
                projectToEdit.projectQuantities ||
                []
            ).map(
                row =>
                    row.quantity
            )

        setQtysToQuote(
            quantities.length > 0
                ? quantities.map(String)
                : [""]
        )


        // =====================================================
        // COMPONENTS
        // =====================================================

        const loadedComponents =
            (
                projectToEdit.components ||
                []
            ).map(component => ({

                id:
                    crypto.randomUUID(),

                componentKey:
                    component.component_key,

                Component:
                    component.component_name ||
                    "",

                Size:
                    component.size ||
                    "",

                FlatSize:
                    component.flat_size ||
                    "",

                Stock:
                    component.stock ||
                    "",

                Coating:
                    component.coating ||
                    "",

                quantities:
                    (
                        component.quantities ||
                        []
                    ).length > 0
                        ? component.quantities.map(
                            row =>
                                String(
                                    row.quantity
                                )
                        )
                        : [""],

                saved:
                    component.saved ||
                    false,

                finishingOps:
                    (
                        component.finishingOps ||
                        []
                    ).map(operation => ({
                        id:
                            operation.id,

                        value:
                            operation.operation,

                        details:
                            operation.details ||
                            {}
                    })),

                SameQty:
                    false
            }))

        setComponents(
            loadedComponents.length > 0
                ? loadedComponents
                : [{
                    id:
                        crypto.randomUUID(),

                    Component:
                        "",

                    Size:
                        "",

                    FlatSize:
                        "",

                    Stock:
                        "",

                    Coating:
                        "",

                    quantities:
                        [""],

                    saved:
                        false,

                    finishingOps:
                        [],

                    SameQty:
                        false
                }]
        )


        // =====================================================
        // KITS
        // =====================================================

        const loadedKits =
            (
                projectToEdit.kits ||
                []
            ).map(kit => ({

                id:
                    kit.id,

                componentId:
                    kit.component_id ||
                    null,

                source:
                    kit.source ||
                    "manual",

                Kit:
                    kit.kit_name ||
                    "",

                quantities:
                    (
                        kit.quantities ||
                        []
                    ).length > 0
                        ? kit.quantities.map(
                            row =>
                                String(
                                    row.quantity
                                )
                        )
                        : [""],

                OverageAction:
                    kit.overage_action ||
                    ""
            }))

        setKits(
            loadedKits
        )


        // =====================================================
        // MAILING
        // =====================================================

        const mailing =
            projectToEdit.mailing

        if (mailing) {

            setClassOfMail(
                mailing.class_of_mail ||
                ""
            )

            setIndicia(
                mailing.indicia ||
                ""
            )

            setPaymentMethod(
                mailing.payment_method ||
                ""
            )

            setPermitType(
                mailing.permit_type ||
                ""
            )

            setNonprofitAuth(
                mailing.nonprofit_auth ||
                ""
            )

            setMailingFrom(
                mailing.mailing_from ||
                ""
            )

            setPermitOwner(
                mailing.permit_owner ||
                ""
            )

            setExactCompanyName(
                mailing.exact_company_name ||
                ""
            )

            setExactCompanyAddress(
                mailing.exact_company_address ||
                ""
            )

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

    function getWhatChanged() {
        // Brand new project
        if (!projectToEdit) {
            return "Initial project created."
        }

        const changes = []

        // =====================================================
        // PROJECT OVERVIEW
        // =====================================================

        if (
            (projectToEdit.project_name || "") !==
            projName
        ) {
            changes.push(
                `Changed project name from "${projectToEdit.project_name || ""}" to "${projName}"`
            )
        }

        if (
            (projectToEdit.project_description || "") !==
            projDesc
        ) {
            changes.push(
                "Changed project description"
            )
        }

        if (
            (projectToEdit.due_date || "") !==
            (dueDate || "")
        ) {
            changes.push(
                `Changed due date from "${projectToEdit.due_date || "None"}" to "${dueDate || "None"}"`
            )
        }

        if (
            (projectToEdit.sales_rep || "") !==
            salesRep
        ) {
            changes.push(
                `Changed sales rep from "${projectToEdit.sales_rep || ""}" to "${salesRep}"`
            )
        }

        if (
            (projectToEdit.job_type || "") !==
            jobType
        ) {
            changes.push(
                `Changed job type from "${projectToEdit.job_type || ""}" to "${jobType}"`
            )
        }

        // =====================================================
        // SERVICE TYPES
        // =====================================================

        let oldServices =
            projectToEdit.service_types || []

        if (typeof oldServices === "string") {
            try {
                oldServices =
                    JSON.parse(oldServices)
            } catch {
                oldServices = []
            }
        }

        if (!Array.isArray(oldServices)) {
            oldServices = []
        }

        const oldServiceNames =
            oldServices
                .map(service =>
                    typeof service === "string"
                        ? service
                        : service?.value
                )
                .filter(Boolean)

        const newServiceNames = [
            ...serviceTypes,
            ...otherServiceTypes
                .split(",")
                .map(item => item.trim())
                .filter(Boolean)
        ]

        oldServiceNames
            .filter(
                service =>
                    !newServiceNames.includes(service)
            )
            .forEach(service => {
                changes.push(
                    `Removed service type "${service}"`
                )
            })

        newServiceNames
            .filter(
                service =>
                    !oldServiceNames.includes(service)
            )
            .forEach(service => {
                changes.push(
                    `Added service type "${service}"`
                )
            })

        // =====================================================
        // PROJECT QUANTITIES
        // =====================================================

        const oldQuantities =
            (projectToEdit.projectQuantities || [])
                .map(row => Number(row.quantity))

        const newQuantities =
            qtysToQuote
                .filter(
                    qty =>
                        qty !== "" &&
                        qty !== null
                )
                .map(Number)

        if (
            JSON.stringify(oldQuantities) !==
            JSON.stringify(newQuantities)
        ) {
            changes.push(
                `Changed project quantities from [${oldQuantities.join(", ")}] to [${newQuantities.join(", ")}]`
            )
        }

        // =====================================================
        // COMPONENTS
        // =====================================================

        const oldComponents =
            projectToEdit.components || []

        const oldComponentsByKey =
            new Map(
                oldComponents.map(component => [
                    component.component_key,
                    component
                ])
            )

        const newComponentsByKey =
            new Map(
                components.map(component => [
                    component.componentKey,
                    component
                ])
            )

        // -----------------------------------------------------
        // REMOVED COMPONENTS
        // -----------------------------------------------------

        oldComponents.forEach(oldComponent => {
            if (
                !newComponentsByKey.has(
                    oldComponent.component_key
                )
            ) {
                changes.push(
                    `Removed component "${oldComponent.component_name || "Unnamed component"}"`
                )
            }
        })

        // -----------------------------------------------------
        // ADDED COMPONENTS
        // -----------------------------------------------------

        components.forEach(component => {
            if (
                !oldComponentsByKey.has(
                    component.componentKey
                )
            ) {
                changes.push(
                    `Added component "${component.Component || "Unnamed component"}"`
                )
            }
        })

        // -----------------------------------------------------
        // CHANGED COMPONENTS
        // -----------------------------------------------------

        components.forEach(component => {
            const oldComponent =
                oldComponentsByKey.get(
                    component.componentKey
                )

            if (!oldComponent) {
                return
            }

            const componentName =
                component.Component ||
                oldComponent.component_name ||
                "Unnamed component"

            if (
                (oldComponent.component_name || "") !==
                component.Component
            ) {
                changes.push(
                    `Changed component name from "${oldComponent.component_name || ""}" to "${component.Component}"`
                )
            }

            if (
                (oldComponent.size || "") !==
                component.Size
            ) {
                changes.push(
                    `Changed "${componentName}" size from "${oldComponent.size || ""}" to "${component.Size}"`
                )
            }

            if (
                (oldComponent.flat_size || "") !==
                component.FlatSize
            ) {
                changes.push(
                    `Changed "${componentName}" flat size from "${oldComponent.flat_size || ""}" to "${component.FlatSize}"`
                )
            }

            if (
                (oldComponent.stock || "") !==
                component.Stock
            ) {
                changes.push(
                    `Changed "${componentName}" stock from "${oldComponent.stock || ""}" to "${component.Stock}"`
                )
            }

            if (
                (oldComponent.coating || "") !==
                component.Coating
            ) {
                changes.push(
                    `Changed "${componentName}" coating from "${oldComponent.coating || ""}" to "${component.Coating}"`
                )
            }

            // -------------------------------------------------
            // COMPONENT QUANTITIES
            // -------------------------------------------------

            const oldQtys =
                (oldComponent.quantities || [])
                    .map(row =>
                        Number(row.quantity)
                    )

            const newQtys =
                (component.quantities || [])
                    .filter(
                        qty =>
                            qty !== "" &&
                            qty !== null
                    )
                    .map(Number)

            if (
                JSON.stringify(oldQtys) !==
                JSON.stringify(newQtys)
            ) {
                changes.push(
                    `Changed "${componentName}" quantities from [${oldQtys.join(", ")}] to [${newQtys.join(", ")}]`
                )
            }

            // -------------------------------------------------
            // FINISHING
            // -------------------------------------------------

            const oldFinishing =
                (oldComponent.finishingOps || [])
                    .map(op =>
                        op.operation
                    )
                    .filter(Boolean)

            const newFinishing =
                (component.finishingOps || [])
                    .map(op =>
                        op.value
                    )
                    .filter(Boolean)

            oldFinishing
                .filter(
                    operation =>
                        !newFinishing.includes(
                            operation
                        )
                )
                .forEach(operation => {
                    changes.push(
                        `Removed finishing operation "${operation}" from "${componentName}"`
                    )
                })

            newFinishing
                .filter(
                    operation =>
                        !oldFinishing.includes(
                            operation
                        )
                )
                .forEach(operation => {
                    changes.push(
                        `Added finishing operation "${operation}" to "${componentName}"`
                    )
                })
        })

        // =====================================================
        // RESULT
        // =====================================================

        if (changes.length === 0) {
            return "No changes."
        }

        return changes.join("\n")
    }

    // =====================================================
    // SUBMIT FORM
    // =====================================================

    async function handleSubmit(e) {

        e.preventDefault()

        try {

            // =====================================================
            // BUILD SERVICE TYPES
            // =====================================================

            const finalServiceTypes = [

                ...serviceTypes.map(
                    type => ({
                        source:
                            "check",

                        value:
                            type
                    })
                ),

                ...otherServiceTypes
                    .split(",")
                    .map(
                        item => ({
                            source:
                                "custom",

                            value:
                                item.trim()
                        })
                    )
                    .filter(
                        item =>
                            item.value
                    )
            ]


            // =====================================================
            // NEW PROJECT VS EXISTING PROJECT
            // =====================================================

            let projectId
            let versionNumber


            // =====================================================
            // BRAND NEW PROJECT
            // =====================================================

            if (!projectToEdit) {

                const {
                    data: newProject,
                    error: projectError
                } = await supabase
                    .from("Projects")
                    .insert({
                        client_name:
                            clientName,

                        customer_number:
                            customerNumber
                    })
                    .select()
                    .single()

                if (projectError) {

                    console.error(
                        "PROJECT ERROR:",
                        projectError
                    )

                    alert(
                        `Error creating project: ${projectError.message}`
                    )

                    return
                }

                projectId =
                    newProject.id

                versionNumber = 1

            }


            // =====================================================
            // EXISTING PROJECT
            // =====================================================

            else {

                projectId =
                    projectToEdit.id

                // Get latest version number
                const {
                    data: existingVersions,
                    error: versionsError
                } = await supabase
                    .from("Project Versions")
                    .select("version_number")
                    .eq(
                        "project_id",
                        projectId
                    )
                    .order(
                        "version_number",
                        {
                            ascending: false
                        })
                    .limit(1)

                if (versionsError) {

                    console.error(
                        "VERSION LOOKUP ERROR:",
                        versionsError
                    )

                    alert(
                        `Error finding existing project versions: ${versionsError.message}`
                    )

                    return
                }

                versionNumber =
                    existingVersions?.length > 0
                        ? Number(
                            existingVersions[0]
                                .version_number
                        ) + 1
                        : 1
            }


            // =====================================================
            // CREATE NEW PROJECT VERSION
            // =====================================================
            const whatChanged =
                getWhatChanged()

            const {
                data: version,
                error: versionError
            } = await supabase
                .from("Project Versions")
                .insert({

                    project_id:
                        projectId,

                    version_number:
                        versionNumber,

                    client_name:
                        clientName,

                    customer_number:
                        customerNumber,

                    project_name:
                        projName,

                    project_description:
                        projDesc,

                    due_date:
                        dueDate || null,

                    sales_rep:
                        salesRep,

                    previous_job_number:
                        prevJobNo,

                    previous_estimate_number:
                        prevEstNo,

                    job_type:
                        jobType,

                    service_types:
                        finalServiceTypes,

                    what_changed:
                        whatChanged,
                })
                .select()
                .single()

            if (versionError) {

                console.error(
                    "VERSION ERROR:",
                    versionError
                )

                alert(
                    `Error creating project version: ${versionError.message}`
                )

                return
            }

            const versionId =
                version.id


            // =====================================================
            // PROJECT QUANTITIES
            // =====================================================

            const projectQuantityRows =
                qtysToQuote
                    .filter(
                        qty =>
                            qty !== "" &&
                            qty !== null
                    )
                    .map(
                        qty => ({
                            version_id:
                                versionId,

                            quantity:
                                Number(qty)
                        })
                    )

            if (
                projectQuantityRows.length >
                0
            ) {

                const {
                    error:
                    projectQuantitiesError
                } = await supabase
                    .from("Project Quantities")
                    .insert(
                        projectQuantityRows
                    )

                if (
                    projectQuantitiesError
                ) {

                    console.error(
                        "PROJECT QUANTITIES ERROR:",
                        projectQuantitiesError
                    )

                    alert(
                        `Error saving project quantities: ${projectQuantitiesError.message}`
                    )

                    return
                }
            }


            // =====================================================
            // COMPONENTS
            // =====================================================

            // React component ID
            // →
            // new database component ID

            const componentIdMap =
                new Map()


            for (
                const component of components
            ) {

                const {
                    data: componentRow,
                    error: componentError
                } = await supabase
                    .from("Components")
                    .insert({

                        version_id:
                            versionId,
                        component_key:
                            component.componentKey,

                        component_name:
                            component.Component,

                        size:
                            component.Size,

                        flat_size:
                            component.FlatSize,

                        stock:
                            component.Stock,

                        coating:
                            component.Coating,

                        saved:
                            component.saved
                    })
                    .select()
                    .single()

                if (componentError) {

                    console.error(
                        "COMPONENT ERROR:",
                        componentError
                    )

                    alert(
                        `Error saving component: ${componentError.message}`
                    )

                    return
                }

                console.log(
                    "Component created:",
                    componentRow
                )


                // =================================================
                // MAP REACT COMPONENT ID
                // TO NEW DATABASE COMPONENT ID
                // =================================================

                componentIdMap.set(
                    component.id,
                    componentRow.id
                )


                // =================================================
                // COMPONENT QUANTITIES
                // =================================================

                const componentQuantityRows =
                    component.quantities
                        .filter(
                            qty =>
                                qty !== "" &&
                                qty !== null
                        )
                        .map(
                            qty => ({
                                component_id:
                                    componentRow.id,

                                quantity:
                                    Number(qty)
                            })
                        )

                if (
                    componentQuantityRows.length >
                    0
                ) {

                    const {
                        error:
                        componentQuantitiesError
                    } = await supabase
                        .from(
                            "Component Quantities"
                        )
                        .insert(
                            componentQuantityRows
                        )

                    if (
                        componentQuantitiesError
                    ) {

                        console.error(
                            "COMPONENT QUANTITIES ERROR:",
                            componentQuantitiesError
                        )

                        alert(
                            `Error saving quantities for component ${component.Component}: ${componentQuantitiesError.message}`
                        )

                        return
                    }
                }


                // =================================================
                // COMPONENT FINISHING
                // =================================================

                if (
                    (
                        component.finishingOps ||
                        []
                    ).length > 0
                ) {

                    const finishingRows =
                        component.finishingOps.map(
                            op => ({
                                component_id:
                                    componentRow.id,

                                operation:
                                    op.value,

                                details:
                                    op.details
                            })
                        )

                    const {
                        error:
                        finishingError
                    } = await supabase
                        .from(
                            "Component Finishing"
                        )
                        .insert(
                            finishingRows
                        )

                    if (finishingError) {

                        console.error(
                            "COMPONENT FINISHING ERROR:",
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
            // KITS
            // =====================================================

            for (
                const kit of kits
            ) {

                let databaseComponentId =
                    null

                // Component-generated kit
                if (kit.componentId) {

                    databaseComponentId =
                        componentIdMap.get(
                            kit.componentId
                        )

                    if (
                        !databaseComponentId
                    ) {

                        console.error(
                            "Could not find database component ID for kit:",
                            kit
                        )

                        alert(
                            `Could not connect kit "${kit.Kit}" to its component.`
                        )

                        return
                    }
                }


                // =================================================
                // INSERT KIT
                // =================================================

                const {
                    data: kitRow,
                    error: kitError
                } = await supabase
                    .from("Kits")
                    .insert({

                        version_id:
                            versionId,

                        component_id:
                            databaseComponentId,

                        source:
                            kit.source,

                        kit_name:
                            kit.Kit,

                        overage_action:
                            kit.OverageAction
                    })
                    .select()
                    .single()

                if (kitError) {

                    console.error(
                        "KIT ERROR:",
                        kitError
                    )

                    alert(
                        `Error saving kit: ${kitError.message}`
                    )

                    return
                }

                console.log(
                    "Kit created:",
                    kitRow
                )


                // =================================================
                // KIT QUANTITIES
                // =================================================

                const kitQuantityRows =
                    kit.quantities
                        .filter(
                            qty =>
                                qty !== "" &&
                                qty !== null
                        )
                        .map(
                            qty => ({
                                kit_id:
                                    kitRow.id,

                                quantity:
                                    Number(qty)
                            })
                        )

                if (
                    kitQuantityRows.length >
                    0
                ) {

                    const {
                        error:
                        kitQuantitiesError
                    } = await supabase
                        .from(
                            "Kit Quantities"
                        )
                        .insert(
                            kitQuantityRows
                        )

                    if (
                        kitQuantitiesError
                    ) {

                        console.error(
                            "KIT QUANTITIES ERROR:",
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
            // MAILING
            // =====================================================

            if (
                serviceTypes.includes(
                    "Mailing"
                )
            ) {

                const {
                    error:
                    mailingError
                } = await supabase
                    .from("Mailing")
                    .insert({

                        version_id:
                            versionId,

                        class_of_mail:
                            classOfMail,

                        indicia:
                            indicia,

                        payment_method:
                            paymentMethod,

                        permit_type:
                            permitType,

                        nonprofit_auth:
                            nonprofitAuth,

                        mailing_from:
                            mailingFrom,

                        permit_owner:
                            permitOwner,

                        exact_company_name:
                            exactCompanyName,

                        exact_company_address:
                            exactCompanyAddress
                    })

                if (mailingError) {

                    console.error(
                        "MAILING ERROR:",
                        mailingError
                    )

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
                    ? `Project saved as Version ${versionNumber}!`
                    : "Project saved successfully!"
            )

            if (onSaved) {

                onSaved({
                    ...version,

                    id:
                        projectId,

                    version_id:
                        versionId,

                    version_number:
                        versionNumber
                })
            }

        } catch (error) {

            console.error(
                "UNEXPECTED SUBMIT ERROR:",
                error
            )

            alert(
                `Something went wrong while saving the form: ${error.message}`
            )
        }
    }


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div>

            {/* PROJECT OVERVIEW */}

            <FormSection legend="Project Overview">

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

            </FormSection>


            {/* PROJECT QUANTITIES */}

            <FormSection legend="Quantities to Quote">

                <Quantities2
                    qtys={qtysToQuote}
                    updateQtyCount={
                        updateQtyToQuoteCount
                    }
                    updateQtyVal={
                        updateQtyToQuoteVal
                    }
                    removeQty={
                        removeQtyToQuote
                    }
                />

            </FormSection>


            {/* SERVICE TYPES */}

            <ServiceType
                serviceTypes={serviceTypes}
                handleServiceTypes={
                    handleServiceTypes
                }

                isOtherType={isOtherType}
                setIsOtherType={
                    setIsOtherType
                }

                otherServiceTypes={
                    otherServiceTypes
                }
                setOtherServiceTypes={
                    setOtherServiceTypes
                }
            />


            {/* COMPONENTS */}

            <FormSection legend="Components">

                {components.map(
                    (component, index) => (

                        <Components2
                            key={component.id}

                            component={
                                component
                            }

                            index={
                                index
                            }

                            updateComponent={
                                updateComponent
                            }

                            updateComponentQtyCount={
                                updateComponentQtyCount
                            }

                            updateComponentQtyVal={
                                updateComponentQtyVal
                            }

                            saveComponent={
                                saveComponent
                            }

                            removeComponent={
                                removeComponent
                            }

                            removeComponentQty={
                                removeComponentQty
                            }

                            handleFinishingOps={
                                handleComponentFinishingOps
                            }

                            updateFinishingOpDetail={
                                updateComponentFinishingOpDetail
                            }

                            handleSameQty={
                                handleSameQty
                            }
                        />

                    )
                )}

                <Button
                    label="Add Component"
                    onClick={
                        addComponent
                    }
                    size="lgFull"
                />

            </FormSection>


            {/* KITTING */}

            {serviceTypes.includes(
                "Kitting"
            ) && (

                    <FormSection legend="Kitting">

                        {kits.map(
                            (kit, index) => (

                                <Kitting
                                    key={
                                        kit.componentId ||
                                        kit.id ||
                                        index
                                    }

                                    kit={
                                        kit
                                    }

                                    index={
                                        index
                                    }

                                    updateKit={
                                        updateKit
                                    }

                                    updateKitQtyCount={
                                        updateKitQtyCount
                                    }

                                    updateKitQtyVal={
                                        updateKitQtyVal
                                    }

                                    removeKit={
                                        removeKit
                                    }

                                    removeKitQty={
                                        removeKitQty
                                    }
                                />

                            )
                        )}

                        <Button
                            label="Add Kit"
                            onClick={
                                addKit
                            }
                            size="lgFull"
                        />

                    </FormSection>
                )}


            {/* MAILING */}

            {serviceTypes.includes(
                "Mailing"
            ) && (

                    <Mailing
                        classOfMail={
                            classOfMail
                        }
                        setClassOfMail={
                            setClassOfMail
                        }

                        indicia={
                            indicia
                        }
                        setIndicia={
                            setIndicia
                        }

                        paymentMethod={
                            paymentMethod
                        }
                        setPaymentMethod={
                            setPaymentMethod
                        }

                        permitType={
                            permitType
                        }
                        setPermitType={
                            setPermitType
                        }

                        nonprofitAuth={
                            nonprofitAuth
                        }
                        setNonprofitAuth={
                            setNonprofitAuth
                        }

                        mailingFrom={
                            mailingFrom
                        }
                        setMailingFrom={
                            setMailingFrom
                        }

                        permitOwner={
                            permitOwner
                        }
                        setPermitOwner={
                            setPermitOwner
                        }

                        exactCompanyName={
                            exactCompanyName
                        }
                        setExactCompanyName={
                            setExactCompanyName
                        }

                        exactCompanyAddress={
                            exactCompanyAddress
                        }
                        setExactCompanyAddress={
                            setExactCompanyAddress
                        }
                    />

                )}


            {/* BUTTONS */}

            <div className="flex mt-3 gap-3">

                {onCancel && (

                    <Button
                        label="Cancel"
                        onClick={
                            onCancel
                        }
                        size="lgFull"
                    />

                )}

                <Button
                    label="Submit"
                    onClick={
                        handleSubmit
                    }
                    size="lgFull"
                    variant="info"
                />

            </div>

        </div>
    )
}

export default NewestForm