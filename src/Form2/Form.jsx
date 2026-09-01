import { useState } from "react"
import {
    Wizard
} from "react-use-wizard"

import StepRenderer from "./StepRenderer"
import { FORM_STEPS, FORM_CONFIG } from "./formConfig"
import { buildInitialFormData, makeBlankComponent } from "./formState"
import { submitForm } from "./submitForm"

function Form({
    selectedRFEId,
    // Prefilled state when editing a past RFE version; submitting it creates
    // the next version for the same selectedRFEId.
    initialData = null
}) {

    // =========================================================
    // FORM DATA  (seeded from formConfig.js, or a version being edited)
    // =========================================================

    const [formData, setFormData] = useState(
        () => initialData || buildInitialFormData(FORM_CONFIG)
    )

    const [submitting, setSubmitting] = useState(false)
    const [submitResult, setSubmitResult] = useState(null)


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

    // Components with "same as total qty" checked mirror the RFE-level
    // quantities, so any change to the totals has to flow through to them.
    const syncSameQty = (quantities, components) =>
        components.map(component =>
            component.SameQty
                ? { ...component, quantities: [...quantities] }
                : component
        )


    const addQuantity = () => {

        setFormData(prev => {

            const quantities = [
                ...prev.quantities,
                ""
            ]

            return {
                ...prev,
                quantities,
                components: syncSameQty(quantities, prev.components)
            }
        })

    }


    const updateQuantity = (
        index,
        value
    ) => {

        setFormData(prev => {

            const quantities = prev.quantities.map(
                (qty, i) =>
                    i === index ? value : qty
            )

            return {
                ...prev,
                quantities,
                components: syncSameQty(quantities, prev.components)
            }
        })

    }


    const removeQuantity = (
        index
    ) => {

        setFormData(prev => {

            const quantities = prev.quantities.filter(
                (_, i) => i !== index
            )

            return {
                ...prev,
                quantities,
                components: syncSameQty(quantities, prev.components)
            }
        })

    }


    // =========================================================
    // COMPONENTS
    // =========================================================

    const addComponent = () => {

        setFormData(prev => ({
            ...prev,

            components: [
                ...prev.components,
                makeBlankComponent()
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

                        // Grow the array so quote levels past index 0
                        // are editable (the grid renders one row per
                        // total quantity, not per stored value).
                        const quantities = [
                            ...component.quantities
                        ]

                        while (quantities.length <= qtyIndex) {
                            quantities.push("")
                        }

                        quantities[qtyIndex] = value

                        return {
                            ...component,
                            quantities
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


    // "Quantity is the same as Total Finished Qty(s)" — copy the current
    // totals in now and keep them synced (see syncSameQty).
    const handleComponentSameQty = (
        componentIndex,
        checked
    ) => {

        setFormData(prev => ({
            ...prev,

            components: prev.components.map((component, i) =>
                i === componentIndex
                    ? {
                        ...component,
                        SameQty: checked,
                        quantities: checked
                            ? [...prev.quantities]
                            : component.quantities
                    }
                    : component
            )
        }))

    }


    // "Does this component require finishing?" — toggles the finishing
    // section; clearing it drops any operations that were picked.
    const handleComponentRequiresFinishing = (
        componentIndex,
        checked
    ) => {

        setFormData(prev => ({
            ...prev,

            components: prev.components.map((component, i) =>
                i === componentIndex
                    ? {
                        ...component,
                        requiresFinishing: checked,
                        finishingOps: checked ? component.finishingOps : []
                    }
                    : component
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
                            id: crypto.randomUUID(),
                            source: "component",
                            componentId: component.id,
                            name: component.Component,
                            qtyPerKit: "",
                            overageAction: ""
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
                                        name:
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
    //
    // A kit item is either "manual" (typed name) or "component" (linked to a
    // saved component by componentId). `qtyPerKit` is a single number; the
    // per-quote-level reconciliation shown in the UI is derived from the linked
    // component and the RFE totals, not stored here.

    const makeManualKitItem = () => ({
        id: crypto.randomUUID(),
        source: "manual",
        name: "",
        qtyPerKit: "",
        overageAction: ""
    })


    const addKitItem = () => {

        setFormData(prev => ({
            ...prev,
            kits: [
                ...prev.kits,
                makeManualKitItem()
            ]
        }))

    }


    const updateKitItem = (
        index,
        field,
        value
    ) => {

        setFormData(prev => ({
            ...prev,

            kits: prev.kits.map(
                (kit, i) =>
                    i === index
                        ? { ...kit, [field]: value }
                        : kit
            )
        }))

    }


    const removeKitItem = index => {

        setFormData(prev => ({
            ...prev,
            kits: prev.kits.filter((_, i) => i !== index)
        }))

    }


    // "Build Kit from Components" — regenerate one component-sourced kit item
    // per component. The kit count per quote level is the RFE `quantities`;
    // qty per kit = floor(component pieces / kits) taken at the first quote
    // level where both are known. A remainder surfaces the overage question;
    // too few pieces flags an error. Manual kit items are left untouched.
    const buildKitsFromComponents = () => {

        setFormData(prev => {

            const kitCounts = prev.quantities.map(
                value => Number(value) || 0
            )

            const manualKits = prev.kits.filter(
                kit => kit.source !== "component"
            )

            const componentKits = prev.components
                .filter(
                    component =>
                        String(component.Component || "").trim() !== ""
                )
                .map(component => {

                    const base = {
                        id: crypto.randomUUID(),
                        source: "component",
                        componentId: component.id,
                        name: component.Component,
                        overageAction: ""
                    }

                    const insufficient = {
                        ...base,
                        qtyPerKit: "",
                        overage: 0,
                        error:
                            "Could not create kit item due to insufficient component pieces"
                    }

                    // first quote level where both the kit count and the
                    // component piece count are known
                    const level = kitCounts.findIndex(
                        (kits, i) =>
                            kits > 0 &&
                            (Number(component.quantities?.[i]) || 0) > 0
                    )

                    if (level === -1) {
                        return insufficient
                    }

                    const kits = kitCounts[level]
                    const pieces = Number(component.quantities[level]) || 0

                    if (pieces < kits) {
                        return insufficient
                    }

                    const perKit = Math.floor(pieces / kits)

                    return {
                        ...base,
                        qtyPerKit: String(perKit),
                        overage: pieces - perKit * kits,
                        error: ""
                    }
                })

            return {
                ...prev,
                kits: [...manualKits, ...componentKits]
            }
        })

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
                                id: crypto.randomUUID(),
                                source: "component",
                                componentId: component.id,
                                name: component.Component,
                                qtyPerKit: "",
                                overageAction: ""
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

        if (submitting) {
            return
        }

        setSubmitting(true)
        setSubmitResult(null)

        const result = await submitForm({
            formData,
            selectedRFEId,
            config: FORM_CONFIG
        })

        setSubmitResult(result)
        setSubmitting(false)
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

                    handleComponentSameQty={
                        handleComponentSameQty
                    }

                    handleComponentRequiresFinishing={
                        handleComponentRequiresFinishing
                    }

                    updateKitItem={
                        updateKitItem
                    }

                    addKitItem={
                        addKitItem
                    }

                    removeKitItem={
                        removeKitItem
                    }

                    buildKitsFromComponents={
                        buildKitsFromComponents
                    }

                    onSubmit={
                        handleSubmit
                    }

                    submitting={submitting}
                    submitResult={submitResult}
                />

            ))}

        </Wizard>

    )
}

export default Form