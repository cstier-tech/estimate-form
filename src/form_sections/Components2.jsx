import TextInput from "../components/TextInput"
import Quantities2 from "./Quantities2"
import FormSection from "../components/FormSection"
import Button from "../components/Button"
import FinishingOp from "./Finishing"
import CheckboxInput from "../components/CheckboxInput"
import SelectInput from "../components/SelectInput"

const COMPONENT_SOURCE = [
    { label: 'Select Source', value: '' },
    { label: 'LCP Production', value: 'lcp-prod' },
    { label: 'Customer Supplied', value: 'customer-supplied' },
    { label: 'Veracore Inventory', value: 'veracore-inventory' },
]

function Components2({
    component,
    updateComponent,
    index,
    updateComponentQtyCount,
    updateComponentQtyVal,
    saveComponent,
    removeComponent,
    removeComponentQty,
    handleFinishingOps,
    updateFinishingOpDetail,
    handleSameQty,

}) {

    return (
        <FormSection bg="bg-sky-50" border="border-blue-200" legend={`Component ${index + 1}`}>
            <TextInput
                label='Component Name'
                value={component.Component}
                onChange={(e) => updateComponent(index, 'Component', e.target.value)} />
            <SelectInput options={COMPONENT_SOURCE} />
            <TextInput
                label='Size'
                value={component.Size}
                onChange={(e) => updateComponent(index, 'Size', e.target.value)} />
            <TextInput
                label='Flat Size'
                value={component.FlatSize}
                onChange={(e) => updateComponent(index, 'FlatSize', e.target.value)} />
            <TextInput
                label='Stock'
                value={component.Stock}
                onChange={(e) => updateComponent(index, 'Stock', e.target.value)} />
            <TextInput
                label='Coating'
                value={component.Coating}
                onChange={(e) => updateComponent(index, 'Coating', e.target.value)} />
            {!component.SameQty &&
                <Quantities2
                    updateQtyCount={() => updateComponentQtyCount(index)}
                    updateQtyVal={(qtyIndex, value) => updateComponentQtyVal(index, qtyIndex, value)}
                    qtys={component.quantities}
                    removeQty={(qtyIndex) => removeComponentQty(index, qtyIndex)}
                />
            }

            <CheckboxInput
                label="Quantity is the same as Total Finished Qty(s)"
                name={`SameQty${index}`}
                checked={component.SameQty}
                onChange={(e) => handleSameQty(index, e.target.checked)}
            />
            {component.SameQty && 
            <div>
                <h5>Applied Qtys:</h5>
                <ul className="list-decimal list-inside">
                {component.quantities.map((q, i) => (
                    <li key={i}>{q}</li>
                ))}
                </ul>
            </div>
            }
            <FinishingOp
                componentId={component.id}
                finishingOps={component.finishingOps}
                handleFinishingOps={(e) =>
                    handleFinishingOps(index, e)
                }
                updateFinishingOpDetail={(opValue, fieldName, value) =>
                    updateFinishingOpDetail(
                        index,
                        opValue,
                        fieldName,
                        value
                    )
                }
            />
            <div className="flex gap-2 justify-between">
                <Button size="mdFull" variant="danger" label='Remove Component' onClick={() => removeComponent(index)} />
                <Button
                    variant="success"
                    label="Save Component"
                    onClick={() => saveComponent(index)}
                    size="mdFull"
                />
            </div>

        </FormSection>
    )
}

export default Components2