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

const SERVICE_TYPE = [
    { label: 'Select One...', value: '' },
    { label: 'Shrinkwrap Only', value: 'shrinkwrap-only' },
    { label: 'Kit Assembly', value: 'kit-assembly' },
    { label: 'Kit Assembly with Drop Shipments', value: 'kit-assembly-drop-ship' },
    { label: 'Other', value: 'other' },
]

const TIMELINE_OPTIONS = [
    { label: 'Select the desired timeline', value: '' },
    { label: 'As soon as possible', value: 'As soon as possible' },
    { label: '1-3 months', value: '1-3 months' },
    { label: '3-6 months', value: '3-6 months' },
    { label: '6-12 months', value: '6-12 months' },
    { label: 'Flexible', value: 'Flexible' }
]
const CARTON_TYPE = [
    { label: 'Select Carton Type', value: '' },
    { label: 'Convenient/Standard', value: 'convenient' },
    { label: 'Double Walled', value: 'double-walled' },
    { label: 'Custom', value: 'custom' },
]

const CUSTOM_CARTON_SOURCE = [
    { label: 'Select Carton Type', value: '' },
    { label: 'Customer Supplied', value: 'customer-supplied' },
    { label: 'Outside Purchase', value: 'outside-purchase' },
    { label: 'Make on Packsize', value: 'make-on-packsize' },
]

const SHIPPING_METHOD = [
    { label: 'Select Shipping Method', value: '' },
    { label: 'Ground', value: 'ground' },
    { label: '2-Day', value: '2-day' },
    { label: 'Overnight', value: 'overnight' },
    { label: 'LCP Truck', value: 'lcp-truck' },
]

const SHIPPING_OPTIONS = [
    { label: 'Advanced Shipping Notice (ASN) Required', value: 'ASN-required' },
    { label: 'Is Approval Needed Prior to Ship?', value: 'approval-needed' },
    { label: 'International Shipment?', value: 'intl-shipment' },
]

// components
const COMPONENT_TYPE = [
    { label: 'Select Component Type', value: '' },
    { label: 'Printed Product', value: 'printed-product' },
    { label: 'Promo Item', value: 'promo-item' },
    { label: 'Apparel', value: 'apparel' },
    { label: 'Product Sample', value: 'product-sample' },
    { label: 'Other', value: 'other' },
]

const COMPONENT_SOURCE = [
    { label: 'Select Source', value: '' },
    { label: 'LCP Production', value: 'lcp-prod' },
    { label: 'Customer Supplied', value: 'customer-supplied' },
    { label: 'Veracore Inventory', value: 'veracore-inventory' },
]

const COMPONENT_SIZE = [
    { label: 'Select Size', value: '' },
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' },
    { label: 'Custom', value: 'custom' },
    { label: 'Other', value: 'other' },
]

const COMPONENT_DEPARTMENT = [
    { label: 'Select Size', value: '' },
    { label: 'Litho', value: 'litho' },
    { label: 'Digital', value: 'digital' },
    { label: 'Environmental Branding', value: 'envrmnt-brndg' },
    { label: 'Branded Merchandise', value: 'branded-merch' },
]

const COMPONENTS_REPEATING_FIELDS = [
    {
        name: 'ComponentName',
        label: 'Component Name',
        type: 'text',
    },
    {
        name: 'ComponentType',
        label: 'Component Type',
        type: 'select',
        options: COMPONENT_TYPE,
    },
    {
        name: 'ComponentSource',
        label: 'Where is this component coming from?',
        type: 'select',
        options: COMPONENT_SOURCE,
    },
    {
        name: 'ComponentSize',
        label: 'Size',
        type: 'select',
        options: COMPONENT_SIZE,
        showWhen: (section) =>
            section['ComponentType'] === 'printed-product',
    },
    {
        name: 'OtherComponentSize',
        label: 'Please Specify Size',
        type: 'text',
        showWhen: (section) =>
            section['ComponentSize'] === 'other',
    },
    {
        name: 'ComponentStock',
        label: 'Stock/Substrate',
        type: 'text',
        showWhen: (section) =>
            section['ComponentType'] === 'printed-product',
    },
    {
        name: 'OtherComponentName',
        label: 'Please specify other component type',
        type: 'text',
        showWhen: (section) =>
            section['ComponentType'] === 'other',
    }
]

