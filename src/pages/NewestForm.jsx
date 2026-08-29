import { useReducer, useEffect } from "react"
import { supabase } from "../lib/supabaseClient"

import FormSection from "../components/FormSection"
import Button from "../components/Button"
import Textarea from "../components/Textarea"

import QuantityControl from "../form_sections/QuantityControl"
import ProjectOverview from "../form_sections/ProjectOverview"
import ServiceType from "../form_sections/ServiceType"
import JobComponents from "../form_sections/JobComponents"
import Kitting from "../form_sections/Kitting"
import Mailing from "../form_sections/Mailing"

import { toQtyRows, toNumbers } from "./newestForm/quantities"
import { parseServiceTypes } from "./newestForm/serviceTypes"
import { fail, insertOne, insertMany } from "./newestForm/submitHelpers"
import { formReducer, initialFormState } from "./newestForm/formReducer"
import { visibleSteps } from "./newestForm/steps"
import WizardNav from "./newestForm/WizardNav"
import PackDistribution from "../form_sections/PackDistribution"
import FormEntryPreview from "../form_sections/FormEntryPreview"

// user, clientName and customerNumber originate from URL query params, read in
// App.jsx and passed down as props — they are shown at the top of the form but
// not editable here.
function NewestForm({
    projectToEdit = null,
    onSaved,
    user = "",
    clientName: clientNameProp = "",
    customerNumber: customerNumberProp = "",
}) {
    // The whole form lives in one reducer — see ./newestForm/formReducer.js.
    const [state, dispatch] = useReducer(
        formReducer,
        { clientName: clientNameProp, customerNumber: customerNumberProp },
        initialFormState
    )

    const { overview, qtysToQuote, kitsCount, services, components, kits, mailing, packDistribution } = state
    const { serviceTypes, isOtherType, otherServiceTypes } = services

    // field name -> setter(value) that dispatches into a flat slice
    const setOverview = (field) => (value) => dispatch({ type: "overview/setField", field, value })
    const setMailing = (field) => (value) => dispatch({ type: "mailing/setField", field, value })

    // Wizard: which steps apply right now, and where we are in them
    const steps = visibleSteps(state)
    const currentStep = state.wizard.current
    const stepIndex = steps.findIndex(step => step.id === currentStep)
    const isFirstStep = stepIndex <= 0
    const isLastStep = stepIndex === steps.length - 1

    const goToStep = (step) => dispatch({ type: "wizard/goTo", step })
    const nextStep = () => dispatch({ type: "wizard/next" })
    const prevStep = () => dispatch({ type: "wizard/back" })

    // Quantities to quote
    const updateQtyToQuoteCount = () => dispatch({ type: "qtysToQuote/add" })
    const updateQtyToQuoteVal = (index, value) => dispatch({ type: "qtysToQuote/set", index, value })
    const removeQtyToQuote = (index) => dispatch({ type: "qtysToQuote/remove", index })

    // Kit counts — one per completed-units quantity level
    const updateKitsCountVal = (index, value) => dispatch({ type: "kitsCount/set", index, value })

    // Service types
    const handleServiceTypes = (e) =>
        dispatch({ type: "services/toggle", name: e.target.name, checked: e.target.checked })

    // Components
    const addComponent = () => dispatch({ type: "components/add" })

    const saveComponent = (index) => {
        const component = components[index]

        if (component?.saved) {
            const confirmed = window.confirm(
                "This component has already been saved. Saving your changes will also update its kit. Do you want to continue?"
            )
            if (!confirmed) return
        }

        dispatch({ type: "components/save", index })
    }

    const updateComponent = (index, field, value) =>
        dispatch({ type: "components/setField", index, field, value })

    const updateComponentQtyCount = (index) => dispatch({ type: "components/addQty", index })

    const updateComponentQtyVal = (index, qtyIndex, value) =>
        dispatch({ type: "components/setQty", index, qtyIndex, value })

    const removeComponent = (index) => dispatch({ type: "components/remove", index })

    const removeComponentQty = (index, qtyIndex) =>
        dispatch({ type: "components/removeQty", index, qtyIndex })

    const handleSameQty = (index, checked) =>
        dispatch({ type: "components/toggleSameQty", index, checked })

    const handleRequiresFinishing = (index, checked) =>
        dispatch({ type: "components/toggleRequiresFinishing", index, checked })

    const handleComponentFinishingOps = (index, e) =>
        dispatch({ type: "components/toggleFinishingOp", index, name: e.target.name, checked: e.target.checked })

    const updateComponentFinishingOpDetail = (index, opValue, fieldName, value) =>
        dispatch({ type: "components/setFinishingOpDetail", index, opValue, fieldName, value })

    // Kitting
    const addKit = () => dispatch({ type: "kits/add" })
    const updateKit = (index, field, value) => dispatch({ type: "kits/setField", index, field, value })
    const updateKitQtyCount = (index) => dispatch({ type: "kits/addQty", index })
    const updateKitQtyVal = (index, qtyIndex, value) =>
        dispatch({ type: "kits/setQty", index, qtyIndex, value })
    const removeKit = (index) => dispatch({ type: "kits/remove", index })
    const removeKitQty = (index, qtyIndex) => dispatch({ type: "kits/removeQty", index, qtyIndex })

    // Packing
    const updatePackDistribution = (rows) =>
        dispatch({ type: "packing/setDistribution", rows })

    // Load existing project
    useEffect(() => {
        if (projectToEdit) dispatch({ type: "loadProject", project: projectToEdit })
    }, [projectToEdit])

    function buildServiceTypes() {
        return [
            ...serviceTypes.map(type => ({ source: "check", value: type })),
            ...otherServiceTypes
                .split(",")
                .map(item => ({ source: "custom", value: item.trim() }))
                .filter(item => item.value),
        ]
    }

    function getWhatChanged() {
        if (!projectToEdit) return "Initial project created."

        const changes = []

        if ((projectToEdit.project_name || "") !== overview.projName) {
            changes.push(`Changed project name from "${projectToEdit.project_name || ""}" to "${overview.projName}"`)
        }
        if ((projectToEdit.project_description || "") !== overview.projDesc) {
            changes.push("Changed project description")
        }
        if ((projectToEdit.due_date || "") !== (overview.dueDate || "")) {
            changes.push(`Changed due date from "${projectToEdit.due_date || "None"}" to "${overview.dueDate || "None"}"`)
        }
        if ((projectToEdit.sales_rep || "") !== overview.salesRep) {
            changes.push(`Changed sales rep from "${projectToEdit.sales_rep || ""}" to "${overview.salesRep}"`)
        }
        if ((projectToEdit.job_type || "") !== overview.jobType) {
            changes.push(`Changed job type from "${projectToEdit.job_type || ""}" to "${overview.jobType}"`)
        }
        if ((projectToEdit.additional_comments || "") !== (overview.additionalComments || "")) {
            changes.push("Changed additional comments")
        }

        // Service types
        const oldServiceNames = parseServiceTypes(projectToEdit.service_types)
            .map(service => typeof service === "string" ? service : service?.value)
            .filter(Boolean)

        const newServiceNames = [
            ...serviceTypes,
            ...otherServiceTypes.split(",").map(item => item.trim()).filter(Boolean)
        ]

        oldServiceNames
            .filter(service => !newServiceNames.includes(service))
            .forEach(service => changes.push(`Removed service type "${service}"`))

        newServiceNames
            .filter(service => !oldServiceNames.includes(service))
            .forEach(service => changes.push(`Added service type "${service}"`))

        // Project quantities
        const oldQuantities = (projectToEdit.projectQuantities || []).map(row => Number(row.quantity))
        const newQuantities = toNumbers(qtysToQuote)

        if (JSON.stringify(oldQuantities) !== JSON.stringify(newQuantities)) {
            changes.push(`Changed project quantities from [${oldQuantities.join(", ")}] to [${newQuantities.join(", ")}]`)
        }

        // Kit counts
        const oldKitsCount = Array.isArray(projectToEdit.kits_count) ? projectToEdit.kits_count.map(Number) : []
        const newKitsCount = toNumbers(kitsCount)

        if (JSON.stringify(oldKitsCount) !== JSON.stringify(newKitsCount)) {
            changes.push(`Changed kit counts from [${oldKitsCount.join(", ")}] to [${newKitsCount.join(", ")}]`)
        }

        // Components
        const oldComponents = projectToEdit.components || []
        const oldComponentsByKey = new Map(oldComponents.map(c => [c.component_key, c]))
        const newComponentsByKey = new Map(components.map(c => [c.componentKey, c]))

        oldComponents.forEach(oldComponent => {
            if (!newComponentsByKey.has(oldComponent.component_key)) {
                changes.push(`Removed component "${oldComponent.component_name || "Unnamed component"}"`)
            }
        })

        components.forEach(component => {
            if (!oldComponentsByKey.has(component.componentKey)) {
                changes.push(`Added component "${component.Component || "Unnamed component"}"`)
            }
        })

        components.forEach(component => {
            const oldComponent = oldComponentsByKey.get(component.componentKey)
            if (!oldComponent) return

            const componentName = component.Component || oldComponent.component_name || "Unnamed component"

            if ((oldComponent.component_name || "") !== component.Component) {
                changes.push(`Changed component name from "${oldComponent.component_name || ""}" to "${component.Component}"`)
            }
            if ((oldComponent.size || "") !== component.Size) {
                changes.push(`Changed "${componentName}" size from "${oldComponent.size || ""}" to "${component.Size}"`)
            }
            if ((oldComponent.flat_size || "") !== component.FlatSize) {
                changes.push(`Changed "${componentName}" flat size from "${oldComponent.flat_size || ""}" to "${component.FlatSize}"`)
            }
            if ((oldComponent.stock || "") !== component.Stock) {
                changes.push(`Changed "${componentName}" stock from "${oldComponent.stock || ""}" to "${component.Stock}"`)
            }
            if ((oldComponent.coating || "") !== component.Coating) {
                changes.push(`Changed "${componentName}" coating from "${oldComponent.coating || ""}" to "${component.Coating}"`)
            }

            const oldQtys = (oldComponent.quantities || []).map(row => Number(row.quantity))
            const newQtys = toNumbers(component.quantities || [])

            if (JSON.stringify(oldQtys) !== JSON.stringify(newQtys)) {
                changes.push(`Changed "${componentName}" quantities from [${oldQtys.join(", ")}] to [${newQtys.join(", ")}]`)
            }

            const oldFinishing = (oldComponent.finishingOps || []).map(op => op.operation).filter(Boolean)
            const newFinishing = (component.finishingOps || []).map(op => op.value).filter(Boolean)

            oldFinishing
                .filter(operation => !newFinishing.includes(operation))
                .forEach(operation => changes.push(`Removed finishing operation "${operation}" from "${componentName}"`))

            newFinishing
                .filter(operation => !oldFinishing.includes(operation))
                .forEach(operation => changes.push(`Added finishing operation "${operation}" to "${componentName}"`))
        })

        return changes.length === 0 ? "No changes." : changes.join("\n")
    }

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            const finalServiceTypes = buildServiceTypes()

            let projectId
            let versionNumber

            if (!projectToEdit) {
                const { data: newProject, error: projectError } = await insertOne("Projects", {
                    client_name: overview.clientName,
                    customer_number: overview.customerNumber
                })

                if (projectError) return fail("creating project", projectError)

                projectId = newProject.id
                versionNumber = 1

            } else {
                projectId = projectToEdit.id

                const { data: existingVersions, error: versionsError } = await supabase
                    .from("Project Versions")
                    .select("version_number")
                    .eq("project_id", projectId)
                    .order("version_number", { ascending: false })
                    .limit(1)

                if (versionsError) return fail("finding existing project versions", versionsError)

                versionNumber = existingVersions?.length > 0
                    ? Number(existingVersions[0].version_number) + 1
                    : 1
            }

            const { data: version, error: versionError } = await insertOne("Project Versions", {
                project_id: projectId,
                version_number: versionNumber,
                client_name: overview.clientName,
                customer_number: overview.customerNumber,
                project_name: overview.projName,
                project_description: overview.projDesc,
                due_date: overview.dueDate || null,
                sales_rep: overview.salesRep,
                previous_job_number: overview.prevJobNo,
                previous_estimate_number: overview.prevEstNo,
                job_type: overview.jobType,
                service_types: finalServiceTypes,
                kits_count: toNumbers(kitsCount),
                additional_comments: overview.additionalComments,
                what_changed: getWhatChanged()
            })

            if (versionError) return fail("creating project version", versionError)

            const versionId = version.id

            const { error: qtysError } = await insertMany(
                "Project Quantities",
                toQtyRows(qtysToQuote, "version_id", versionId)
            )

            if (qtysError) return fail("saving project quantities", qtysError)

            // React component id -> new database component id
            const componentIdMap = new Map()

            for (const component of components) {
                const { data: componentRow, error: componentError } = await insertOne("Components", {
                    version_id: versionId,
                    component_key: component.componentKey,
                    component_name: component.Component,
                    size: component.Size,
                    flat_size: component.FlatSize,
                    stock: component.Stock,
                    coating: component.Coating,
                    saved: component.saved
                })

                if (componentError) return fail("saving component", componentError)

                componentIdMap.set(component.id, componentRow.id)

                const { error: componentQtysError } = await insertMany(
                    "Component Quantities",
                    toQtyRows(component.quantities, "component_id", componentRow.id)
                )

                if (componentQtysError) return fail(`saving quantities for component ${component.Component}`, componentQtysError)

                if (component.finishingOps.length > 0) {
                    const { error: finishingError } = await insertMany(
                        "Component Finishing",
                        component.finishingOps.map(op => ({
                            component_id: componentRow.id,
                            operation: op.value,
                            details: op.details
                        }))
                    )

                    if (finishingError) return fail(`saving finishing operations for ${component.Component}`, finishingError)
                }
            }

            // Kits
            for (const kit of kits) {
                let databaseComponentId = null

                if (kit.componentId) {
                    databaseComponentId = componentIdMap.get(kit.componentId)

                    if (!databaseComponentId) {
                        console.error("Could not find database component ID for kit:", kit)
                        alert(`Could not connect kit "${kit.Kit}" to its component.`)
                        return
                    }
                }

                const { data: kitRow, error: kitError } = await insertOne("Kit Items", {
                    version_id: versionId,
                    component_id: databaseComponentId,
                    source: kit.source,
                    kit_name: kit.Kit,
                    overage_action: kit.OverageAction
                })

                if (kitError) return fail("saving kit", kitError)

                const { error: kitQtysError } = await insertMany(
                    "Kit Quantities",
                    toQtyRows(kit.quantities, "kit_id", kitRow.id)
                )

                if (kitQtysError) return fail(`saving quantities for kit ${kit.Kit}`, kitQtysError)
            }

            // Mailing
            if (serviceTypes.includes("Mailing")) {
                const { error: mailingError } = await insertMany("Mailing", [{
                    version_id: versionId,
                    class_of_mail: mailing.classOfMail,
                    indicia: mailing.indicia,
                    payment_method: mailing.paymentMethod,
                    permit_type: mailing.permitType,
                    nonprofit_auth: mailing.nonprofitAuth,
                    mailing_from: mailing.mailingFrom,
                    permit_owner: mailing.permitOwner,
                    exact_company_name: mailing.exactCompanyName,
                    exact_company_address: mailing.exactCompanyAddress
                }])

                if (mailingError) return fail("saving mailing information", mailingError)
            }

            // Packs
            const packRows = packDistribution
                .filter(pack => pack.packType || pack.qtyPerPack || pack.numberOfPacks)
                .map(pack => {
                    const qtyPerPack = Number(pack.qtyPerPack) || 0
                    const numOfPacks = Number(pack.numberOfPacks) || 0
                    return {
                        version_id: versionId,
                        pack_type: pack.packType,
                        qty_per_pack: qtyPerPack,
                        num_of_packs: numOfPacks,
                        pack_total: qtyPerPack * numOfPacks
                    }
                })

            const { error: packsError } = await insertMany("Packs", packRows)

            if (packsError) return fail("saving packs", packsError)

            alert(projectToEdit ? `Project saved as Version ${versionNumber}!` : "Project saved successfully!")

            onSaved?.({
                ...version,
                id: projectId,
                version_id: versionId,
                version_number: versionNumber
            })

        } catch (error) {
            console.error("UNEXPECTED SUBMIT ERROR:", error)
            alert(`Something went wrong while saving the form: ${error.message}`)
        }
    }

    // The complete form payload — the shape the preview panel renders.
    const formData = {
        ...overview,
        qtysToQuote,
        kitsCount,
        serviceTypes: buildServiceTypes(),
        components,
        kits,
        mailing,
        packDistribution
    }

    function renderStep() {
        switch (currentStep) {
            case "overview":
                return (
                    <FormSection legend="Project Overview">
                        <ProjectOverview
                            clientName={overview.clientName}
                            setClientName={setOverview("clientName")}
                            customerNumber={overview.customerNumber}
                            setCustomerNumber={setOverview("customerNumber")}
                            projName={overview.projName}
                            setProjName={setOverview("projName")}
                            projDesc={overview.projDesc}
                            setProjDesc={setOverview("projDesc")}
                            jobType={overview.jobType}
                            setJobType={setOverview("jobType")}
                            dueDate={overview.dueDate}
                            setDueDate={setOverview("dueDate")}
                            salesRep={overview.salesRep}
                            setSalesRep={setOverview("salesRep")}
                            prevJobNo={overview.prevJobNo}
                            setPrevJobNo={setOverview("prevJobNo")}
                            prevEstNo={overview.prevEstNo}
                            setPrevEstNo={setOverview("prevEstNo")}

                            serviceTypes={serviceTypes}
                            handleServiceTypes={handleServiceTypes}
                            isOtherType={isOtherType}
                            setIsOtherType={(value) => dispatch({ type: "services/setIsOtherType", value })}
                            otherServiceTypes={otherServiceTypes}
                            setOtherServiceTypes={(value) => dispatch({ type: "services/setOtherServiceTypes", value })}


                            qtys={qtysToQuote}
                            updateQtyCount={updateQtyToQuoteCount}
                            updateQtyVal={updateQtyToQuoteVal}
                            removeQty={removeQtyToQuote}
                        />
                    </FormSection>
                )

            // case "quantities":
            //     return (
            //         <FormSection legend="Quantities to Quote">
            //             <QuantityControl
            //                 qtys={qtysToQuote}
            //                 updateQtyCount={updateQtyToQuoteCount}
            //                 updateQtyVal={updateQtyToQuoteVal}
            //                 removeQty={removeQtyToQuote}
            //             />
            //         </FormSection>
            //     )

            // case "services":
            //     return (
            //         <ServiceType
            //             serviceTypes={serviceTypes}
            //             handleServiceTypes={handleServiceTypes}
            //             isOtherType={isOtherType}
            //             setIsOtherType={(value) => dispatch({ type: "services/setIsOtherType", value })}
            //             otherServiceTypes={otherServiceTypes}
            //             setOtherServiceTypes={(value) => dispatch({ type: "services/setOtherServiceTypes", value })}
            //         />
            //     )

            case "components":
                return (
                    <FormSection legend="Components">
                        {components.map((component, index) => (
                            <JobComponents
                                key={component.id}
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
                                handleRequiresFinishing={handleRequiresFinishing}
                                totalQtys={qtysToQuote}
                            />
                        ))}

                        <Button label="Add Component" onClick={addComponent} size="lgFull" />
                    </FormSection>
                )

            case "kitting":
                return (
                    <FormSection legend="Kit Build">
                        <div className="mb-4 flex flex-col gap-2">
                            <h5 className="font-semibold">How many individual kits per quantity level?</h5>
                            <QuantityControl
                                label={(qty) => `@ ${qty || '—'} completed units`}
                                rows={qtysToQuote}
                                qtys={kitsCount}
                                updateQtyVal={updateKitsCountVal}
                            />
                        </div>

                        {kits.map((kit, index) => (
                            <Kitting
                                key={kit.componentId || kit.id || index}
                                kit={kit}
                                index={index}
                                updateKit={updateKit}
                                updateKitQtyCount={updateKitQtyCount}
                                updateKitQtyVal={updateKitQtyVal}
                                removeKit={removeKit}
                                removeKitQty={removeKitQty}
                                component={components.find(c => c.id === kit.componentId) || null}
                                completedUnits={qtysToQuote}
                            />
                        ))}

                        <Button label="Add Kit" onClick={addKit} size="lgFull" />
                    </FormSection>
                )

            case "mailing":
                return (
                    <Mailing
                        classOfMail={mailing.classOfMail}
                        setClassOfMail={setMailing("classOfMail")}
                        indicia={mailing.indicia}
                        setIndicia={setMailing("indicia")}
                        paymentMethod={mailing.paymentMethod}
                        setPaymentMethod={setMailing("paymentMethod")}
                        permitType={mailing.permitType}
                        setPermitType={setMailing("permitType")}
                        nonprofitAuth={mailing.nonprofitAuth}
                        setNonprofitAuth={setMailing("nonprofitAuth")}
                        mailingFrom={mailing.mailingFrom}
                        setMailingFrom={setMailing("mailingFrom")}
                        permitOwner={mailing.permitOwner}
                        setPermitOwner={setMailing("permitOwner")}
                        exactCompanyName={mailing.exactCompanyName}
                        setExactCompanyName={setMailing("exactCompanyName")}
                        exactCompanyAddress={mailing.exactCompanyAddress}
                        setExactCompanyAddress={setMailing("exactCompanyAddress")}
                    />
                )

            case "packing":
                return (
                    <FormSection legend="Packing">
                        <PackDistribution
                            rows={packDistribution}
                            onChange={updatePackDistribution}
                            completedUnits={qtysToQuote}
                        />
                    </FormSection>
                )

            case "review":
                return (
                    <FormSection legend="Review & Submit">
                        <p className="text-sm text-gray-600">
                            Review every entry below, then submit the estimate.
                        </p>

                        <FormEntryPreview user={user} data={formData} />

                        <Textarea
                            label="Additional Comments"
                            name="AdditionalComments"
                            rows={4}
                            placeholder="Anything else the estimator should know."
                            value={overview.additionalComments}
                            onChange={(e) => setOverview("additionalComments")(e.target.value)}
                        />

                        <Button label="Submit" onClick={handleSubmit} size="lgFull" variant="info" />
                    </FormSection>
                )

            default:
                return null
        }
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {/* <div className="col-span-2">
                <FormEntryPreview user={user} data={formData} />
            </div> */}
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="col-span-1 lg:col-span-2">
                    <div className="sticky top-5">
                        <WizardNav
                            steps={steps}
                            current={currentStep}
                            visited={state.wizard.visited}
                            onSelect={goToStep}
                        />
                    </div>

                </div>

                <div className=" col-span-2 lg:col-span-3 lg:col-start-3">
                    {renderStep()}
                    <div className="mt-4 flex gap-3">
                        <Button label="Back" onClick={prevStep} disabled={isFirstStep} />
                        {!isLastStep && <Button label="Next" onClick={nextStep} variant="info" />}
                    </div>
                </div>



            </div>
        </div>
    )
}

export default NewestForm
