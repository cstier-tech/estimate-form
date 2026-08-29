import Button from "../components/Button"
import NumberInput from "../components/NumberInput"

function QuantityControl({ qtys, updateQtyVal, updateQtyCount, label = 'Quantity', removeQty, addQtyBtnText = 'Add Qty', rows = qtys, allowRemove, allowAdd, disabled }) {
    return (
        <div className="flex flex-col gap-2">
            {rows.map((qty, i) => (
                <div key={i} className="flex items-end gap-2">
                    <NumberInput label={typeof label === 'function' ? label(qty, i) : label} key={i} index={i} value={qtys?.[i] ?? ''} disabled={disabled} onChange={(e) => updateQtyVal(i, e.target.value)} />
                    {allowRemove && (rows.length) > 1 &&
                        <Button variant="danger" label='x' onClick={() => removeQty(i)} />
                    }
                </div>
            ))}
            {allowAdd &&
                <div className="mt-3">
                    <Button label={addQtyBtnText} onClick={updateQtyCount} />
                </div>
            }


        </div>
    )
}

export default QuantityControl