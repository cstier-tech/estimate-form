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

    handleComponentSameQty,
    handleComponentRequiresFinishing,

    updateKitItem,
    addKitItem,
    removeKitItem,
    buildKitsFromComponents,

    onSubmit,
    submitting,
    submitResult
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

                    handleComponentSameQty={
                        handleComponentSameQty
                    }

                    handleComponentRequiresFinishing={
                        handleComponentRequiresFinishing
                    }
                />
            )

        case "kitting":

            return (
                <KittingStep
                    formData={formData}

                    updateKitItem={
                        updateKitItem
                    }

                    addKitItem={
                        addKitItem
                    }

                    removeKitItem={
                        removeKitItem
                    }

                    buildKitsFromComponents={
                        buildKitsFromComponents
                    }
                />
            )

        case "review":

            return (
                <ReviewStep
                    formData={formData}
                    onSubmit={onSubmit}
                    submitting={submitting}
                    submitResult={submitResult}
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