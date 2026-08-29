import TextInput from "../components/TextInput"
import QuantityControl from "./QuantityControl"
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

function JobComponents({
    totalQtys,
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
    handleRequiresFinishing,

}) {

    return (
        <FormSection bg="bg-sky-50" border="border-blue-200" legend={`Component ${index + 1}`}>
            <div className="md:grid gap-3 md:grid-cols-2">


                <TextInput
                    label='Component Name'
                    value={component.Component}
                    onChange={(e) => updateComponent(index, 'Component', e.target.value)} />
                <SelectInput
                    label='Component Source'
                    options={COMPONENT_SOURCE}
                    value={component.Source}
                    onChange={(e) => updateComponent(index, 'Source', e.target.value)} />
                {component.Source == 'lcp-prod' &&
                    <div>
                        <TextInput
                            label='Job Number'
                            value={component.JobNo}
                            onChange={(e) => updateComponent(index, 'JobNo', e.target.value)} />
                    </div>
                }
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
                <div className="col-span-2 flex flex-col gap-3">
                    <h5 className="font-semibold">How many pieces of this component?</h5>

                    <QuantityControl
                        label={(qty) => `@ ${qty || '—'}`}
                        updateQtyVal={(qtyIndex, value) => updateComponentQtyVal(index, qtyIndex, value)}
                        qtys={component.quantities}
                        removeQty={(qtyIndex) => removeComponentQty(index, qtyIndex)}
                        rows={totalQtys}
                        disabled={component.SameQty}
                    />


                    <CheckboxInput
                        label="Quantity is the same as Total Finished Qty(s)"
                        name={`SameQty${index}`}
                        checked={component.SameQty}
                        onChange={(e) => handleSameQty(index, e.target.checked)}
                    />
                </div>

                <div className="col-span-2 flex flex-col gap-2">
                    <CheckboxInput
                        label='Does this component require finishing?'
                        name={`RequiresFinishing${index}`}
                        checked={component.requiresFinishing}
                        onChange={(e) => handleRequiresFinishing(index, e.target.checked)}
                    />
                    {component.requiresFinishing &&
                        <>
                            <h5 className="font-semibold">Select all that apply</h5>
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
                        </>
                    }


                </div>

            </div>
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

export default JobComponents