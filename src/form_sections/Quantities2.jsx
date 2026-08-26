import Button from "../components/Button"
import NumberInput from "../components/NumberInput"

function Quantities2({ qtys, updateQtyVal, updateQtyCount, label = 'Quantity', removeQty }) {
    return (
        <div>
            {qtys.map((qty, i) => (
                <div key={i} className="flex items-end gap-2">
                    <NumberInput label={label} key={i} index={i} value={qty} onChange={(e) => updateQtyVal(i, e.target.value)} />
                    <Button variant="danger" label='x' onClick={() => removeQty(i)} />
                </div>
            ))}
            <div className="mt-3">
                <Button label='Add Qty' onClick={updateQtyCount} />
            </div>
            
        </div>
    )
}

export default Quantities2