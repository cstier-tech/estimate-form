import {
    useWizard
} from "react-use-wizard"

import {
    FORM_STEPS
} from "./formConfig"
import Button from "../components/Button"

import { shouldShow } from "./fieldVisibility"

function Steppers({ formData }) {
    const { activeStep, goToStep } = useWizard()

    const visibleSteps = FORM_STEPS.filter(
        step => shouldShow(step, formData)
    )

    return (
        <div className="flex gap-2 mb-6">
            {visibleSteps.map((step, index) => (
                <div
                    key={step.id}
                    className={
                        index === activeStep
                            ? "font-bold"
                            : "text-gray-500"
                    }
                >
                    <Button
                        label={`${index + 1}. ${step.title}`}
                        onClick={() => goToStep(index)}
                        size="sm"
                        variant={
                            index === activeStep
                                ? "info"
                                : "primary"
                        }
                    />
                </div>
            ))}
        </div>
    )
}

export default Steppers