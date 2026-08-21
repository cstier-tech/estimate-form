import NumberInput from '../components/NumberInput'
import Button from '../components/Button'
import FormSection from '../components/FormSection'

function Quantities({
    prodQty,
    setProdQty,
    addQtys,
    updateQty,
    removeQty,
    addQtyToPrice,
}) {
    return (
        <>
            <NumberInput label='Requested Production Quantity' name='qty' value={prodQty} onChange={(e) => setProdQty(e.target.value)} />
            {addQtys.map((addQty, index) => (
                <div className='flex items-end gap-2' key={index}>
                    <NumberInput
                        label='Additional quantity to price'
                        index={index}
                        value={addQty}
                        onChange={(e) => updateQty(index, e.target.value)}
                    />
                    <Button label='x' onClick={() => removeQty(index)} />
                </div>

            ))}
            <Button
                label="Add Additional Qty to price"
                onClick={addQtyToPrice}
            />
        </>
    )
}

export default Quantities
