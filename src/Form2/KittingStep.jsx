import { useWizard } from "react-use-wizard"

import Steppers from "./Steppers"

import Kitting from "../form_sections/Kitting"
import Button from "../components/Button"

function KittingStep({
    formData,

    updateKitItem,
    addKitItem,
    removeKitItem,
    buildKitsFromComponents
}) {

    const {
        nextStep,
        previousStep
    } = useWizard()

    const kitCounts = formData.quantities
        .map(value => String(value ?? "").trim())
        .filter(Boolean)

    return (
        <div>

            <Steppers formData={formData} />

            <p className="text-sm text-gray-600 mb-4">
                {kitCounts.length > 0
                    ? `Kits to quote: ${kitCounts.join(", ")} (from the overview quantities). Enter qty per kit for each item.`
                    : "Add quantities on the overview step to set how many kits are quoted."}
            </p>

            <div className="mb-4">
                <Button
                    label="Build Kit from Components"
                    variant="info"
                    onClick={buildKitsFromComponents}
                />
            </div>

            {formData.kits.map((kitItem, index) => {

                // A "component" kit item is linked to a saved component;
                // Kitting uses it to prefill Qty per kit and to reconcile
                // per-kit demand against what the component will produce.
                const component = kitItem.componentId
                    ? formData.components.find(
                        c => c.id === kitItem.componentId
                    ) || null
                    : null

                return (
                    <Kitting
                        key={kitItem.id}
                        kitItem={kitItem}
                        index={index}
                        component={component}
                        totalQtys={formData.quantities}
                        updateKitItem={updateKitItem}
                        removeKitItem={removeKitItem}
                    />
                )
            })}

            <div className="mt-4">

                <Button
                    label="Add Kit Item"
                    onClick={addKitItem}
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

export default KittingStep
