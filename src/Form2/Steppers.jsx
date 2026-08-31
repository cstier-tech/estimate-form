import {
    useWizard
} from "react-use-wizard"

import {
    FORM_STEPS
} from "./formConfig"

function Steppers() {

    const {
        activeStep
    } = useWizard()

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
                        {index + 1}.
                        {" "}
                        {step.title}
                    </div>

                )
            )}

        </div>
    )
}

export default Steppers