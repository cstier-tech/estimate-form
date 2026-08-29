import CheckboxInput from "../components/CheckboxInput"
import TextInput from "../components/TextInput"
import FormSection from "../components/FormSection"

const SERVICE_TYPES = [
    'Kitting',
    'Packing',
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
        <div className="flex flex-col gap-1">
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
        </div>

    )
}

export default ServiceType