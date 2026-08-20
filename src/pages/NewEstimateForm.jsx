import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import TextInput from '../components/TextInput'
import NumberInput from '../components/NumberInput'
import DateInput from '../components/DateInput'
import Textarea from '../components/Textarea'
import SelectInput from '../components/SelectInput'
import CheckboxInput from '../components/CheckboxInput'
import RadioGroup from '../components/RadioGroup'
import FormSection from '../components/FormSection'
import RepeatingSection from '../components/RepeatingSection'
import Button from '../components/Button'
import ButtonBar from '../components/ButtonBar'
import PopoverButton from '../components/PopoverButton'
import Modal from '../components/Modal'
import Tabs from '../components/Tabs'
import FileInput from '../components/FileInput'
import Component from '../form_sections/Component'



const QTY_REPEATING_FIELDS = [
    { name: 'qty', label: 'Quantity', type: 'number' }
]

const PROJECT_TYPES = [
    'Assembly',
    'Fulfillment',
    'Mailing',
    'Inkjet',
    'Kitting',
    'Packaging',
    'Distribution',
    'Inventory Storage',
]

function NewEstimateForm({ }) {

    // Project Overview
    const [clientName, setClientName] = useState('Prefilled Client...')
    const [projName, setProjName] = useState('')
    const [projDesc, setProjDesc] = useState('')
    const [salesRep, setSalesRep] = useState('Internal sales rep')
    const [prevJobNo, setPrevJobNo] = useState('')
    const [prevEstNo, setPrevEstNo] = useState('')

    //Project Types
    const [projectTypes, setProjectTypes] = useState([])
    const [isOtherType, setIsOtherType] = useState(false)
    const [otherProjectTypes, setOtherProjectTypes] = useState('')

    //Quantities
    const [hasMultipleQtyLevels, setHasMultipleQtyLevels] = useState(false)
    const [prodQty, setProdQty] = useState()
    const [addQtys, setaddQtys] = useState([])
    const addQtyToPrice = () => {
        setaddQtys(prev => [
            ...prev, ''
        ])
    }
    const updateQty = (index, value) => {
        setaddQtys(prev =>
            prev.map((qty, i) =>
                i === index ? value : qty
            )
        )
    }
    const removeQty = (index) => {
        setaddQtys(prev =>
            prev.filter((_, i) => i !== index)
        )
    }

    // Components
    const [numOfComponents, setNumOfComponents] = useState(0)
    const [components, setComponents] = useState([])
    const addComponent = () => {
        setComponents(prev => [
            ...prev,
            {
                Component: '',
                ComponentQty: '',
                ComponentSource: '',
                ComponentSize: '',
                RequireAssembly: false,
                AssemblyTypes: []
            }
        ])
    }

    const updateComponent = (index, field, value) => {
        setComponents(prev =>
            prev.map((component, i) =>
                i === index
                    ? { ...component, [field]: value }
                    : component
            )
        )
    }

    const removeComponent = (index) => {
        setComponents(prev =>
            prev.filter((_, i) => i !== index)
        )
    }

    // Packing Requirements
    const [isKit, setIsKit] = useState(false)
    const [kitContents, setKitContents] = useState([])

    const buildKit = () => {
        setKitContents(
            components.map(component => {
                const qtyPerKit =
                    Math.floor(component.ComponentQty / prodQty)

                return {
                    ...component,
                    qtyPerKit,
                    overage:
                        component.ComponentQty -
                        qtyPerKit * prodQty,
                    overageHandling: '',
                    notes: ''
                }
            })
        )
    }

    // const kits = components.map(component => ({
    //     ...component,
    //     qtyPerKit: Math.floor(component.ComponentQty / prodQty),
    //     overage: Math.floor(component.ComponentQty - qtyPerKit * prodQty),
    //     overageHandling: '',
    //     notes: ''
    // }))






    const [requirePacking, setRequirePacking] = useState(false)

    const handleQtysChange = (sections) => {
        const updated = sections.map(section => ({
            ...section
        }));

        setaddQtys(updated);
    };

    async function handleSubmit(e) {
        e.preventDefault();

        const finalProjectTypes = [
            ...projectTypes.map(type => ({
                source: 'check',
                value: type
            })),
            ...otherProjectTypes
                .split(',')
                .map(item => ({
                    source: 'custom',
                    value: item.trim()
                }))
                .filter(item => item.value)
        ];

        const estimateData = {
            client_name: clientName,
            project_name: projName,
            project_desc: projDesc,
            sales_rep: salesRep,
            prev_job_no: prevJobNo,
            prev_estimate_no: prevEstNo,
            project_types: finalProjectTypes,
            production_qty: prodQty,
            additional_qtys: addQtys,
            components: components,
            kit: kitContents
        };

        console.log(estimateData);
    }

    const handleProjectTypes = (e) => {
        const { value, checked } = e.target;

        setProjectTypes((prev) =>
            checked
                ? [...prev, e.target.name]
                : prev.filter((item) => item !== e.target.name)
        );
    }

    const addOtherProjectTypes = (e) => {
        const value = e.target.value;
        setOtherProjectTypes(value)
    }


    return (
        <>
            <div className="bg-lime-950/10 p-20">
                <h3 className='m-0'>Request an Estimate</h3>
                <p className='mb-5'>Fill out the form below and we'll get back to you within 24-48 hours</p>
                <hr />

                <form onSubmit={handleSubmit}>
                    <FormSection legend="Project Overview">
                        <TextInput label='Client Name' name='ClientName' value={clientName} onChange={(e) => setClientName(e.target.value)} readOnly disabled />
                        <TextInput label='Project Name (optional)' name='ProjName' value={projName} onChange={(e) => setProjName(e.target.value)} />
                        <Textarea label='Project Description' name='ProjDesc' placeholder='Briefly describe the finished piece and work to be performed.' value={projDesc} onChange={(e) => setProjDesc(e.target.value)} required rows={4} />
                        <TextInput label='Sales Rep' name='SalesRep' value={salesRep} onChange={(e) => setSalesRep(e.target.value)} readOnly disabled />
                        <TextInput label='Previous Job # (if applicable)' name='PrevJobNo' value={prevJobNo} onChange={(e) => setPrevJobNo(e.target.value)} />
                        <TextInput label='Previous Estimate # (if applicable)' name='PrevEstNo' value={prevEstNo} onChange={(e) => setPrevEstNo(e.target.value)} />
                        <h5 className='m-0'>Project Types (select all that apply)</h5>
                        {/* <small className='text-gray-500'>Select all that apply</small> */}
                        {PROJECT_TYPES.map((label) => (
                            <CheckboxInput
                                key={label}
                                label={label}
                                name={label}
                                checked={projectTypes.includes(label)}
                                onChange={handleProjectTypes}
                            />
                        ))}
                        <CheckboxInput label='Other Project Types' checked={isOtherType} name='Other' onChange={(e) => setIsOtherType(e.target.checked)} />
                        {isOtherType &&
                            <TextInput label='Specify other project types (comma separate multiple types if more than 1)' value={otherProjectTypes} onChange={(e) => setOtherProjectTypes(e.target.value)} />
                        }
                    </FormSection>

                    <FormSection legend="Quantities">
                        <NumberInput label='Requested Production Quantity' name='qty' value={prodQty} onChange={(e) => setProdQty(e.target.value)} />
                        {addQtys.map((addQty, index) => (
                            <div className='flex'>
                                <NumberInput
                                    label='Additional quantity to price'
                                    key={index}
                                    index={index}
                                    value={addQty}
                                    onChange={(e) => updateQty(index, e.target.value)}
                                />
                                <Button label='x' onClick={() => removeQty(index)} />
                            </div>

                        ))}
                        <Button
                            label="Add Additional Qty to price"
                            onClick={addQtyToPrice}
                        />
                    </FormSection>
                    <FormSection legend='Components'>
                        {components.map((component, index) => (
                            <Component
                                key={index}
                                component={component}
                                index={index}
                                updateComponent={updateComponent}
                                removeComponent={removeComponent}
                            />
                        ))}
                        <Button
                            label="Add Component"
                            onClick={addComponent}
                        />
                    </FormSection>
                    <FormSection legend='Packaging Requirements'>
                        <CheckboxInput label='Is this a kit?' name='IsKit' onChange={buildKit} />
                        {/* if is kit, build out kits with prefilled contents (from components). total kits = Requested Production Quantity. each kit contains (total qty of component / requested production qty) which can be edited (only larger number, lower is invalid). If there is a difference between total qty of component and kit contents, ask why/what should be done with the extras */}

                        {isKit &&
                            <div>
                                <h5>Kit Contents</h5>

                            </div>
                        }
                    </FormSection>

                    <Button label='Submit' type='submit' />
                </form>
            </div>
        </>
    )
}

export default NewEstimateForm;