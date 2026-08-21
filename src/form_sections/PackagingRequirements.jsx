import CheckboxInput from '../components/CheckboxInput'
import FormSection from '../components/FormSection'
import NumberInput from '../components/NumberInput'
import TextInput from '../components/TextInput'

function PackagingRequirements({
    isKit,
    setIsKit,
    numOfKits,
    setNumOfKits,
    kitContents,
    updateKitQtyPerKit,
    updateKitOverageHandling,
}) {
    return (
        <FormSection legend='Packaging Requirements'>
            <CheckboxInput label='Is this a kit?' name='IsKit' checked={isKit} onChange={(e) => setIsKit(e.target.checked)} />
            {/* if is kit, build out kits with prefilled contents (from components). total kits = Requested Production Quantity. each kit contains (total qty of component / requested production qty) which can be edited (only larger number, lower is invalid). If there is a difference between total qty of component and kit contents, ask why/what should be done with the extras */}

            {isKit &&
                <div className="flex flex-col gap-2">
                    <NumberInput
                        label="# of Kits"
                        value={numOfKits}
                        onChange={(e) => setNumOfKits(e.target.value)}
                    />
                    <h5 className='mt-1 mb-0 text-sm font-semibold text-gray-800'>Kit Contents</h5>
                    {kitContents.map((kit, index) => (
                        <div key={index} className="flex flex-col gap-2 rounded-md border border-gray-200 p-3 text-sm text-gray-700">
                            <span className="font-medium text-gray-800">{kit.Component || `Component ${index + 1}`}</span>
                            <NumberInput
                                label="Qty per kit"
                                value={kit.qtyPerKit}
                                onChange={(e) => updateKitQtyPerKit(index, e.target.value)}
                            />
                            <span>Overage: {kit.overage}</span>
                            {kit.overage > 0 &&
                                <TextInput
                                    label="What should be done with the overage?"
                                    value={kit.overageHandling}
                                    onChange={(e) => updateKitOverageHandling(index, e.target.value)}
                                    required
                                />
                            }
                        </div>
                    ))}
                </div>
            }
        </FormSection>
    )
}

export default PackagingRequirements
