import { useState } from "react"
import {
    Wizard
} from "react-use-wizard"

import StepRenderer from "./StepRenderer"
import { FORM_STEPS } from "./formConfig"

import { supabase } from "../lib/supabaseClient"

function Form({
    selectedRFEId
}) {

    // =========================================================
    // FORM DATA
    // =========================================================

    const [formData, setFormData] = useState({

        // RFE Overview
        rfe_name: "",
        description: "",
        customer_name: "",
        customer_number: "",
        due_date: "",
        sales_rep: "",
        job_type: "",
        previous_job_number: "",
        additional_comments: "",

        // Quantities
        quantities: [""],

        // Versions
        versions: [],

        // Services
        service_types: [],
        other_service_types: "",

        // Components
        components: [
            {
                id: crypto.randomUUID(),
                Component: "",
                Size: "",
                Stock: "",
                Coating: "",
                FlatSize: "",
                quantities: [""],
                saved: false,
                finishingOps: []
            }
        ],

        // Kitting
        kits: [],

        // Mailing
        class_of_mail: "",
        indicia: "",
        payment_method: "",
        permit_type: "",
        nonprofit_auth: "",
        mailing_from: "",
        permit_owner: "",
        exact_company_name: "",
        exact_company_address: ""
    })


    // =========================================================
    // GENERIC FORM DATA UPDATE
    // =========================================================

    const updateFormData = (
        name,
        value
    ) => {

        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

    }


    // =========================================================
    // QUANTITIES
    // =========================================================

    const addQuantity = () => {

        setFormData(prev => ({
            ...prev,

            quantities: [
                ...prev.quantities,
                ""
            ]
        }))

    }


    const updateQuantity = (
        index,
        value
    ) => {

        setFormData(prev => ({
            ...prev,

            quantities:
                prev.quantities.map(
                    (qty, i) =>
                        i === index
                            ? value
                            : qty
                )
        }))

    }


    const removeQuantity = (
        index
    ) => {

        setFormData(prev => ({
            ...prev,

            quantities:
                prev.quantities.filter(
                    (_, i) =>
                        i !== index
                )
        }))

    }


    // =========================================================
    // COMPONENTS
    // =========================================================

    const addComponent = () => {

        setFormData(prev => ({
            ...prev,

            components: [
                ...prev.components,

                {
                    id: crypto.randomUUID(),
                    Component: "",
                    Size: "",
                    Stock: "",
                    Coating: "",
                    FlatSize: "",
                    quantities: [""],
                    saved: false,
                    finishingOps: []
                }
            ]
        }))

    }


    const updateComponent = (
        index,
        field,
        value
    ) => {

        setFormData(prev => ({
            ...prev,

            components:
                prev.components.map(
                    (component, i) =>
                        i === index
                            ? {
                                ...component,
                                [field]: value
                            }
                            : component
                )
        }))

    }


    const removeComponent = (
        index
    ) => {

        setFormData(prev => ({
            ...prev,

            components:
                prev.components.filter(
                    (_, i) =>
                        i !== index
                )
        }))

    }


    const updateComponentQtyVal = (
        componentIndex,
        qtyIndex,
        value
    ) => {

        setFormData(prev => ({
            ...prev,

            components:
                prev.components.map(
                    (component, i) => {

                        if (
                            i !== componentIndex
                        ) {
                            return component
                        }

                        return {
                            ...component,

                            quantities:
                                component.quantities.map(
                                    (qty, j) =>
                                        j === qtyIndex
                                            ? value
                                            : qty
                                )
                        }

                    }
                )
        }))

    }


    const removeComponentQty = (
        componentIndex,
        qtyIndex
    ) => {

        setFormData(prev => ({
            ...prev,

            components:
                prev.components.map(
                    (component, i) => {

                        if (
                            i !== componentIndex
                        ) {
                            return component
                        }

                        return {
                            ...component,

                            quantities:
                                component.quantities.filter(
                                    (_, j) =>
                                        j !== qtyIndex
                                )
                        }

                    }
                )
        }))

    }


    // =========================================================
    // SAVE COMPONENT
    // =========================================================

    const saveComponent = index => {

        const component =
            formData.components[index]

        if (!component) {
            return
        }

        if (component.saved) {

            const confirmed =
                window.confirm(
                    "This component has already been saved. Saving your changes will also update its kit. Do you want to continue?"
                )

            if (!confirmed) {
                return
            }

        }

        setFormData(prev => {

            const updatedComponents =
                prev.components.map(
                    (item, i) =>
                        i === index
                            ? {
                                ...item,
                                saved: true
                            }
                            : item
                )

            let updatedKits =
                prev.kits

            if (
                prev.service_types.includes(
                    "Kitting"
                )
            ) {

                const existingKit =
                    prev.kits.find(
                        kit =>
                            kit.componentId ===
                            component.id
                    )

                if (!existingKit) {

                    updatedKits = [
                        ...prev.kits,

                        {
                            componentId:
                                component.id,

                            source:
                                "component",

                            Kit:
                                component.Component,

                            quantities:
                                [
                                    ...component.quantities
                                ],

                            OverageAction:
                                ""
                        }
                    ]

                } else {

                    updatedKits =
                        prev.kits.map(
                            kit =>
                                kit.componentId ===
                                component.id
                                    ? {
                                        ...kit,
                                        Kit:
                                            component.Component
                                    }
                                    : kit
                        )

                }

            }

            return {
                ...prev,

                components:
                    updatedComponents,

                kits:
                    updatedKits
            }

        })

    }


    // =========================================================
    // COMPONENT FINISHING
    // =========================================================

    const handleComponentFinishingOps = (
        componentIndex,
        event
    ) => {

        const {
            name,
            checked
        } = event.target

        setFormData(prev => ({
            ...prev,

            components:
                prev.components.map(
                    (component, i) => {

                        if (
                            i !== componentIndex
                        ) {
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
                                        op.value !==
                                        name
                                )
                        }

                    }
                )
        }))

    }


    const updateComponentFinishingOpDetail = (
        componentIndex,
        opValue,
        fieldName,
        value
    ) => {

        setFormData(prev => ({
            ...prev,

            components:
                prev.components.map(
                    (component, i) => {

                        if (
                            i !== componentIndex
                        ) {
                            return component
                        }

                        return {
                            ...component,

                            finishingOps:
                                component.finishingOps.map(
                                    op =>
                                        op.value ===
                                        opValue
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

                    }
                )
        }))

    }


    // =========================================================
    // KITTING
    // =========================================================

    const addKit = () => {

        setFormData(prev => ({
            ...prev,

            kits: [
                ...prev.kits,

                {
                    id: crypto.randomUUID(),
                    source: "manual",
                    Kit: "",
                    quantities: [""],
                    OverageAction: ""
                }
            ]
        }))

    }


    const updateKit = (
        index,
        field,
        value
    ) => {

        setFormData(prev => ({
            ...prev,

            kits:
                prev.kits.map(
                    (kit, i) =>
                        i === index
                            ? {
                                ...kit,
                                [field]: value
                            }
                            : kit
                )
        }))

    }


    const updateKitQtyCount = (
        index
    ) => {

        setFormData(prev => ({
            ...prev,

            kits:
                prev.kits.map(
                    (kit, i) =>
                        i === index
                            ? {
                                ...kit,

                                quantities: [
                                    ...kit.quantities,
                                    ""
                                ]
                            }
                            : kit
                )
        }))

    }


    const updateKitQtyVal = (
        kitIndex,
        qtyIndex,
        value
    ) => {

        setFormData(prev => ({
            ...prev,

            kits:
                prev.kits.map(
                    (kit, i) =>
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
        }))

    }


    const removeKit = index => {

        setFormData(prev => ({
            ...prev,

            kits:
                prev.kits.filter(
                    (_, i) =>
                        i !== index
                )
        }))

    }


    const removeKitQty = (
        kitIndex,
        qtyIndex
    ) => {

        setFormData(prev => ({
            ...prev,

            kits:
                prev.kits.map(
                    (kit, i) =>
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
        }))

    }


    // =========================================================
    // SERVICE TYPES
    // =========================================================

    const handleServiceTypes = event => {

        const {
            checked,
            name
        } = event.target

        setFormData(prev => {

            const serviceTypes =
                checked
                    ? [
                        ...prev.service_types,
                        name
                    ]
                    : prev.service_types.filter(
                        item =>
                            item !== name
                    )

            let kits =
                prev.kits

            if (
                name === "Kitting" &&
                checked
            ) {

                const existingIds =
                    new Set(
                        kits
                            .map(
                                kit =>
                                    kit.componentId
                            )
                            .filter(Boolean)
                    )

                const newKits =
                    prev.components
                        .filter(
                            component =>
                                component.saved &&
                                !existingIds.has(
                                    component.id
                                )
                        )
                        .map(
                            component => ({
                                componentId:
                                    component.id,

                                source:
                                    "component",

                                Kit:
                                    component.Component,

                                quantities:
                                    [
                                        ...component.quantities
                                    ],

                                OverageAction:
                                    ""
                            })
                        )

                kits = [
                    ...kits,
                    ...newKits
                ]

            }

            return {
                ...prev,

                service_types:
                    serviceTypes,

                kits
            }

        })

    }


    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = async () => {

        // Build the final service type data
        const finalServiceTypes = [
            ...formData.service_types.map(
                type => ({
                    source: "check",
                    value: type
                })
            ),

            ...formData.other_service_types
                .split(",")
                .map(item => ({
                    source: "custom",
                    value: item.trim()
                }))
                .filter(
                    item =>
                        item.value
                )
        ]


        // =====================================================
        // 1. CREATE OR GET RFE
        // =====================================================

        let RFEId =
            selectedRFEId

        if (!RFEId) {

            const {
                data: rfe,
                error
            } = await supabase
                .from("RFEs")
                .insert({})
                .select()
                .single()

            if (error) {

                console.error(
                    "error creating RFE:",
                    error
                )

                return
            }

            RFEId =
                rfe.id
        }


        // =====================================================
        // 2. GET EXISTING VERSIONS
        // =====================================================

        const {
            data: versions,
            error: versionsError
        } = await supabase
            .from("RFE Versions")
            .select("version_number")
            .eq("rfe_id", RFEId)

        if (versionsError) {

            console.error(
                "error loading versions:",
                versionsError
            )

            return
        }


        // =====================================================
        // 3. NEXT VERSION
        // =====================================================

        const nextVersionNumber =
            versions.length > 0
                ? Math.max(
                    ...versions.map(
                        v =>
                            v.version_number
                    )
                ) + 1
                : 1


        // =====================================================
        // 4. CREATE VERSION
        // =====================================================

        const {
            data: version,
            error: versionError
        } = await supabase
            .from("RFE Versions")
            .insert({

                rfe_id:
                    RFEId,

                version_number:
                    nextVersionNumber,

                rfe_name:
                    formData.rfe_name,

                customer_name:
                    formData.customer_name,

                description:
                    formData.description,

                customer_number:
                    formData.customer_number,

                due_date:
                    formData.due_date,

                sales_rep:
                    formData.sales_rep,

                job_type:
                    formData.job_type,

                additional_comments:
                    formData.additional_comments,

                previous_job_number:
                    formData.previous_job_number

            })
            .select()
            .single()

        if (versionError) {

            console.error(
                "error saving RFE version:",
                versionError
            )

            return
        }


        // =====================================================
        // 5. SAVE QUANTITIES
        // =====================================================

        const quantityRows =
            formData.quantities

                .filter(
                    qty =>
                        String(qty).trim() !== ""
                )

                .map(
                    (qty, index) => ({
                        quantity:
                            Number(qty),

                        version_id:
                            version.id,

                        sort_order:
                            index
                    })
                )

        let savedQuantities = []

        if (
            quantityRows.length > 0
        ) {

            const {
                data: quantities,
                error
            } = await supabase
                .from("RFE Quantities")
                .insert(quantityRows)
                .select()

            if (error) {

                console.error(
                    "error saving quantities:",
                    error
                )

                return
            }

            savedQuantities =
                quantities
        }


        // =====================================================
        // 6. SAVE COMPONENTS
        // =====================================================

        const componentRows =
            formData.components

                .filter(
                    component =>
                        String(
                            component.Component ||
                            ""
                        ).trim() !== ""
                )

                .map(
                    component => ({
                        component_name:
                            component.Component,

                        size:
                            component.Size,

                        stock:
                            component.Stock,

                        coating:
                            component.Coating,

                        saved:
                            component.saved,

                        flat_size:
                            component.FlatSize,

                        version_id:
                            version.id,

                        component_key:
                            component.id
                    })
                )

        let savedComponents = []

        if (
            componentRows.length > 0
        ) {

            const {
                data: components,
                error
            } = await supabase
                .from("Components")
                .insert(componentRows)
                .select()

            if (error) {

                console.error(
                    "error saving components:",
                    error
                )

                return
            }

            savedComponents =
                components
        }


        // =====================================================
        // 7. COMPONENT QUANTITIES
        // =====================================================

        const componentQuantityRows = []

        formData.components.forEach(
            (
                formComponent,
                componentIndex
            ) => {

                const savedComponent =
                    savedComponents[
                        componentIndex
                    ]

                if (!savedComponent) {
                    return
                }

                formComponent.quantities

                    .filter(
                        qty =>
                            String(qty).trim() !== ""
                    )

                    .forEach(
                        (
                            qty,
                            quantityIndex
                        ) => {

                            const rfeQuantity =
                                savedQuantities[
                                    quantityIndex
                                ]

                            if (!rfeQuantity) {
                                return
                            }

                            componentQuantityRows.push({

                                component_id:
                                    savedComponent.id,

                                quantity:
                                    Number(qty),

                                rfe_quantity_id:
                                    rfeQuantity.id

                            })

                        }
                    )

            }
        )


        if (
            componentQuantityRows.length > 0
        ) {

            const {
                error
            } = await supabase
                .from("Component Quantities")
                .insert(
                    componentQuantityRows
                )

            if (error) {

                console.error(
                    "error saving component quantities:",
                    error
                )

                return
            }

        }


        // =====================================================
        // 8. FINISHING
        // =====================================================

        const finishingRows = []

        formData.components.forEach(
            (
                formComponent,
                componentIndex
            ) => {

                const savedComponent =
                    savedComponents[
                        componentIndex
                    ]

                if (!savedComponent) {
                    return
                }

                if (
                    !formComponent.finishingOps
                ) {
                    return
                }

                formComponent.finishingOps.forEach(
                    operation => {

                        finishingRows.push({

                            operation:
                                operation.value,

                            details:
                                operation.details ||
                                {},

                            component_id:
                                savedComponent.id

                        })

                    }
                )

            }
        )


        if (
            finishingRows.length > 0
        ) {

            const {
                error
            } = await supabase
                .from("Component Finishing")
                .insert(finishingRows)

            if (error) {

                console.error(
                    "error saving component finishing:",
                    error
                )

                return
            }

        }


        // =====================================================
        // 9. SUCCESS
        // =====================================================

        console.log(
            "created RFE:",
            RFEId
        )

        console.log(
            "created version:",
            version
        )

        console.log(
            "saved quantities:",
            savedQuantities
        )

        console.log(
            "saved components:",
            savedComponents
        )

        console.log(
            "saved component quantities:",
            componentQuantityRows
        )

        console.log(
            "saved finishing:",
            finishingRows
        )

        alert(
            "RFE saved successfully!"
        )

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <Wizard>

            {FORM_STEPS.map(step => (

                <StepRenderer
                    key={step.id}
                    step={step}

                    formData={formData}
                    updateFormData={
                        updateFormData
                    }

                    updateQuantity={
                        updateQuantity
                    }

                    addQuantity={
                        addQuantity
                    }

                    removeQuantity={
                        removeQuantity
                    }

                    updateComponent={
                        updateComponent
                    }

                    addComponent={
                        addComponent
                    }

                    removeComponent={
                        removeComponent
                    }

                    updateComponentQtyVal={
                        updateComponentQtyVal
                    }

                    removeComponentQty={
                        removeComponentQty
                    }

                    saveComponent={
                        saveComponent
                    }

                    handleComponentFinishingOps={
                        handleComponentFinishingOps
                    }

                    updateComponentFinishingOpDetail={
                        updateComponentFinishingOpDetail
                    }

                    updateKit={
                        updateKit
                    }

                    addKit={
                        addKit
                    }

                    removeKit={
                        removeKit
                    }

                    updateKitQtyCount={
                        updateKitQtyCount
                    }

                    updateKitQtyVal={
                        updateKitQtyVal
                    }

                    removeKitQty={
                        removeKitQty
                    }

                    onSubmit={
                        handleSubmit
                    }
                />

            ))}

        </Wizard>

    )
}

export default Form