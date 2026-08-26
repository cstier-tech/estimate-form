import TextInput from "../components/TextInput"
import Quantities2 from "./Quantities2"
import FormSection from "../components/FormSection"
import Button from "../components/Button"

function Kitting({
    kit,
    updateKit,
    index,
    updateKitQtyCount,
    updateKitQtyVal,
    removeKit,
    removeKitQty
}) {
    const isAutomatic = kit.source === 'component'
    return (
        <FormSection bg="bg-sky-50" border="border-blue-200" legend={kit.Kit}>
            {isAutomatic && <p>auto added</p>}
            <TextInput
                label='What should be done with the overage?'
                value={kit.OverageAction}
                onChange={(e) => updateKit(index, 'OverageAction', e.target.value)} />
            <Quantities2
                label="Qty per kit"
                updateQtyCount={() => updateKitQtyCount(index)}
                updateQtyVal={(qtyIndex, value) => updateKitQtyVal(index, qtyIndex, value)}
                qtys={kit.quantities}
                removeQty={(qtyIndex) =>
                    removeKitQty(index, qtyIndex)
                }
            />
            <Button label='Delete' onClick={() => removeKit(index)} />
        </FormSection>
    )
}

export default Kitting