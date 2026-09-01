import { useWizard } from "react-use-wizard"

import Steppers from "./Steppers"

import PackingDistribution from "../form_sections/PackDistribution"
import Button from "../components/Button"

function PackingStep({
    formData,
    addPackDistribution,
    updatePackDistribution,
}) {

    const {
        nextStep,
        previousStep
    } = useWizard()

    return (
        <div>

            <Steppers />

            {(formData.packDistribution || []).map(
                (rows, levelIndex) => (

                    <PackingDistribution
                        key={levelIndex}
                        rows={rows}
                        levelIndex={levelIndex}
                        onChange={(nextRows) => updatePackDistribution(nextRows, levelIndex)}
                        completedUnits={Number(formData.quantities?.[levelIndex] || 0)}
                    />

                )
            )}

            <div className="mt-4">

                <Button
                    label="Add Pack Distribution"
                    onClick={addPackDistribution}
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


export default PackingStep