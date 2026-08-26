import CheckboxInput from '../components/CheckboxInput'
import FormSection from '../components/FormSection'
import NumberInput from '../components/NumberInput'
import Textarea from '../components/Textarea'
import TextInput from '../components/TextInput'

function PackagingRequirements({
    isKit,
    setIsKit,
    numOfKits,
    setNumOfKits,
    kitPackaging,
    setKitPackaging,
    kitContents,
    updateKitQtyPerKit,
    updateKitOverageHandling,
    kitInstructions,
    setKitInstructions
}) {
    return (
        <FormSection legend='Packaging Requirements'>
            <CheckboxInput label='Is this a kit?' name='IsKit' checked={isKit} onChange={(e) => setIsKit(e.target.checked)} />
            {/* if is kit, build out kits with prefilled contents (from components). total kits = Requested Production Quantity. each kit contains (total qty of component / requested production qty) which can be edited (only larger number, lower is invalid). If there is a difference between total qty of component and kit contents, ask why/what should be done with the extras */}

            {isKit &&
                <div className="flex flex-col gap-2">
                    <TextInput
                        label='Kit Packaging'
                        value={kitPackaging}
                        onChange={(e) => setKitPackaging(e.target.value)}
                    />
                    <NumberInput
                        label="# of Kits"
                        value={numOfKits}
                        onChange={(e) => setNumOfKits(e.target.value)}
                    />
                    <h5 className='mt-1 mb-0 text-sm font-semibold text-gray-800'>Kit Contents</h5>
                    {kitContents.map((kit, index) => (
                        <div key={index} className="flex flex-col gap-2 rounded-md border p-3 text-sm text-gray-700 bg-sky-50 border-sky-200">
                            <span className="text-lg text-gray-700 font-medium">{kit.Component || `Component ${index + 1}`}</span>
                            <NumberInput
                                label="Qty per kit"
                                value={kit.qtyPerKit}
                                onChange={(e) => updateKitQtyPerKit(index, e.target.value)}
                            />
                            <span className='text-red-600 text-xs'>Overage: {kit.overage}</span>
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
                    <Textarea name='KitInstructions' label='Kitting Instructions' value={kitInstructions} onChange={(e) => setKitInstructions(e.target.value)} />
                </div>
            }
        </FormSection>
    )
}

export default PackagingRequirements
