import { useState } from "react";
import FormSection from "../components/FormSection";
import NumberInput from "../components/NumberInput";
import SelectInput from "../components/SelectInput";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import CheckboxInput from "../components/CheckboxInput";
import RadioGroup from "../components/RadioGroup";
import Textarea from "../components/Textarea";

const COMPONENT_SOURCE = [
    { label: 'Select Source', value: '' },
    { label: 'LCP Production', value: 'lcp-prod' },
    { label: 'Customer Supplied', value: 'customer-supplied' },
    { label: 'Veracore Inventory', value: 'veracore-inventory' },
]

const FOLD_TYPE = [
    { label: 'None', value: '' },
    { label: 'Bifold', value: 'Bifold' },
    { label: 'Trifold', value: 'Trifold' },
    { label: 'Roll Fold', value: 'Roll Fold' },
    { label: 'Score Only', value: 'Score Only' },
    { label: 'Die Cut', value: 'Die Cut' },
    { label: 'Other', value: 'Other' },
]

const PERFORMED_BY_OPTIONS = [
    { label: 'LCP', value: 'LCP' },
    { label: 'LCP Complete', value: 'LCPC' },
]

function Component({
    component,
    index,
    updateComponent,
    removeComponent,
    addQtys
}) {

    return (
        <fieldset className="rounded-lg border border-sky-200 bg-sky-50 p-4 flex flex-col gap-3">
            <legend className="px-1 text-sm font-semibold text-gray-800">
                Component {index + 1}
            </legend>

            <TextInput
                label="Component Name"
                value={component.Component}
                onChange={(e) =>
                    updateComponent(
                        index,
                        'Component',
                        e.target.value
                    )
                }
            />

            <TextInput
                label="Size"
                value={component.Size}
                placeholder='W x H'
                onChange={(e) =>
                    updateComponent(
                        index,
                        'Size',
                        e.target.value
                    )
                }
            />
            {!component.SameQty &&
                <NumberInput
                    label="Total Qty"
                    value={component.ComponentQty}
                    onChange={(e) =>
                        updateComponent(
                            index,
                            'ComponentQty',
                            e.target.value
                        )
                    }
                />
            }

            <CheckboxInput label='Same as production quantity/quantities' name='SameQty' checked={component.SameQty || false} onChange={(e) =>
                updateComponent(
                    index,
                    'SameQty',
                    e.target.checked
                )
            } />
            {component.SameQty && 
                <div>
                   {addQtys.map((qty) => (
                    <p>{qty}</p>
                   ))}
                </div>
             } 
            <TextInput
                label="Stock"
                value={component.Stock}
                placeholder='e.g. Kallima 8pt C2S'
                onChange={(e) =>
                    updateComponent(
                        index,
                        'FinalSStockize',
                        e.target.value
                    )
                }
            />
            <TextInput
                label="Coating"
                value={component.Coating}
                placeholder='e.g. AQ Satin both sides, UV Side 1 only'
                onChange={(e) =>
                    updateComponent(
                        index,
                        'Coating',
                        e.target.value
                    )
                }
            />
            <SelectInput
                label="Source"
                value={component.ComponentSource}
                options={COMPONENT_SOURCE}
                onChange={(e) =>
                    updateComponent(
                        index,
                        'ComponentSource',
                        e.target.value
                    )
                }
            />
            {/* <TextInput
                label="PI Part Number"
                value={component.PIPartNumber}
                onChange={(e) =>
                    updateComponent(
                        index,
                        'PIPartNumber',
                        e.target.value
                    )
                }
            /> */}
            {/* <hr />
            <h3>Finishing</h3>
            <div>
                <CheckboxInput
                    label='Perf'
                    name={`Perf-${index}`}
                    checked={finishing.Perf?.Required || false}
                    onChange={(e) =>
                        updateFinishingGroup(
                            'Perf',
                            'Required',
                            e.target.checked
                        )
                    }
                />
                {finishing.Perf?.Required && (
                    <RadioGroup
                        label='Performed by'
                        name={`PerfPerformedBy-${index}`}
                        options={PERFORMED_BY_OPTIONS}
                        value={finishing.Perf?.PerformedBy}
                        onChange={(e) =>
                            updateFinishingGroup(
                                'Perf',
                                'PerformedBy',
                                e.target.value
                            )
                        }
                    />
                )}

                <CheckboxInput
                    label='Hole Drill'
                    name={`HoleDrill-${index}`}
                    checked={finishing.HoleDrill?.Required || false}
                    onChange={(e) =>
                        updateFinishingGroup(
                            'HoleDrill',
                            'Required',
                            e.target.checked
                        )
                    }
                />
                {finishing.HoleDrill?.Required && (
                    <>
                        <RadioGroup
                            label='Performed by'
                            name={`HoleDrillPerformedBy-${index}`}
                            options={PERFORMED_BY_OPTIONS}
                            value={finishing.HoleDrill?.PerformedBy}
                            onChange={(e) =>
                                updateFinishingGroup(
                                    'HoleDrill',
                                    'PerformedBy',
                                    e.target.value
                                )
                            }
                        />
                        <NumberInput
                            label='# of Holes'
                            value={finishing.HoleDrill?.Count || ''}
                            onChange={(e) =>
                                updateFinishingGroup(
                                    'HoleDrill',
                                    'Count',
                                    e.target.value
                                )
                            }
                        />
                        <TextInput
                            label='Hole Size'
                            value={finishing.HoleDrill?.Size || ''}
                            onChange={(e) =>
                                updateFinishingGroup(
                                    'HoleDrill',
                                    'Size',
                                    e.target.value
                                )
                            }
                        />
                        <TextInput
                            label='Distance from Top'
                            value={finishing.HoleDrill?.DistanceFromTop || ''}
                            onChange={(e) =>
                                updateFinishingGroup(
                                    'HoleDrill',
                                    'DistanceFromTop',
                                    e.target.value
                                )
                            }
                        />
                        <RadioGroup
                            label='Placement'
                            name={`HolePlacement-${index}`}
                            options={[
                                { label: 'Left', value: 'Left' },
                                { label: 'Center', value: 'Center' },
                                { label: 'Right', value: 'Right' },
                            ]}
                            value={finishing.HoleDrill?.Placement}
                            onChange={(e) =>
                                updateFinishingGroup(
                                    'HoleDrill',
                                    'Placement',
                                    e.target.value
                                )
                            }
                        />
                    </>
                )}

                <CheckboxInput
                    label='Score'
                    name={`Score-${index}`}
                    checked={finishing.Score?.Required || false}
                    onChange={(e) =>
                        updateFinishingGroup(
                            'Score',
                            'Required',
                            e.target.checked
                        )
                    }
                />
                {finishing.Score?.Required && (
                    <RadioGroup
                        label='Performed by'
                        name={`ScorePerformedBy-${index}`}
                        options={PERFORMED_BY_OPTIONS}
                        value={finishing.Score?.PerformedBy}
                        onChange={(e) =>
                            updateFinishingGroup(
                                'Score',
                                'PerformedBy',
                                e.target.value
                            )
                        }
                    />
                )}

                <CheckboxInput
                    label='Capacity'
                    name={`Capacity-${index}`}
                    checked={finishing.Capacity?.Required || false}
                    onChange={(e) =>
                        updateFinishingGroup(
                            'Capacity',
                            'Required',
                            e.target.checked
                        )
                    }
                />
                {finishing.Capacity?.Required && (
                    <>
                        <RadioGroup
                            label='Performed by'
                            name={`CapacityPerformedBy-${index}`}
                            options={PERFORMED_BY_OPTIONS}
                            value={finishing.Capacity?.PerformedBy}
                            onChange={(e) =>
                                updateFinishingGroup(
                                    'Capacity',
                                    'PerformedBy',
                                    e.target.value
                                )
                            }
                        />
                        <TextInput
                            label='Spine Capacity'
                            value={finishing.Capacity?.SpineCapacity || ''}
                            onChange={(e) =>
                                updateFinishingGroup(
                                    'Capacity',
                                    'SpineCapacity',
                                    e.target.value
                                )
                            }
                        />
                        <TextInput
                            label='Pocket Height'
                            value={finishing.Capacity?.PocketHeight || ''}
                            onChange={(e) =>
                                updateFinishingGroup(
                                    'Capacity',
                                    'PocketHeight',
                                    e.target.value
                                )
                            }
                        />
                        <TextInput
                            label='Flap Width'
                            value={finishing.Capacity?.FlapWidth || ''}
                            onChange={(e) =>
                                updateFinishingGroup(
                                    'Capacity',
                                    'FlapWidth',
                                    e.target.value
                                )
                            }
                        />
                        <CheckboxInput
                            label='Slot on right side for tab?'
                            name={`CapacitySlotOnRight-${index}`}
                            checked={finishing.Capacity?.SlotOnRight || false}
                            onChange={(e) =>
                                updateFinishingGroup(
                                    'Capacity',
                                    'SlotOnRight',
                                    e.target.checked
                                )
                            }
                        />
                    </>
                )}

                <SelectInput
                    label='Fold Type'
                    name={`FoldType-${index}`}
                    options={FOLD_TYPE}
                    value={finishing.Fold?.Type}
                    onChange={(e) =>
                        updateFinishingGroup(
                            'Fold',
                            'Type',
                            e.target.value
                        )
                    }
                />
                {finishing.Fold?.Type === 'Other' && (
                    <TextInput
                        label='Please specify fold type'
                        value={finishing.Fold?.Other || ''}
                        onChange={(e) =>
                            updateFinishingGroup(
                                'Fold',
                                'Other',
                                e.target.value
                            )
                        }
                    />
                )}
                {/* Only show this is fold type != none or '' */}
            {/* {finishing.Fold?.Type !== '' &&
                    <RadioGroup
                        label='Performed by'
                        name={`FoldTypePerformedBy`}
                        options={PERFORMED_BY_OPTIONS}
                        value={finishing.Fold?.PerformedBy}
                        onChange={(e) =>
                            updateFinishingGroup(
                                'Fold',
                                'PerformedBy',
                                e.target.value
                            )
                        }
                    />
                }


                {finishing.Fold?.Type === 'Die Cut' && (
                    <>
                        <RadioGroup
                            label='Die Status'
                            name={`DieStatus-${index}`}
                            options={[
                                { label: 'New', value: 'New' },
                                { label: 'Existing', value: 'Existing' },
                            ]}
                            value={finishing.DieCut?.Status}
                            onChange={(e) =>
                                updateFinishingGroup(
                                    'DieCut',
                                    'Status',
                                    e.target.value
                                )
                            }
                        />
                        {finishing.DieCut?.Status === 'Existing' && (
                            <TextInput
                                label='Die Number'
                                value={finishing.DieCut?.DieNumber || ''}
                                onChange={(e) =>
                                    updateFinishingGroup(
                                        'DieCut',
                                        'DieNumber',
                                        e.target.value
                                    )
                                }
                            />
                        )}
                    </>
                )}

                <RadioGroup
                    label='Glue / Seal'
                    name={`GlueSeal-${index}`}
                    options={[
                        { label: 'Tab Glue', value: 'Tab Glue' },
                        { label: 'Glue Dots', value: 'Glue Dots' },
                        { label: 'Fugitive Glue', value: 'Fugitive Glue' },
                        { label: 'None', value: '' },
                    ]}
                    value={finishing.GlueSeal?.Option}
                    onChange={(e) =>
                        updateFinishingGroup(
                            'GlueSeal',
                            'Option',
                            e.target.value
                        )
                    }
                />
                {finishing.GlueSeal?.Option && (
                    <RadioGroup
                        label='Performed by'
                        name={`GlueSealPerformedBy-${index}`}
                        options={PERFORMED_BY_OPTIONS}
                        value={finishing.GlueSeal?.PerformedBy}
                        onChange={(e) =>
                            updateFinishingGroup(
                                'GlueSeal',
                                'PerformedBy',
                                e.target.value
                            )
                        }
                    />
                )}

                {productType === 'Self-Mailer' && (
                    <>
                        <CheckboxInput
                            label='BRC Panel'
                            name={`BRCPanel-${index}`}
                            checked={finishing.BRCPanel?.Selected || false}
                            onChange={(e) =>
                                updateFinishingGroup(
                                    'BRCPanel',
                                    'Selected',
                                    e.target.checked
                                )
                            }
                        />
                        {finishing.BRCPanel?.Selected && (
                            <TextInput
                                label='Perf Placement/Distance from the Bottom'
                                value={finishing.BRCPanel?.PerfPlacement || ''}
                                onChange={(e) =>
                                    updateFinishingGroup(
                                        'BRCPanel',
                                        'PerfPlacement',
                                        e.target.value
                                    )
                                }
                            />
                        )}
                    </>
                )}

                <Textarea
                    label='Component Notes'
                    value={component.ComponentNotes || ''}
                    onChange={(e) =>
                        updateComponent(
                            index,
                            'ComponentNotes',
                            e.target.value
                        )
                    }
                    rows={3}
                />
            </div> */}
            {/* <CheckboxInput
                label="Requires Assembly?"
                checked={component.RequireAssembly}
                name={`RequireAssembly-${index}`}
                onChange={(e) =>
                    updateComponent(
                        index,
                        'RequireAssembly',
                        e.target.checked
                    )
                }
            /> */}

            {/* {component.RequireAssembly && (
                <>
                    <h5 className="mt-1 mb-0 text-sm font-semibold text-gray-800">Assembly Types</h5>

                    {ASSEMBLY_TYPES.map((type, i) => (
                        <CheckboxInput
                            key={type}
                            label={type}
                            name={`assembly-${index}-${i}`}
                            checked={
                                component.AssemblyTypes?.includes(type)
                            }
                            onChange={(e) =>
                                toggleAssemblyType(
                                    type,
                                    e.target.checked
                                )
                            }
                        />
                    ))}
                </>
            )} */}

            {component.ComponentSource === 'lcp-prod' && (
                <fieldset className="rounded-md border border-gray-200 bg-white p-3">
                    <legend className="px-1 text-xs font-semibold text-gray-600">LCP Production</legend>

                    <TextInput
                        label="Job Number"
                        value={component.JobNumber || ''}
                        onChange={(e) =>
                            updateComponent(
                                index,
                                'JobNumber',
                                e.target.value
                            )
                        }
                    />
                </fieldset>
            )}

            {component.ComponentSource === 'customer-supplied' && (
                <fieldset className="rounded-md border border-gray-200 bg-white p-3">
                    <legend className="px-1 text-xs font-semibold text-gray-600">Customer Supplied</legend>

                    <TextInput
                        label="Coming From"
                        value={component.ComingFrom || ''}
                        onChange={(e) =>
                            updateComponent(
                                index,
                                'ComingFrom',
                                e.target.value
                            )
                        }
                    />
                </fieldset>
            )}
            <div>

                <Button
                    label="Remove"
                    variant="danger"
                    onClick={() => removeComponent(index)}
                />
            </div>

        </fieldset>
    )
}

export default Component