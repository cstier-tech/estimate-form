import { useState } from "react";
import FormSection from "../components/FormSection";
import NumberInput from "../components/NumberInput";
import SelectInput from "../components/SelectInput";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import CheckboxInput from "../components/CheckboxInput";

const COMPONENT_SOURCE = [
    { label: 'Select Source', value: '' },
    { label: 'LCP Production', value: 'lcp-prod' },
    { label: 'Customer Supplied', value: 'customer-supplied' },
    { label: 'Veracore Inventory', value: 'veracore-inventory' },
]
const ASSEMBLY_TYPES = [
    'Insert into pocket',
    'Folder forming',
    'Capacity forming',
    'Pocket assembly',
    'Tab lock assembly',
    'Rivet installation',
    'Cord insertion',
    'Gluing',
    'Folding',
    'Multi-piece kit assembly',
]

function Component({
    component,
    index,
    updateComponent,
    removeComponent
}) {
    const toggleAssemblyType = (assemblyType, checked) => {
        const current = component.AssemblyTypes || []

        const next = checked
            ? [...current, assemblyType]
            : current.filter(x => x !== assemblyType)

        updateComponent(index, 'AssemblyTypes', next)
    }
    return (
        <fieldset className="bg-sky-50 p-4 rounded">
            <legend>
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

            <CheckboxInput
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
            />

            {component.RequireAssembly && (
                <>
                    <h5 >Assembly Types</h5>

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
            )}

            {component.ComponentSource === 'lcp-prod' && (
                <fieldset>
                    <legend>LCP Production</legend>

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
                <fieldset>
                    <legend>Customer Supplied</legend>

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

            <Button
                label="Remove"
                variant="danger"
                onClick={() => removeComponent(index)}
            />
        </fieldset>
    )
}

export default Component