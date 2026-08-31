import FieldsStep from "./FieldsStep"
import ComponentsStep from "./ComponentsStep"
import KittingStep from "./KittingStep"
import ReviewStep from "./ReviewStep"

function StepRenderer({
    step,

    formData,
    updateFormData,

    updateQuantity,
    addQuantity,
    removeQuantity,

    updateComponent,
    addComponent,
    removeComponent,

    updateComponentQtyVal,
    removeComponentQty,

    saveComponent,

    handleComponentFinishingOps,
    updateComponentFinishingOpDetail,

    updateKit,
    addKit,
    removeKit,

    updateKitQtyCount,
    updateKitQtyVal,
    removeKitQty,

    onSubmit
}) {

    switch (step.type) {

        case "fields":

            return (
                <FieldsStep
                    step={step}
                    formData={formData}
                    updateFormData={
                        updateFormData
                    }

                    updateQuantity={
                        updateQuantity
                    }

                    addQuantity={
                        addQuantity
                    }

                    removeQuantity={
                        removeQuantity
                    }
                />
            )

        case "components":

            return (
                <ComponentsStep
                    formData={formData}

                    updateComponent={
                        updateComponent
                    }

                    addComponent={
                        addComponent
                    }

                    removeComponent={
                        removeComponent
                    }

                    updateComponentQtyVal={
                        updateComponentQtyVal
                    }

                    removeComponentQty={
                        removeComponentQty
                    }

                    saveComponent={
                        saveComponent
                    }

                    handleComponentFinishingOps={
                        handleComponentFinishingOps
                    }

                    updateComponentFinishingOpDetail={
                        updateComponentFinishingOpDetail
                    }
                />
            )

        case "kitting":

            return (
                <KittingStep
                    formData={formData}

                    updateKit={
                        updateKit
                    }

                    addKit={
                        addKit
                    }

                    removeKit={
                        removeKit
                    }

                    updateKitQtyCount={
                        updateKitQtyCount
                    }

                    updateKitQtyVal={
                        updateKitQtyVal
                    }

                    removeKitQty={
                        removeKitQty
                    }
                />
            )

        case "review":

            return (
                <ReviewStep
                    formData={formData}
                    onSubmit={onSubmit}
                />
            )

        default:

            return (
                <div>
                    Unknown step type:
                    {" "}
                    {step.type}
                </div>
            )
    }
}

export default StepRenderer