//shrinkwrap pack info
const SHRINKWRAP_PK_INFO_REPEATING_FIELDS = [
    { name: 'qty_per_pack', label: 'Quantity Per Pack', type: 'number' },
    { name: 'num_of_packs', label: 'num of Packs', type: 'number' },
    {
        name: 'pack_total', label: 'Pack Total', type: 'number', isReadOnly: true,
        calculate: (section) =>
            (Number(section['qty_per_pack']) || 0) *
            (Number(section['num_of_packs']) || 0)
    },

]



function EstimateForm({ estimateId = null }) {

    //project details
    const [projectDescription, setProjectDescription] = useState(SERVICE_TYPE[0].value)
    const [serviceType, setServiceType] = useState(SERVICE_TYPE[0].value)
    const [numOfComponents, setNumOfComponents] = useState('')
    const [components, setComponents] = useState([])


    const [jobNumber, setJobNumber] = useState('')
    const [department, setDepartment] = useState('')
    const [prodDetails, setProdDetails] = useState('')
    const [comingFrom, setComingFrom] = useState('')
    const [PORef, setPORef] = useState('')
    const [trackingNum, setTrackingNum] = useState('')
    const [expectedArrival, setExpectedArrival] = useState('')
    const [expectedQuantity, setExpectedQuantity] = useState('')
    const [productId, setProductId] = useState('')
    const [quantityNeeded, setQuantityNeeded] = useState('')


    const [shrinkwrapPacks, setShrinkwrapPacks] = useState([])

    //timeline
    const [timeline, setTimeline] = useState('')

    //packaging instructions
    const [cartonType, setCartonType] = useState('')
    const [labelingInstructions, setLabelingInstructions] = useState('')
    const [customLabelValue, setCustomLabelValue] = useState('')
    const [customCartonSource, setCustomCartonSource] = useState('')

    //shipping instructions
    const [numOfShipments, setNumOfShipments] = useState('')
    const [shipDateValue, setShipDateValue] = useState('')
    const [shippingMethod, setShippingMethod] = useState(SHIPPING_METHOD[0].value)
    const [shippingOptions, setShippingOptions] = useState(SHIPPING_OPTIONS[0].value)

    const [ASNRequired, setASNRequired] = useState(false)
    const [approvalNeeded, setApprovalNeeded] = useState(false)
    const [intlShipment, setIntlShipment] = useState(false)

    const [addlNotes, setAddlNotes] = useState('')

    const handleShrinkwrapChange = (sections) => {
        const updated = sections.map(section => ({
            ...section,
            'pack_total':
                (Number(section['qty_per_pack']) || 0) *
                (Number(section['num_of_packs']) || 0)
        }));

        setShrinkwrapPacks(updated);
    };

    const packsTotal = shrinkwrapPacks.reduce(
        (total, pack) =>
            total +
            (Number(pack['qty_per_pack']) || 0) *
            (Number(pack['num_of_packs']) || 0),
        0
    );


    const estimateData = {
        project_description: projectDescription,
        project_type: serviceType,
        components: components,
        timeline: timeline,
        carton_type: cartonType,
        other_carton_type: customCartonSource,
        labeling_instructions: labelingInstructions,
        ship_date: shipDateValue,
        ship_method: shippingMethod,
        asn_required: ASNRequired,
        approval_needed_to_ship: approvalNeeded,
        internationa_ship: intlShipment,
        additional_information: addlNotes,
        components_qty: numOfComponents,
        shrinkwrap_packs_qty: packsTotal,
        shrinkwrapPacks: shrinkwrapPacks
    }


    async function handleSubmit(e) {
        e.preventDefault()
        if (estimateId) {
            const { data: estimateData, error: estimateError } = await supabase
                .from('Estimates')
                .update([
                    {
                        project_description: projectDescription,
                        project_type: serviceType,
                        timeline: timeline,
                        carton_type: cartonType,
                        other_carton_type: customCartonSource,
                        labeling_instructions: labelingInstructions,
                        ship_date: shipDateValue,
                        ship_method: shippingMethod,
                        asn_required: ASNRequired,
                        approval_needed_to_ship: approvalNeeded,
                        internationa_ship: intlShipment,
                        additional_information: addlNotes,
                        components_qty: numOfComponents,
                        shrinkwrap_packs_qty: packsTotal,
                    }
                ]).eq('id', estimateId)



            if (estimateError) {
                console.error(estimateError)
                alert('Error saving record')
                return
            }
            const componentRows = components.map(component => ({
                estimate_id: estimateId,
                component_name: component.ComponentName,
                component_type: component.ComponentType,
                component_source: component.ComponentSource,
                size: component.ComponentSize,
                other_size: component.OtherComponentSize,
                stock: component.ComponentStock,
                other_name: component.OtherComponentName,
                job_number: component.JobNumber,
                department: component.Department,
                production_details: component.ProdDetails,
                coming_from: component.ComingFrom,
                po_ref: component.PORef,
                tracking_num: component.TrackingNum,
                expected_arrival: component.ExpectedArrival,
                expected_quantity: component.ExpectedQuantity,
                product_id: component.ProductId,
                quantity_needed: component.QuantityNeeded,
                // component_num: 
            }))


            // const { data: componentsData, error: componentsError } = await supabase
            //     .from('Components')
            //     .update(componentRows)
            const { error: deleteComponentsError } = await supabase
                .from('Components')
                .delete()
                .eq('estimate_id', estimateId)

            console.log('DELETE COMPONENTS ERROR', deleteComponentsError)

            await supabase
                .from('Components')
                .insert(componentRows)

            const shrinkwrapPacksRows = shrinkwrapPacks.map(shrinkwrapPack => ({
                estimate_id: estimateId,
                qty_per_pack: shrinkwrapPack.qty_per_pack,
                num_of_packs: shrinkwrapPack.num_of_packs,
                pack_total: shrinkwrapPack.pack_total
            }))

            // const { data: shrinkwrapPacksData, error: shrinkwrapPacksError } = await supabase
            //     .from('Shrinkwrap Packs')
            //     .update(shrinkwrapPacksRows)
            const { error: deletePacksError } = await supabase
                .from('Shrinkwrap Packs')
                .delete()
                .eq('estimate_id', estimateId)

            console.log('DELETE PACKS ERROR', deletePacksError)

            await supabase
                .from('Shrinkwrap Packs')
                .insert(shrinkwrapPacksRows)

            alert('Saved!')
            setProjectDescription('')
            setServiceType('')
            setASNRequired(false)
            setAddlNotes('')
            setApprovalNeeded(false)
            setCartonType('')
            setCustomCartonSource('')
            setCustomLabelValue('')
            setIntlShipment(false)
            setLabelingInstructions('')
            setNumOfComponents('')
            setNumOfShipments('')
            setShipDateValue('')
            setShippingMethod('')
            setShippingOptions('')
            // setShrinkwrapPacks('')
            setTimeline('')
            console.log(estimateData)
        } else {
            const { data: estimateData, error: estimateError } = await supabase
                .from('Estimates')
                .insert([
                    {
                        project_description: projectDescription,
                        project_type: serviceType,
                        timeline: timeline,
                        carton_type: cartonType,
                        other_carton_type: customCartonSource,
                        labeling_instructions: labelingInstructions,
                        ship_date: shipDateValue,
                        ship_method: shippingMethod,
                        asn_required: ASNRequired,
                        approval_needed_to_ship: approvalNeeded,
                        internationa_ship: intlShipment,
                        additional_information: addlNotes,
                        components_qty: numOfComponents,
                        shrinkwrap_packs_qty: packsTotal,
                    }
                ]).select().single()



            if (estimateError) {
                console.error(estimateError)
                alert('Error saving record')
                return
            }
            const componentRows = components.map(component => ({
                estimate_id: estimateId,
                component_name: component.ComponentName,
                component_type: component.ComponentType,
                component_source: component.ComponentSource,
                size: component.ComponentSize,
                other_size: component.OtherComponentSize,
                stock: component.ComponentStock,
                other_name: component.OtherComponentName,
                job_number: component.JobNumber,
                department: component.Department,
                production_details: component.ProdDetails,
                coming_from: component.ComingFrom,
                po_ref: component.PORef,
                tracking_num: component.TrackingNum,
                expected_arrival: component.ExpectedArrival,
                expected_quantity: component.ExpectedQuantity,
                product_id: component.ProductId,
                quantity_needed: component.QuantityNeeded,
                // component_num: 
            }))


            const { data: componentsData, error: componentsError } = await supabase
                .from('Components')
                .insert(componentRows)

            const shrinkwrapPacksRows = shrinkwrapPacks.map(shrinkwrapPack => ({
                estimate_id: estimateId,
                qty_per_pack: shrinkwrapPack.qty_per_pack,
                num_of_packs: shrinkwrapPack.num_of_packs,
                pack_total: shrinkwrapPack.pack_total
            }))

            const { data: shrinkwrapPacksData, error: shrinkwrapPacksError } = await supabase
                .from('Shrinkwrap Packs')
                .insert(shrinkwrapPacksRows)

            alert('Saved!')
            setProjectDescription('')
            setServiceType('')
            setASNRequired(false)
            setAddlNotes('')
            setApprovalNeeded(false)
            setCartonType('')
            setCustomCartonSource('')
            setCustomLabelValue('')
            setIntlShipment(false)
            setLabelingInstructions('')
            setNumOfComponents('')
            setNumOfShipments('')
            setShipDateValue('')
            setShippingMethod('')
            setShippingOptions('')
            // setShrinkwrapPacks('')
            setTimeline('')
            console.log(estimateData)
        }

    }


    useEffect(() => {
        if (!estimateId) return

        async function loadEstimate() {
            const { data, error } = await supabase
                .from('Estimates')
                .select(`
        *,
        Components(*),
        "Shrinkwrap Packs"(*)
      `)
                .eq('id', estimateId)
                .single()

            if (error) {
                console.error(error)
                return
            }

            setProjectDescription(data.project_description)
            setServiceType(data.project_type)
            setTimeline(data.timeline)
            setCartonType(data.carton_type)
            setCustomCartonSource(data.other_carton_type)
            setLabelingInstructions(data.labeling_instructions)
            setShipDateValue(data.ship_date)
            setShippingMethod(data.ship_method)
            setASNRequired(data.asn_required)
            setApprovalNeeded(data.approval_needed_to_ship)
            setIntlShipment(data.internationa_ship)
            setAddlNotes(data.additional_information)

            console.log("Loaded Components", data.Components)
            setComponents(
                (data.Components || []).map(component => ({
                    ComponentName: component.component_name,
                    ComponentType: component.component_type,
                    ComponentSource: component.component_source,
                    ComponentSize: component.size,
                    OtherComponentSize: component.other_size,
                    ComponentStock: component.stock,
                    OtherComponentName: component.other_name,
                    JobNumber: component.job_number,
                    Department: component.department,
                    ProdDetails: component.production_details,
                    ComingFrom: component.coming_from,
                    PORef: component.po_ref,
                    TrackingNum: component.tracking_num,
                    ExpectedArrival: component.expected_arrival,
                    ExpectedQuantity: component.expected_quantity,
                    ProductId: component.product_id,
                    QuantityNeeded: component.quantity_needed
                }))
            )
            setNumOfComponents(data.Components?.length || 0)
            console.log("Loaded Packs", data["Shrinkwrap Packs"])

            setShrinkwrapPacks(
                (data["Shrinkwrap Packs"] || []).map(pack => ({
                    qty_per_pack: pack.qty_per_pack,
                    num_of_packs: pack.num_of_packs,
                    pack_total: pack.pack_total
                }))
            )
        }

        loadEstimate()
    }, [estimateId])


    return (

        <div className="bg-lime-950/10 p-20">
            <h3 className='m-0'>Request an Estimate</h3>
            <p className='mb-5'>Fill out the form below and we'll get back to you within 24-48 hours</p>
            <form onSubmit={handleSubmit}>
                <FormSection legend="Project Details">
                    <Textarea
                        label="Project Description"
                        name="ProjectDescription"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        rows={4}
                        placeholder="Please describe your project in detail..."
                    />
                    <SelectInput
                        label="Project Type"
                        name="ServiceType"
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value)}
                        options={SERVICE_TYPE}
                    />
                    {serviceType != '' &&
                        <NumberInput
                            label="Number of Components"
                            name="components"
                            value={numOfComponents}
                            onChange={(e) => setNumOfComponents(e.target.value)}
                            min={0}
                        />}
                    <RepeatingSection fields={COMPONENTS_REPEATING_FIELDS} onChange={setComponents} count={numOfComponents} allowManualAdd={false} unit='Component' className='bg-sky-50' value={components}>

                        {(section, index, updateField) => (
                            <>
                                {section['ComponentSource'] === 'lcp-prod' && (
                                    <fieldset className="border rounded p-4 bg-sky-100 flex flex-col gap-2">
                                        <legend className='text-xs text-gray-800'>LCP Production Details</legend>

                                        <TextInput
                                            label="Job Number"
                                            name="JobNumber"
                                            value={section.JobNumber || ''}
                                            onChange={(e) =>
                                                updateField(index, 'JobNumber', e.target.value)
                                            }
                                        />

                                        <SelectInput
                                            label="Department"
                                            name="Department"
                                            value={section.Department || ''}
                                            options={COMPONENT_DEPARTMENT}
                                            onChange={(e) =>
                                                updateField(index, 'Department', e.target.value)
                                            }
                                        />
                                        <Textarea
                                            label="Production Details"
                                            name="ProdDetails"
                                            value={section.ProdDetails || ''}
                                            onChange={(e) =>
                                                updateField(index, 'ProdDetails', e.target.value)
                                            }
                                        />
                                    </fieldset>
                                )}
                                {section['ComponentSource'] === 'customer-supplied' && (
                                    <fieldset className="border rounded p-4 bg-sky-100 flex flex-col gap-2">
                                        <legend className='text-xs text-gray-800'>Customer Supplied Information</legend>

                                        <TextInput
                                            label="Coming From"
                                            name="ComingFrom"
                                            value={section.ComingFrom || ''}
                                            onChange={(e) =>
                                                updateField(index, 'ComingFrom', e.target.value)
                                            }
                                        />

                                        <TextInput
                                            label="PO Reference"
                                            name="PORef"
                                            value={section.PORef || ''}
                                            onChange={(e) =>
                                                updateField(index, 'PORef', e.target.value)
                                            }
                                        />
                                        <TextInput
                                            label="Tracking Number"
                                            name="TrackingNum"
                                            value={section.TrackingNum || ''}
                                            onChange={(e) =>
                                                updateField(index, 'TrackingNum', e.target.value)
                                            }
                                        />
                                        <DateInput
                                            label="Expected Arrival"
                                            name="ExpectedArrival"
                                            value={section.ExpectedArrival || ''}
                                            onChange={(e) =>
                                                updateField(index, 'ExpectedArrival', e.target.value)
                                            }
                                        />
                                        <NumberInput
                                            label='Expected Quantity'
                                            name='ExpectedQuantity'
                                            value={section.ExpectedQuantity || ''}
                                            onChange={(e) =>
                                                updateField(index, 'ExpectedQuantity', e.target.value)
                                            }
                                        />
                                    </fieldset>
                                )}
                                {section['ComponentSource'] === 'veracore-inventory' && (
                                    <fieldset className="border rounded p-4 bg-sky-100 flex flex-col gap-2">
                                        <legend className='text-xs text-gray-800'>Veracore Inventory Details</legend>

                                        <TextInput
                                            label="Product ID"
                                            name="ProductId"
                                            value={section.ProductId || ''}
                                            onChange={(e) =>
                                                updateField(index, 'ProductId', e.target.value)
                                            }
                                        />
                                        <NumberInput
                                            label='Quantity Needed'
                                            name='QuantityNeeded'
                                            value={section.QuantityNeeded || ''}
                                            onChange={(e) =>
                                                updateField(index, 'QuantityNeeded', e.target.value)
                                            }
                                        />
                                    </fieldset>
                                )}
                            </>
                        )}



                    </RepeatingSection>
                    {serviceType === 'shrinkwrap-only' &&
                        <fieldset className='bg-amber-50'>
                            <legend className="text-gray-800 text-sm">Shrinkwrap Pack Information</legend>

                            <RepeatingSection fields={SHRINKWRAP_PK_INFO_REPEATING_FIELDS} onChange={handleShrinkwrapChange} count={shrinkwrapPacks.length || 1} allowManualAdd={true} unit='Pack' className='bg-amber-100' labelSize='xs' value={shrinkwrapPacks} />
                            <TextInput
                                label='Total'
                                value={packsTotal}
                                readOnly
                                disabled
                                direction='row'
                                wrapperId='packsTotal'
                            />
                        </fieldset>
                    }
                </FormSection>

                <FormSection legend="Timeline">
                    <SelectInput
                        label="Desired Timeline"
                        name="Timeline"
                        value={timeline}
                        onChange={(e) => setTimeline(e.target.value)}
                        options={TIMELINE_OPTIONS}
                    />
                </FormSection>

                <FormSection legend="Packaging Instructions">
                    <SelectInput
                        label="Carton Type"
                        name="CartonType"
                        value={cartonType}
                        onChange={(e) => setCartonType(e.target.value)}
                        options={CARTON_TYPE}
                    />
                    {cartonType === "custom" &&
                        <SelectInput
                            label="Custom Carton Source"
                            name="CustomCartonSource"
                            value={customCartonSource}
                            onChange={(e) => setCustomCartonSource(e.target.value)}
                            options={CUSTOM_CARTON_SOURCE}
                        />}
                    <Textarea
                        label="Labeling Instructions"
                        name="LabelingInstructions"
                        value={labelingInstructions}
                        onChange={(e) => setLabelingInstructions(e.target.value)}
                        rows={4}
                        placeholder="Labeling requirements and instructions"
                    />
                    <FileInput
                        label='Upload Custom Label (Optional)'
                        name='custom-label'
                        value={customLabelValue}
                        onChange={(e) => setCustomLabelValue(e.target.value)}
                    />
                </FormSection>


                <FormSection legend="Shipping Instructions">
                    <NumberInput
                        label="Number of Addresses/Shipments"
                        name="Shipments"
                        value={numOfShipments}
                        onChange={(e) => setNumOfShipments(e.target.value)}
                        min={0}
                    />
                    <DateInput
                        label="Ship Date"
                        name="ShipDate"
                        value={shipDateValue}
                        onChange={(e) => setShipDateValue(e.target.value)}
                    />
                    <SelectInput
                        label="Shipping Method"
                        name="ShippingMethod"
                        value={shippingMethod}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        options={SHIPPING_METHOD}
                    />
                    <CheckboxInput
                        label='Advanced Shipping Notice (ASN) Required'
                        name='ASN-required'
                        checked={ASNRequired}
                        onChange={(e) => setASNRequired(e.target.checked)}
                    />

                    <CheckboxInput
                        label='Is Approval Needed Prior to Ship?'
                        name='approval-needed'
                        checked={approvalNeeded}
                        onChange={(e) => setApprovalNeeded(e.target.checked)}
                    />

                    <CheckboxInput
                        label='International Shipment?'
                        name='intl-shipment'
                        checked={intlShipment}
                        onChange={(e) => setIntlShipment(e.target.checked)}
                    />

                </FormSection>
                <FormSection legend='Additional Information'>
                    <Textarea
                        label="Additional Notes or Requirements"
                        name="AddlNotes"
                        value={addlNotes}
                        onChange={(e) => setAddlNotes(e.target.value)}
                        rows={4}
                        placeholder="Any other details we should know about"
                    />
                </FormSection>
                <Button label='Submit' type='submit' />
            </form>
        </div>

    )
}

export default EstimateForm
