import { useWizard } from "react-use-wizard"

import Steppers from "./Steppers"
import Button from "../components/Button"

function ReviewStep({
    formData,
    onSubmit
}) {

    const {
        previousStep
    } = useWizard()

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

            <Steppers />

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
                />

                <Button
                    label="Submit"
                    onClick={onSubmit}
                />

            </div>

        </div>
    )
}

export default ReviewStep