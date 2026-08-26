import CheckboxInput from "../components/CheckboxInput"
import TextInput from "../components/TextInput"
import FormSection from "../components/FormSection"

const FINISHING_OPS = [
    {
        label: 'Perf',
        value: 'perf',
        fields: [
            {
                name: 'performedBy',
                label: 'Performed By?',
                type: 'text'
            },
            {
                name: 'perfType',
                label: 'Perf Type',
                type: 'text'
            },
            {
                name: 'perfLocation',
                label: 'Perf Location',
                type: 'text'
            }
        ]
    },
    {
        label: 'Hole Drill',
        value: 'hole-drill',
        // fields: 'Performed By?'
    },
    {
        label: 'Score',
        value: 'score',
        // fields: 'Performed By?'
    },
    {
        label: 'Folding',
        value: 'folding',
        fields: [

        ]
    },
    {
        label: 'Glue / Seal',
        value: 'glue-seal',
        fields: [
            {
                name: 'TabGlue',
                label: 'Tab Glue',
                type: 'checkbox'
            },
            {
                name: 'GlueDots',
                label: 'Glue Dots',
                type: 'checkbox'
            },
            {
                name: 'FugitiveGlue',
                label: 'Fugitive Glue',
                type: 'checkbox'
            },
            {
                name: '2SidedTape',
                label: 'Double Sided Tape',
                type: 'checkbox'
            },
        ]
    },
    {
        label: 'Trim',
        value: 'trim',
        fields: [
            {
                name: 'TrimTo',
                label: 'Trim To',
                type: 'text'
            }
        ]
    },
    {
        label: 'Other',
        value: 'other',
        fields: [
            {
                name: 'SpecifyOther',
                label: 'Specify Other',
                type: 'text'
            }
        ]
    }
]

function FinishingOp({
    finishingOps,
    handleFinishingOps,
    updateFinishingOpDetail,
    componentId

}) {
    return (
        <FormSection legend='Finishing'>
            <p className='mt-1 mb-0 text-sm text-gray-800'>Select all that apply</p>
            {FINISHING_OPS.map(op => {
                const selectedOp = finishingOps.find(
                    item => item.value === op.value
                );

                return (
                    <div key={op.value}>
                        <CheckboxInput
                            label={op.label}
                            name={op.value}
                            checked={!!selectedOp}
                            onChange={handleFinishingOps}
                            id={`component-${componentId}-finishing-${op.value}`}
                        />

                        {selectedOp && op.fields && (
                            <div className="ml-6 mb-4 space-y-3 pt-2">
                                {op.fields.map((field, i) => (
                                    <div key={i}>
                                        {field.type === 'text' &&
                                            <TextInput
                                                key={field.name}
                                                label={field.label}
                                                value={selectedOp.details[field.name] || ''}
                                                onChange={(e) =>
                                                    updateFinishingOpDetail(
                                                        op.value,
                                                        field.name,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        }
                                        {field.type === 'checkbox' &&
                                            <CheckboxInput
                                                label={field.label}
                                                name={field.name}
                                                id={`component-${componentId}-finishing-${op.value}-${field.name}`}
                                                checked={selectedOp.details[field.name] || false}
                                                onChange={(e) =>
                                                    updateFinishingOpDetail(
                                                        op.value,
                                                        field.name,
                                                        e.target.checked
                                                    )
                                                }
                                            />
                                        }
                                    </div>


                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </FormSection>

    )
}

export default FinishingOp


