import {
    useWizard
} from "react-use-wizard"

import {
    FORM_STEPS
} from "./formConfig"
import Button from "../components/Button"

function Steppers() {

    const {activeStep, goToStep} = useWizard()

    return (
        <div className="flex gap-2 mb-6">

            {FORM_STEPS.map(
                (step, index) => (

                    <div
                        key={step.id}
                        className={
                            index === activeStep
                                ? "font-bold"
                                : "text-gray-500"
                        }
                    >
                        {/* {index + 1}.
                        {" "}
                        {step.title} */}
                        <Button
                            // key={step.id}
                            label={(index + 1).toString() + ". " + step.title}
                            onClick={() => goToStep(index)}
                            size='sm'
                            variant={index === activeStep ? 'info' : 'primary'}
                        />
                    </div>

                )
            )}

        </div>
    )
}

export default Steppers