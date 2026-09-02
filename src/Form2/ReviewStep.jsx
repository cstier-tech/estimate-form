import { useWizard } from "react-use-wizard"

import Steppers from "./Steppers"
import Button from "../components/Button"

function ReviewStep({
    formData,
    onSubmit,
    submitting = false,
    submitResult = null
}) {

    const {
        previousStep
    } = useWizard()

    const succeeded = submitResult?.ok === true
    const failed = submitResult && submitResult.ok === false

    const quantities =
        formData.quantities
            .filter(qty =>
                String(qty).trim() !== ""
            )

    const components =
        formData.components
            .filter(component =>
                String(
                    component.Component || ""
                ).trim() !== ""
            )

    return (
        <div>

            <Steppers formData={formData} />

            <h3>
                Review
            </h3>

            <p>
                <strong>RFE Name:</strong>{" "}
                {formData.rfe_name}
            </p>

            <p>
                <strong>Customer:</strong>{" "}
                {formData.customer_name}
            </p>

            <p>
                <strong>Description:</strong>{" "}
                {formData.description}
            </p>

            <p>
                <strong>Quantities:</strong>
            </p>

            <ul>
                {quantities.map(
                    (qty, index) => (
                        <li key={index}>
                            {qty}
                        </li>
                    )
                )}
            </ul>

            <p>
                <strong>Components:</strong>
            </p>

            <ul>
                {components.map(
                    component => (
                        <li
                            key={
                                component.id
                            }
                        >
                            {component.Component}
                        </li>
                    )
                )}
            </ul>

            <div className="flex gap-2 mt-6">

                <Button
                    label="Back"
                    onClick={previousStep}
                    disabled={submitting}
                />

                <Button
                    label={
                        submitting
                            ? "Submitting…"
                            : succeeded
                                ? "Submitted"
                                : "Submit"
                    }
                    variant="success"
                    onClick={onSubmit}
                    disabled={submitting || succeeded}
                />

            </div>

            {failed && (
                <p className="text-red-700 mt-3">
                    {submitResult.error?.message ||
                        "Something went wrong saving the RFE."}
                </p>
            )}

            {succeeded && (
                <p className="text-emerald-700 mt-3">
                    RFE saved successfully.
                </p>
            )}

        </div>
    )
}

export default ReviewStep