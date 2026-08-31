import { useWizard } from "react-use-wizard"

import Steppers from "./Steppers"

import Kitting from "../form_sections/Kitting"
import Button from "../components/Button"

function KittingStep({
    formData,

    updateKit,
    addKit,
    removeKit,

    updateKitQtyCount,
    updateKitQtyVal,
    removeKitQty
}) {

    const {
        nextStep,
        previousStep
    } = useWizard()

    return (
        <div>

            <Steppers />

            {formData.kits.map(
                (kit, index) => (

                    <Kitting
                        key={
                            kit.componentId ||
                            `manual-${index}`
                        }

                        kit={kit}
                        index={index}

                        updateKit={
                            updateKit
                        }

                        updateKitQtyCount={
                            updateKitQtyCount
                        }

                        updateKitQtyVal={
                            updateKitQtyVal
                        }

                        removeKit={
                            removeKit
                        }

                        removeKitQty={
                            removeKitQty
                        }
                    />

                )
            )}

            <div className="mt-4">

                <Button
                    label="Add Kit"
                    onClick={addKit}
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