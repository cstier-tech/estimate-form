import { useState } from "react"
import { useWizard } from "react-use-wizard"

import Steppers from "./Steppers"
import TextInput from "../components/TextInput"
import Button from "../components/Button"
import Textarea from "../components/Textarea"
import SelectInput from "../components/SelectInput"
import QuantityControl from "../form_sections/QuantityControl"

function StepOne({
    formData,
    updateFormData,
    updateQuantity,
    addQuantity,
    removeQuantity
}) {

    const { nextStep } = useWizard()
    const [submitted, setSubmitted] = useState(false)

    const FIELDS = [
        {
            label: "RFE Name",
            name: "rfe_name",
            required: true,
            error: "RFE name is required.",
            type: "text",
        },
        {
            label: "Description",
            name: "description",
            required: false,
            type: "textarea",
        },
        {
            label: "Customer",
            name: "customer_name",
            required: true,
            error: "Customer is required.",
            type: "text",
        },
        {
            label: "Customer Number",
            name: "customer_number",
            required: false,
            type: "text",
        },
        {
            label: "Requested Due Date",
            name: "due_date",
            required: false,
            type: "date",
        },
        {
            label: "Sales Rep",
            name: "sales_rep",
            required: true,
            error: "Sales Rep is required.",
            type: "text",
        },
        {
            label: "Job Type",
            name: "job_type",
            required: true,
            error: "Job Type is required.",
            type: "select",
            options: [
                { label: "Select One", value: "" },
                { label: "New Job", value: "New Job" },
                {
                    label: "Reprint – No Changes",
                    value: "Reprint – No Changes"
                },
                {
                    label: "Reprint – With Changes",
                    value: "Reprint – With Changes"
                },
                {
                    label: "Quote Update",
                    value: "Quote Update"
                },
            ]
        },
        {
            label: "Previous Job Number",
            name: "previous_job_number",
            required: false,
            type: "text",
            showwhen: {
                field: "job_type",
                value: "Reprint – No Changes"
            }
        },
        {
            label: "Additional Comments",
            name: "additional_comments",
            required: false,
            type: "textarea",
        },
    ]

    // -----------------------------
    // Conditional field visibility
    // -----------------------------

    const shouldShow = (field) => {

        if (!field.showwhen) {
            return true
        }

        return (
            formData[field.showwhen.field] ===
            field.showwhen.value
        )
    }

    // -----------------------------
    // Next button
    // -----------------------------

    const handleNext = () => {

        setSubmitted(true)

        const hasErrors = FIELDS.some(field => {

            if (!shouldShow(field)) {
                return false
            }

            if (!field.required) {
                return false
            }

            const value =
                formData[field.name] ?? ""

            return !String(value).trim()
        })

        if (hasErrors) {
            return
        }

        nextStep()
    }

    // -----------------------------
    // Render
    // -----------------------------

    return (
        <div>

            <Steppers />

            {/* Standard fields */}
            {FIELDS.map(field => {

                if (!shouldShow(field)) {
                    return null
                }

                const value =
                    formData[field.name] ?? ""

                return (
                    <div key={field.name}>

                        {field.type === "text" && (
                            <TextInput
                                label={field.label}
                                value={value}
                                onChange={(e) =>
                                    updateFormData(
                                        field.name,
                                        e.target.value
                                    )
                                }
                            />
                        )}

                        {field.type === "textarea" && (
                            <Textarea
                                label={field.label}
                                value={value}
                                onChange={(e) =>
                                    updateFormData(
                                        field.name,
                                        e.target.value
                                    )
                                }
                            />
                        )}

                        {field.type === "date" && (
                            <TextInput
                                type="date"
                                label={field.label}
                                value={value}
                                onChange={(e) =>
                                    updateFormData(
                                        field.name,
                                        e.target.value
                                    )
                                }
                            />
                        )}

                        {field.type === "select" && (
                            <SelectInput
                                label={field.label}
                                options={field.options}
                                value={value}
                                onChange={(e) =>
                                    updateFormData(
                                        field.name,
                                        e.target.value
                                    )
                                }
                            />
                        )}

                        {submitted &&
                            field.required &&
                            !String(value).trim() && (
                                <p className="text-red-700">
                                    {field.error}
                                </p>
                            )}

                    </div>
                )
            })}

            {/* Quantities */}
            <div className="mt-4">

                <label className="font-medium">
                    Quantities
                </label>

                <QuantityControl
                    qtys={formData.quantities}
                    updateQtyVal={updateQuantity}
                    updateQtyCount={addQuantity}
                    removeQty={removeQuantity}
                    allowAdd
                    allowRemove
                />

            </div>

            <Button
                label="Next"
                onClick={handleNext}
            />

        </div>
    )
}

export default StepOne
