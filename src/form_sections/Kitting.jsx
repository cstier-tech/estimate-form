import TextInput from "../components/TextInput"
import QuantityControl from "./QuantityControl"
import FormSection from "../components/FormSection"
import Button from "../components/Button"

const fmt = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2))

// Pieces of `component` that belong in a single kit at completed-units level `i`:
// the component quantity divided by the number of completed units.
function expectedPerKit(component, completedUnits, i) {
    const componentQty = Number(component?.quantities?.[i])
    const units = Number(completedUnits?.[i])
    if (!component || !componentQty || !units) return null
    return componentQty / units
}

function Kitting({
    kit,
    updateKit,
    index,
    updateKitQtyCount,
    updateKitQtyVal,
    removeKit,
    removeKitQty,
    // The component this kit was generated from (automatic kits only) and the
    // project-level completed-units quantities, used to suggest a qty per kit
    // and flag discrepancies.
    component = null,
    completedUnits = [],
}) {
    const isAutomatic = kit.source === 'component'
    return (
        <FormSection bg="bg-sky-50" border="border-blue-200" legend={kit.Kit || `Kit ${index + 1}`}>
            {!isAutomatic &&
                <TextInput
                    label="Kit Name"
                    value={kit.Kit}
                    onChange={(e) => updateKit(index, 'Kit', e.target.value)}
                />
            }
            {/* <TextInput
                label='What should be done with the overage?'
                value={kit.OverageAction}
                onChange={(e) => updateKit(index, 'OverageAction', e.target.value)} /> */}
            <QuantityControl
                label="Qty per kit"
                updateQtyCount={() => updateKitQtyCount(index)}
                updateQtyVal={(qtyIndex, value) => updateKitQtyVal(index, qtyIndex, value)}
                qtys={kit.quantities}
                removeQty={(qtyIndex) =>
                    removeKitQty(index, qtyIndex)
                }
            />
            {isAutomatic && component &&
                <ul className="mt-2 flex flex-col gap-1 text-sm">
                    {completedUnits.map((units, i) => {
                        const expected = expectedPerKit(component, completedUnits, i)
                        if (expected == null) return null

                        const raw = kit.quantities?.[i]
                        const hasEntered = raw !== "" && raw != null
                        const diff = hasEntered ? Number(raw) - expected : 0

                        return (
                            <li key={i}>
                                <span className="text-gray-600">
                                    @ {units || '—'} completed units — expected {fmt(expected)} per kit
                                    {' '}({component.Component || 'component'} qty {component.quantities?.[i] || 0} ÷ {units})
                                </span>
                                {hasEntered && diff !== 0 &&
                                    <span className={`ml-2 font-semibold ${diff > 0 ? 'text-amber-700' : 'text-red-700'}`}>
                                        {fmt(Math.abs(diff))} {diff > 0 ? 'more' : 'less'} than expected
                                    </span>
                                }
                            </li>
                        )
                    })}
                </ul>
            }
            <Button label='Delete' onClick={() => removeKit(index)} />
        </FormSection>
    )
}

export default Kitting
