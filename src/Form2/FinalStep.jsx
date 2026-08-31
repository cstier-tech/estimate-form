
import { useWizard } from "react-use-wizard"
import { supabase } from "../lib/supabaseClient"
import Steppers from "./Steppers"

function FinalStep({
    formData,
    selectedRFEId
}) {

    const { previousStep } = useWizard()

    const handleSubmit = async () => {

        // =========================================================
        // 1. CREATE OR GET RFE
        // =========================================================

        let RFEId = selectedRFEId

        if (!RFEId) {

            const { data: rfe, error } = await supabase
                .from("RFEs")
                .insert({})
                .select()
                .single()

            if (error) {
                console.log("error creating RFE:", error)
                return
            }

            RFEId = rfe.id
        }


        // =========================================================
        // 2. GET EXISTING VERSIONS
        // =========================================================

        const { data: versions, error: versionsError } = await supabase
            .from("RFE Versions")
            .select("version_number")
            .eq("rfe_id", RFEId)

        if (versionsError) {
            console.log("error loading versions:", versionsError)
            return
        }


        // =========================================================
        // 3. DETERMINE NEXT VERSION NUMBER
        // =========================================================

        const nextVersionNumber =
            versions.length > 0
                ? Math.max(
                    ...versions.map(v => v.version_number)
                ) + 1
                : 1


        // =========================================================
        // 4. CREATE RFE VERSION
        // =========================================================

        const { data: version, error: versionError } = await supabase
            .from("RFE Versions")
            .insert({
                rfe_id: RFEId,
                version_number: nextVersionNumber,
                rfe_name: formData.rfe_name,
                customer_name: formData.customer_name,
                description: formData.description,
                customer_number: formData.customer_number,
                due_date: formData.due_date,
                sales_rep: formData.sales_rep,
                job_type: formData.job_type,
                additional_comments: formData.additional_comments,
                previous_job_number: formData.previous_job_number,
            })
            .select()
            .single()

        if (versionError) {
            console.log("error saving RFE version:", versionError)
            return
        }


        // =========================================================
        // 5. SAVE RFE QUANTITIES
        // =========================================================

        const quantityRows = formData.quantities
            .filter(qty => String(qty).trim() !== "")
            .map((qty, index) => ({
                quantity: Number(qty),
                version_id: version.id,
                sort_order: index
            }))

        let savedQuantities = []

        if (quantityRows.length > 0) {

            const {
                data: quantities,
                error: quantitiesError
            } = await supabase
                .from("RFE Quantities")
                .insert(quantityRows)
                .select()

            if (quantitiesError) {
                console.log(
                    "error saving quantities:",
                    quantitiesError
                )
                return
            }

            savedQuantities = quantities
        }


        // =========================================================
        // 6. SAVE COMPONENTS
        // =========================================================

        const componentRows = formData.components
            .filter(component =>
                String(component.Component || "").trim() !== ""
            )
            .map(component => ({
                component_name: component.Component,
                size: component.Size,
                stock: component.Stock,
                coating: component.Coating,
                saved: component.saved,
                flat_size: component.FlatSize,
                version_id: version.id,
                component_key: component.component_key,
                souce: component.Source,
                job_number: component.JobNo
            }))

        let savedComponents = []

        if (componentRows.length > 0) {

            const {
                data: components,
                error: componentsError
            } = await supabase
                .from("Components")
                .insert(componentRows)
                .select()

            if (componentsError) {
                console.log(
                    "error saving components:",
                    componentsError
                )
                return
            }

            savedComponents = components
        }


        // =========================================================
        // 7. SAVE COMPONENT QUANTITIES
        // =========================================================

        const componentQuantityRows = []

        formData.components.forEach((formComponent, componentIndex) => {

            const savedComponent = savedComponents[componentIndex]

            if (!savedComponent) {
                return
            }

            formComponent.quantities
                .filter(qty => String(qty).trim() !== "")
                .forEach((qty, quantityIndex) => {

                    const rfeQuantity = savedQuantities[quantityIndex]

                    if (!rfeQuantity) {
                        return
                    }

                    componentQuantityRows.push({
                        component_id: savedComponent.id,
                        quantity: Number(qty),
                        rfe_quantity_id: rfeQuantity.id
                    })

                })
        })


        if (componentQuantityRows.length > 0) {

            const {
                error: componentQuantitiesError
            } = await supabase
                .from("Component Quantities")
                .insert(componentQuantityRows)

            if (componentQuantitiesError) {
                console.log(
                    "error saving component quantities:",
                    componentQuantitiesError
                )
                return
            }
        }


        // =========================================================
        // SAVE COMPONENT FINISHING
        // =========================================================

        const finishingRows = []

        formData.components.forEach((formComponent, componentIndex) => {

            const savedComponent = savedComponents[componentIndex]

            if (!savedComponent) {
                return
            }

            if (!formComponent.finishingOps) {
                return
            }

            formComponent.finishingOps.forEach(operation => {

                finishingRows.push({
                    operation: operation.value,
                    details: operation.details || {},
                    component_id: savedComponent.id
                })

            })
        })


        if (finishingRows.length > 0) {

            const {
                error: finishingError
            } = await supabase
                .from("Component Finishing")
                .insert(finishingRows)

            if (finishingError) {
                console.log(
                    "error saving component finishing:",
                    finishingError
                )
                return
            }
        }


        // =========================================================
        // 9. SUCCESS
        // =========================================================

        console.log("created RFE:", RFEId)
        console.log("created version:", version)
        console.log("saved quantities:", savedQuantities)
        console.log("saved components:", savedComponents)
        console.log(
            "saved component quantities:",
            componentQuantityRows
        )
        console.log(
            "saved finishing:",
            finishingRows
        )

        alert("RFE saved successfully!")
    }


    return (
        <div>

            <Steppers />

            <h3>Review</h3>

            <p>
                Job Name: {formData.rfe_name}
            </p>

            <p>
                Client: {formData.customer_name}
            </p>

            <p>
                Quantities:
            </p>

            <ul>
                {formData.quantities
                    .filter(qty => String(qty).trim() !== "")
                    .map((qty, index) => (
                        <li key={index}>
                            {qty}
                        </li>
                    ))}
            </ul>

            <p>
                Components:
            </p>

            <ul>
                {formData.components
                    .filter(component =>
                        String(component.Component || "").trim() !== ""
                    )
                    .map((component, index) => (
                        <li key={component.component_key || index}>
                            {component.Component}
                        </li>
                    ))}
            </ul>

            <button onClick={previousStep}>
                Back
            </button>

            <button onClick={handleSubmit}>
                Submit
            </button>

        </div>
    )
}

export default FinalStep
