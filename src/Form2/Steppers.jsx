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

    // const status = index === activeStep ? 'active' : index < activeStep ? 'completed' : upcoming

    return (
        <div className="flex gap-2 mb-6 justify-between">

            {visibleSteps.map((step, index) => (
                <div
                    key={step.id}
                    className='flex gap-2 items-center text-xs z-1 bg-white relative '
                // onClick={() => goToStep(index)}after:bg-gray-200 after:w-full after:absolute after:h-px after:top-[50%]
                >
                    <div
                        className={`rounded-full size-6 flex justify-center items-center 
                        ${index === activeStep && "font-bold text-white bg-blue-500"}
                        ${index < activeStep && "text-green-800 bg-green-200"}
                        ${index > activeStep && "text-gray-700 bg-gray-200"}
                        `}>
                        <span>{`${index + 1}`}</span>
                    </div>
                    <span className={`
                        ${index === activeStep && "font-bold text-blue-600"}
                        ${index < activeStep && "text-green-600"}
                        ${index > activeStep && "text-gray-500"}
                        `}>{step.title}</span>
                    {/* <Button
                        label={`${index + 1}. ${step.title}`}
                        onClick={() => goToStep(index)}
                        size="sm"
                        variant={
                            index === activeStep
                                ? "info"
                                : "primary"
                        }
                    /> */}
                </div>
            ))}
        </div>
    )
}

export default Steppers