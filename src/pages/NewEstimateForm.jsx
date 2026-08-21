import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import DateInput from '../components/DateInput'
import SelectInput from '../components/SelectInput'
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
import ProjectOverview from '../form_sections/ProjectOverview'
import Quantities from '../form_sections/Quantities'
import PackagingRequirements from '../form_sections/PackagingRequirements'
import ServiceType from '../form_sections/ServiceType'
import CheckboxInput from '../components/CheckboxInput'
import Version from '../form_sections/Versions'


const QTY_REPEATING_FIELDS = [
    { name: 'qty', label: 'Quantity', type: 'number' }
]

function NewEstimateForm({ }) {

    // Project Overview
    const [clientName, setClientName] = useState('Prefilled Client...')
    const [customerNumber, setCustomerNumber] = useState('Prefilled Number...')
    const [projName, setProjName] = useState('')
    const [materialCode, setMaterialCode] = useState('')
    const [revisionVersion, setRevisionVersion] = useState('')
    const [projDesc, setProjDesc] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [salesRep, setSalesRep] = useState('Internal sales rep')
    const [prevJobNo, setPrevJobNo] = useState('')
    const [prevEstNo, setPrevEstNo] = useState('')
    const [jobType, setJobType] = useState('')

    const [pIPartNumber, setPIPartNumber] = useState('')
    const [coating, setCoating] = useState('')
    const [stock, setStock] = useState('')
    const [pagesQty, setPagesQty] = useState('')
    const [finalSize, setFinalSize] = useState('')
    const [flatSize, setFlatSize] = useState('')

    //Project Types
    const [serviceTypes, setServiceTypes] = useState([])
    const [isOtherType, setIsOtherType] = useState(false)
    const [otherServiceTypes, setOtherServiceTypes] = useState('')

    // Product Types
    const [productType, setProductType] = useState('')

    // Versions
    const [numOfVersions, setNumOfVersions] = useState(0)
    const [versions, setVersions] = useState([])
    const [hasMultipleVersions, setHasMultipleVersions] = useState(false)
    const addVersion = () => {
        setVersions(prev => [
            ...prev,
            {
                Version: '',
                VersionQty: '',
                VersionMailFilesQty: '',
            }
        ])
    }

    const updateVersion = (index, field, value) => {
        setVersions(prev =>
            prev.map((version, i) =>
                i === index
                    ? { ...version, [field]: value }
                    : version
            )
        )
    }

    const removeVersion = (index) => {
        setVersions(prev =>
            prev.filter((_, i) => i !== index)
        )
    }

    const handleHasVersions = (e) => {
        if (!versions.length) {
            addVersion();
        }
        setHasMultipleVersions(e.target.checked)
    }

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
                AssemblyTypes: [],
                PerformedBy: '',
                DieStatus: '',
                DieNumber: ''
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
    // Empty until the user explicitly edits it; falls back to the
    // Requested Production Quantity as its prefilled default.
    const [numOfKitsOverride, setNumOfKitsOverride] = useState('')
    const numOfKits =
        numOfKitsOverride !== ''
            ? Number(numOfKitsOverride)
            : Number(prodQty) || 0

    // Keyed by component index. Only holds values the user has explicitly
    // overridden; anything absent falls back to the computed default.
    const [kitOverrides, setKitOverrides] = useState({})

    const updateKitQtyPerKit = (index, value) => {
        setKitOverrides(prev => ({
            ...prev,
            [index]: { ...prev[index], qtyPerKit: value }
        }))
    }

    const updateKitOverageHandling = (index, value) => {
        setKitOverrides(prev => ({
            ...prev,
            [index]: { ...prev[index], overageHandling: value }
        }))
    }

    const buildKit = () => {
        const qty = numOfKits

        return components.map((component, index) => {
            const componentQty = Number(component.ComponentQty) || 0
            const defaultQtyPerKit = qty > 0 ? Math.floor(componentQty / qty) : 0
            const override = kitOverrides[index] || {}
            const qtyPerKit =
                override.qtyPerKit !== undefined && override.qtyPerKit !== ''
                    ? Number(override.qtyPerKit)
                    : defaultQtyPerKit

            return {
                ...component,
                qtyPerKit,
                overage: componentQty - qtyPerKit * qty,
                overageHandling: override.overageHandling || ''
            }
        })
    }

    // Recomputed on every render from `components`/`numOfKits`/`kitOverrides`,
    // so it always reflects the latest quantities without needing to be
    // kept in sync.
    const kitContents = isKit ? buildKit() : []

    const [requirePacking, setRequirePacking] = useState(false)

    const handleQtysChange = (sections) => {
        const updated = sections.map(section => ({
            ...section
        }));

        setaddQtys(updated);
    };

    async function handleSubmit(e) {
        e.preventDefault();

        const finalServiceTypes = [
            ...serviceTypes.map(type => ({
                source: 'check',
                value: type
            })),
            ...otherServiceTypes
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
            material_code: materialCode,
            revision_version: revisionVersion,
            due_date: dueDate,
            sales_rep: salesRep,
            prev_job_no: prevJobNo,
            prev_estimate_no: prevEstNo,
            project_types: finalServiceTypes,
            product_type: productType,
            production_qty: prodQty,
            additional_qtys: addQtys,
            components: components,
            num_of_kits: isKit ? numOfKits : undefined,
            kit: kitContents,
            versions: versions,
            flat_size: flatSize,
            final_size: finalSize,
            pages_qty: pagesQty,
            stock: stock,
            coating: coating,
            pi_part_num: pIPartNumber
        };

        console.log(estimateData);
    }

    const handleServiceTypes = (e) => {
        const { value, checked } = e.target;

        setServiceTypes((prev) =>
            checked
                ? [...prev, e.target.name]
                : prev.filter((item) => item !== e.target.name)
        );
    }

    const addOtherServiceTypes = (e) => {
        const value = e.target.value;
        setOtherServiceTypes(value)
    }


    return (
        <div className="px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <h3 className='text-2xl font-semibold text-gray-900'>Request an Estimate</h3>
                <p className='mt-1 mb-6 text-sm text-gray-600'>Fill out the form below and we'll get back to you within 24-48 hours</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <FormSection legend='Project Overview'>
                        <ProjectOverview
                            clientName={clientName}
                            setClientName={setClientName}
                            customerNumber={customerNumber}
                            setCustomerNumber={setCustomerNumber}
                            projName={projName}
                            setProjName={setProjName}
                            projDesc={projDesc}
                            setProjDesc={setProjDesc}
                            materialCode={materialCode}
                            setMaterialCode={setMaterialCode}
                            revisionVersion={revisionVersion}
                            jobType={jobType}
                            setJobType={setJobType}
                            setRevisionVersion={setRevisionVersion}
                            dueDate={dueDate}
                            setDueDate={setDueDate}
                            salesRep={salesRep}
                            setSalesRep={setSalesRep}
                            prevJobNo={prevJobNo}
                            setPrevJobNo={setPrevJobNo}
                            prevEstNo={prevEstNo}
                            setPrevEstNo={setPrevEstNo}
                            flatSize={flatSize}
                            setFlatSize={setFlatSize}
                            finalSize={finalSize}
                            setFinalSize={setFinalSize}
                            pagesQty={pagesQty}
                            setPagesQty={setPagesQty}
                            stock={stock}
                            setStock={setStock}
                            coating={coating}
                            setCoating={setCoating}
                            pIPartNumber={pIPartNumber}
                            setPIPartNumber={setPIPartNumber}
                        />
                        <CheckboxInput label='Multiple Versions?' name='HasMultipleVersions' checked={hasMultipleVersions} onChange={handleHasVersions} />
                        {hasMultipleVersions &&
                            <>
                                {versions.map((version, index) => (
                                    <Version
                                        key={index}
                                        version={version}
                                        index={index}
                                        updateVersion={updateVersion}
                                        removeVersion={removeVersion}
                                    />
                                ))}
                                <Button
                                    label="Add another version"
                                    onClick={addVersion}
                                />
                            </>
                        }
                        <Quantities
                            prodQty={prodQty}
                            setProdQty={setProdQty}
                            addQtys={addQtys}
                            updateQty={updateQty}
                            removeQty={removeQty}
                            addQtyToPrice={addQtyToPrice}
                        />
                    </FormSection>


                    <ServiceType
                        serviceTypes={serviceTypes}
                        handleServiceTypes={handleServiceTypes}
                        isOtherType={isOtherType}
                        setIsOtherType={setIsOtherType}
                        otherServiceTypes={otherServiceTypes}
                        setOtherServiceTypes={setOtherServiceTypes}
                    />


                    <FormSection legend='Components'>
                        {components.map((component, index) => (
                            <Component
                                key={index}
                                component={component}
                                index={index}
                                updateComponent={updateComponent}
                                removeComponent={removeComponent}
                                productType={productType}
                            />
                        ))}
                        <Button
                            label="Add Component"
                            onClick={addComponent}
                        />
                    </FormSection>
                    <PackagingRequirements
                        isKit={isKit}
                        setIsKit={setIsKit}
                        numOfKits={numOfKitsOverride !== '' ? numOfKitsOverride : (prodQty ?? '')}
                        setNumOfKits={setNumOfKitsOverride}
                        kitContents={kitContents}
                        updateKitQtyPerKit={updateKitQtyPerKit}
                        updateKitOverageHandling={updateKitOverageHandling}
                    />

                    <div className="flex justify-end">
                        <Button label='Submit' type='submit' />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default NewEstimateForm;