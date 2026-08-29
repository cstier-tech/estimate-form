import NumberInput from '../components/NumberInput'
import Button from '../components/Button'
import FormSection from '../components/FormSection'
import CheckboxInput from '../components/CheckboxInput'

function Quantities({
    // prodQty,
    // setProdQty,
    addQtys,
    updateQty,
    removeQty,
    addQtyToPrice,
    // sameQty,
    // setSameQty
}) {
    return (
        <div>
            <h4>Quantities</h4>
            {/* <NumberInput label='Requested Production Quantity' name='qty' value={prodQty} onChange={(e) => setProdQty(e.target.value)} /> */}
            {/* <CheckboxInput label='Same as Production Quantity' name='SameQty' checked={sameQty} onChange={(e) => setSameQty(e.target.checked)} /> */}
            {addQtys.map((addQty, index) => (
                <div className='flex items-end gap-2' key={index}>
                    <NumberInput
                        // label='Quantity'
                        index={index}
                        value={addQty}
                        onChange={(e) => updateQty(index, e.target.value)}
                    />
                    {index < (addQtys.length - 1) &&
                        <Button label='x' onClick={() => removeQty(index)} />
                    }
                    {index == addQtys.length - 1 &&
                        <Button
                            label="Add Additional Qty to price"
                            onClick={addQtyToPrice}
                        />
                    }
                </div>

            ))}

        </div>
    )
}

export default Quantities
