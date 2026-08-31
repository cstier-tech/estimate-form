import { useWizard } from "react-use-wizard"
import JobComponents from "../form_sections/JobComponents"
import Button from "../components/Button"

function StepTwo({
    formData,
    updateComponent,
    addComponent,
    removeComponent,
    updateComponentQtyVal,
    removeComponentQty
}) {

    const { nextStep, previousStep } = useWizard()

    return (
        <div>

            {formData.components.map((component, index) => (
                <JobComponents
                    key={component.component_key}
                    totalQtys={formData.quantities}
                    component={component}
                    index={index}

                    updateComponent={updateComponent}

                    updateComponentQtyVal={
                        updateComponentQtyVal
                    }

                    removeComponentQty={
                        removeComponentQty
                    }

                    removeComponent={
                        removeComponent
                    }
                />
            ))}

            <div className="mt-4">
                <Button
                    label="Add Component"
                    onClick={addComponent}
                />
            </div>

            <div className="flex gap-2 mt-6">

                <Button
                    label="Back"
                    onClick={previousStep}
                />

                <Button
                    label="Next"
                    onClick={nextStep}
                />

            </div>

        </div>
    )
}

export default StepTwo