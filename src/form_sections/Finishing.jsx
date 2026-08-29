import CheckboxInput from "../components/CheckboxInput"
import TextInput from "../components/TextInput"
import FormSection from "../components/FormSection"
import SelectInput from "../components/SelectInput"

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

    },
    {
        label: 'Folding',
        value: 'folding',
        fields: [
            {
                label: 'Fold Type',
                name: 'foldType',
                type: 'select',
                options: [
                    {
                        label: 'Trifold',
                        value: 'trifold'
                    },
                    {
                        label: 'Roll Fold',
                        value: 'rollfold'
                    },
                    {
                        label: 'Other',
                        value: 'other'
                    },
                ]
            },
            // only show this is Other from above is selected? 
            {
                label: 'Specify Other',
                name: 'otherfoldtype',
                type: 'text',
                showWhen: { field: 'foldType', value: 'other' }
            }
        ],
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
        <div>
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
                                {op.fields.map((field, i) => {
                                    if (field.showWhen && selectedOp.details[field.showWhen.field] !== field.showWhen.value) {
                                        return null;
                                    }
                                    return (
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
                                            {field.type === 'select' &&
                                                <SelectInput
                                                    label={field.label}
                                                    name={field.name}
                                                    options={field.options}
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
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>

    )
}

export default FinishingOp


