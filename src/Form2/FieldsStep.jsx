import { useState } from "react"
import { useWizard } from "react-use-wizard"

import Steppers from "./Steppers"

import TextInput from "../components/TextInput"
import Textarea from "../components/Textarea"
import SelectInput from "../components/SelectInput"
import Button from "../components/Button"

import QuantityControl from "../form_sections/QuantityControl"

import { shouldShow } from "./fieldVisibility"

function FieldsStep({
    step,

    formData,
    updateFormData,

    updateQuantity,
    addQuantity,
    removeQuantity
}) {

    const { nextStep, previousStep, isFirstStep } = useWizard()

    const [submitted, setSubmitted] = useState(false)

    const fields = step.fields || []

    const handleNext = () => {

        setSubmitted(true)

        const hasErrors = fields.some(field => {

            if (!shouldShow(field, formData)) {
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

    const handleChange = (field, event) => {

        let value = event.target.value

        updateFormData(
            field.name,
            value
        )
    }

    return (
        <div>

            <Steppers />

            {fields.map(field => {

                if (!shouldShow(field, formData)) {
                    return null
                }

                const value =
                    formData[field.name] ?? ""

                return (
                    <div
                        key={field.name}
                        className="mb-4"
                    >

                        {field.type === "text" && (
                            <TextInput
                                label={field.label}
                                value={value}
                                onChange={event =>
                                    handleChange(
                                        field,
                                        event
                                    )
                                }
                            />
                        )}

                        {field.type === "textarea" && (
                            <Textarea
                                label={field.label}
                                value={value}
                                onChange={event =>
                                    handleChange(
                                        field,
                                        event
                                    )
                                }
                            />
                        )}

                        {field.type === "date" && (
                            <TextInput
                                type="date"
                                label={field.label}
                                value={value}
                                onChange={event =>
                                    handleChange(
                                        field,
                                        event
                                    )
                                }
                            />
                        )}

                        {field.type === "select" && (
                            <SelectInput
                                label={field.label}
                                options={field.options || []}
                                value={value}
                                onChange={event =>
                                    handleChange(
                                        field,
                                        event
                                    )
                                }
                            />
                        )}

                        {submitted &&
                            field.required &&
                            !String(value).trim() && (

                                <p className="text-red-700">
                                    {field.error ||
                                        `${field.label} is required.`}
                                </p>

                            )}

                    </div>
                )
            })}

            {step.quantities && (
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
            )}

            <div className="flex gap-2 mt-6">

                {!isFirstStep && (
                    <Button
                        label="Back"
                        onClick={previousStep}
                    />
                )}

                <Button
                    label="Next"
                    onClick={handleNext}
                />

            </div>

        </div>
    )
}

export default FieldsStep