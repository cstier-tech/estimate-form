import CheckboxInput from "../components/CheckboxInput"
import TextInput from "../components/TextInput"
import FormSection from "../components/FormSection"

const SERVICE_TYPES = [
    'Kitting',
    'Packing',
    'Fulfillment',
    'Distribution',
    'Mailing',
    'Inkjet',
    'Inventory Storage',
    'Data Prep',
]

function ServiceType({
    serviceTypes,
    handleServiceTypes,
    isOtherType,
    setIsOtherType,
    otherServiceTypes,
    setOtherServiceTypes,
}) {
    return (
        <FormSection legend='Service Type'>
            <p className='mt-1 mb-0 text-sm text-gray-800'>Select all that apply</p>
            {SERVICE_TYPES.map((label) => (
                <CheckboxInput
                    key={label}
                    label={label}
                    name={label}
                    checked={serviceTypes.includes(label)}
                    onChange={handleServiceTypes}
                />
            ))}
            <CheckboxInput label='Other Service Types' checked={isOtherType} name='OtherService' onChange={(e) => setIsOtherType(e.target.checked)} />
            {isOtherType &&
                <TextInput label='Specify other service types (comma separate multiple types if more than 1)' value={otherServiceTypes} onChange={(e) => setOtherServiceTypes(e.target.value)} />
            }
        </FormSection>

    )
}

export default ServiceType