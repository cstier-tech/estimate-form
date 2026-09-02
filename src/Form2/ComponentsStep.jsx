import { useWizard } from "react-use-wizard"

import Steppers from "./Steppers"

import JobComponents from "../form_sections/JobComponents"
import Button from "../components/Button"

function ComponentsStep({
    formData,

    updateComponent,
    addComponent,
    removeComponent,

    updateComponentQtyVal,
    removeComponentQty,

    saveComponent,

    handleComponentFinishingOps,
    updateComponentFinishingOpDetail,

    handleComponentSameQty,
    handleComponentRequiresFinishing
}) {

    const {
        nextStep,
        previousStep
    } = useWizard()

    return (
        <div>

            <Steppers formData={formData} />

            {formData.components.map(
                (component, index) => (

                    <JobComponents
                        key={component.id}
                        totalQtys={formData.quantities}
                        component={component}
                        index={index}
                        updateComponent={updateComponent}
                        updateComponentQtyVal={updateComponentQtyVal}
                        removeComponentQty={removeComponentQty}
                        removeComponent={removeComponent}
                        saveComponent={saveComponent}
                        handleFinishingOps={handleComponentFinishingOps}
                        updateFinishingOpDetail={updateComponentFinishingOpDetail}
                        handleSameQty={handleComponentSameQty}
                        handleRequiresFinishing={handleComponentRequiresFinishing}
                    />

                )
            )}

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

export default ComponentsStep