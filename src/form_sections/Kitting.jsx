import { useEffect } from "react"
import TextInput from "../components/TextInput"
import NumberInput from "../components/NumberInput"
import FormSection from "../components/FormSection"
import Button from "../components/Button"

const nf = new Intl.NumberFormat()

// The even split — component pieces produced divided by finished kits — taken
// from the first quote level where both numbers are known. Rounded to 2 dp so
// clean data lands on a whole number.
function suggestPerKit(component, totalQtys) {
    if (!component) return null
    for (let i = 0; i < totalQtys.length; i++) {
        const completed = Number(totalQtys[i]) || 0
        const produced = Number(component.quantities?.[i]) || 0
        if (completed > 0 && produced > 0) {
            return {
                value: Math.round((produced / completed) * 100) / 100,
                produced,
                completed,
            }
        }
    }
    return null
}

function Kitting({
    kitItem,
    index,
    updateKitItem,
    removeKitItem,
    // The component this kit item is built from (null for manual items) and the
    // completed-units quantities, used to prefill Qty per kit and to show how
    // per-kit demand compares to what the Components step will produce.
    component = null,
    totalQtys = [],
}) {
    const isFromComponent = kitItem.source === "component"
    const perKit = Number(kitItem.qtyPerKit) || 0

    // Set by "Build Kit from Components": a message when a component can't
    // cover one-per-kit, or the leftover pieces after an even split.
    const buildError = kitItem.error || ""
    const buildOverage = Number(kitItem.overage) || 0

    const suggestion = suggestPerKit(component, totalQtys)
    const suggestedValue = suggestion ? suggestion.value : null

    const levels = totalQtys
        .map((qty, i) => ({ completedUnits: Number(qty) || 0, i }))
        .filter(level => level.completedUnits > 0)

    const showReconciliation = Boolean(component) && perKit > 0 && levels.length > 0

    // An overage only exists when a level produces more pieces than its kits
    // consume — that leftover is what "overage action" is about.
    const hasLevelOverage = Boolean(component) && perKit > 0 && levels.some(({ completedUnits, i }) => {
        const produced = Number(component.quantities?.[i]) || 0
        return produced > perKit * completedUnits
    })

    const showOverage = hasLevelOverage || buildOverage > 0

    // Prefill the even split once, while the field is still untouched. Editing
    // it (or clearing it to a non-empty value) keeps the user's number. Skip
    // it entirely when the build flagged this item as impossible.
    useEffect(() => {
        if (buildError) return
        const current = kitItem.qtyPerKit
        if ((current === "" || current == null) && suggestedValue != null) {
            updateKitItem(index, "qtyPerKit", String(suggestedValue))
        }
    }, [buildError, suggestedValue, kitItem.qtyPerKit, index, updateKitItem])

    // Keep state matching the UI: an overage action that's no longer shown
    // shouldn't get saved.
    useEffect(() => {
        if (!showOverage && kitItem.overageAction) {
            updateKitItem(index, "overageAction", "")
        }
    }, [showOverage, kitItem.overageAction, index, updateKitItem])

    return (
        <FormSection
            bg="bg-sky-50"
            border="border-blue-200"
            legend={kitItem.name || `Kit Item ${index + 1}`}
        >
            {!isFromComponent && (
                <TextInput
                    label="Kit Item Name"
                    value={kitItem.name}
                    onChange={(e) => updateKitItem(index, "name", e.target.value)}
                />
            )}

            {buildError && (
                <p className="font-medium text-red-700">
                    {buildError}
                </p>
            )}

            <div className="flex flex-col gap-1">
                <NumberInput
                    label="Qty per kit"
                    value={kitItem.qtyPerKit}
                    onChange={(e) => updateKitItem(index, "qtyPerKit", e.target.value)}
                />
                {suggestion && (
                    <small className="text-xs text-gray-500">
                        Auto-filled from {nf.format(suggestion.produced)} produced ÷{" "}
                        {nf.format(suggestion.completed)} kits. Edit if the kit differs.
                    </small>
                )}
            </div>

            {showReconciliation && (
                <div className="rounded-md border border-blue-200 bg-white p-3 text-sm">
                    <p className="mb-1 font-semibold text-gray-700">
                        Per-kit demand vs. produced ({component.Component || "linked component"})
                    </p>
                    <ul className="flex flex-col gap-1">
                        {levels.map(({ completedUnits, i }) => {
                            const produced = Number(component.quantities?.[i]) || 0
                            const kitted = perKit * completedUnits
                            const diff = produced - kitted
                            return (
                                <li key={i} className="flex flex-wrap gap-x-2">
                                    <span className="text-gray-600">
                                        @ {nf.format(completedUnits)} kits:
                                    </span>
                                    <span>
                                        {nf.format(kitted)} needed / {nf.format(produced)} produced
                                    </span>
                                    {diff === 0 ? (
                                        <span className="font-medium text-green-700">matches</span>
                                    ) : (
                                        <span className="font-medium text-amber-700">
                                            {nf.format(Math.abs(diff))}{" "}
                                            {diff > 0 ? "more produced than kitted" : "short for kits"}
                                        </span>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            )}

            {showOverage && (
                <div className="flex flex-col gap-1">
                    {buildOverage > 0 && (
                        <small className="text-xs text-amber-700">
                            {nf.format(buildOverage)} pieces left over after an even split.
                        </small>
                    )}
                    <TextInput
                        label="What should be done with the overage?"
                        value={kitItem.overageAction}
                        onChange={(e) => updateKitItem(index, "overageAction", e.target.value)}
                    />
                </div>
            )}

            <Button label="Delete" onClick={() => removeKitItem(index)} />
        </FormSection>
    )
}

export default Kitting
