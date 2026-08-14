import { useState } from 'react'
import TextInput from './components/TextInput'
import NumberInput from './components/NumberInput'
import DateInput from './components/DateInput'
import Textarea from './components/Textarea'
import SelectInput from './components/SelectInput'
import CheckboxInput from './components/CheckboxInput'
import RadioGroup from './components/RadioGroup'
import FormSection from './components/FormSection'
import RepeatingSection from './components/RepeatingSection'
import Button from './components/Button'
import ButtonBar from './components/ButtonBar'
import PopoverButton from './components/PopoverButton'
import Modal from './components/Modal'
import Tabs from './components/Tabs'
import FileInput from './components/FileInput'

const PROJECT_TYPE = [
  { label: 'Select One', value: '' },
  { label: 'Shrinkwrap Only', value: 'shrinkwrap-only' },
  { label: 'Kit Assembly', value: 'kit-assembly' },
  { label: 'Kit Assembly with Drop Shipments', value: 'kit-assembly-drop-ship' },
  { label: 'Other', value: 'other' },
]

const TIMELINE_OPTIONS = [
  { label: 'As soon as possible', value: 'As soon as possible' },
  { label: '1-3 months', value: '1-3 months' },
  { label: '3-6 months', value: '3-6 months' },
  { label: '6-12 months', value: '6-12 months' },
  { label: 'Flexible', value: 'Flexible' }
]
const CARTON_TYPE = [
  { label: 'Convenient/Standard', value: 'convenient' },
  { label: 'Double Walled', value: 'double-walled' },
  { label: 'Custom', value: 'custom' },
]

const SHIPPING_METHOD = [
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
    name: 'component-name',
    label: 'Component Name',
    type: 'text',
  },
  {
    name: 'component-type',
    label: 'Component Type',
    type: 'select',
    options: COMPONENT_TYPE,
  },
  {
    name: 'component-source',
    label: 'Where is this component coming from?',
    type: 'select',
    options: COMPONENT_SOURCE,
  },
  {
    name: 'size',
    label: 'Size',
    type: 'select',
    options: COMPONENT_SIZE,
    showWhen: (section) =>
      section['component-type'] === 'printed-product',
  },
  {
    name: 'other-size',
    label: 'Please Specify Size',
    type: 'text',
    showWhen: (section) =>
      section['size'] === 'other',
  },
  {
    name: 'stock',
    label: 'Stock/Substrate',
    type: 'text',
    showWhen: (section) =>
      section['component-type'] === 'printed-product',
  },
  {
    name: 'other-name',
    label: 'Please specify',
    type: 'text',
    showWhen: (section) =>
      section['component-type'] === 'other',
  }
]

//shrinkwrap pack info
const SHRINKWRAP_PK_INFO_REPEATING_FIELDS = [
  { name: 'qty-per-pack', label: 'Quantity Per Pack', type: 'number' },
  { name: 'num-of-packs', label: 'Numer of Packs', type: 'number' },
  {
    name: 'pack-total', label: 'Pack Total', type: 'number', isReadOnly: true,
    calculate: (section) =>
      (Number(section['qty-per-pack']) || 0) *
      (Number(section['num-of-packs']) || 0)
  },

]



function App() {

  //project details
  const [projectDescription, setProjectDescription] = useState(PROJECT_TYPE[0].value)
  const [projectType, setProjectType] = useState(PROJECT_TYPE[0].value)
  const [numOfComponents, setNumOfComponents] = useState('')

  const [shrinkwrapPacks, setShrinkwrapPacks] = useState([])

  //timeline
  const [timeline, setTimeline] = useState('')

  //packaging instructions
  const [cartonType, setCartonType] = useState('')
  const [labelingInstructions, setLabelingInstructions] = useState('')
  const [customLabelValue, setCustomLabelValue] = useState('')

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
      'pack-total':
        (Number(section['qty-per-pack']) || 0) *
        (Number(section['num-of-packs']) || 0)
    }));

    setShrinkwrapPacks(updated);
  };

  const packsTotal = shrinkwrapPacks.reduce(
    (total, pack) =>
      total +
      (Number(pack['qty-per-pack']) || 0) *
      (Number(pack['num-of-packs']) || 0),
    0
  );

  return (

    <div className="bg-lime-950/10 p-20">
      <h3 className='m-0'>Request an Estimate</h3>
      <p className='mb-5'>Fill out the form below and we'll get back to you within 24-48 hours</p>
      <form>
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
            name="ProjectType"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            options={PROJECT_TYPE}
          />
          {projectType != '' &&
            <NumberInput
              label="Number of Components"
              name="components"
              value={numOfComponents}
              onChange={(e) => setNumOfComponents(e.target.value)}
              min={0}
            />}
          <RepeatingSection fields={COMPONENTS_REPEATING_FIELDS} onChange={setShrinkwrapPacks} count={numOfComponents} allowManualAdd={false} unit='Component' className='bg-sky-50' value={shrinkwrapPacks}>

            {(section) => (
              <>
                {section['component-source'] === 'lcp-prod' && (
                  <fieldset className="border rounded p-4 bg-sky-100 flex flex-col gap-2">
                    <legend className='text-xs text-gray-800'>LCP Production Details</legend>

                    <TextInput
                      label="Job Number"
                      name="job-number"
                    />

                    <SelectInput
                      label="Department"
                      name="department"
                      options={COMPONENT_DEPARTMENT}
                    />
                    <Textarea
                      label="Production Details"
                      name="prod-details"
                    />
                  </fieldset>
                )}
                {section['component-source'] === 'customer-supplied' && (
                  <fieldset className="border rounded p-4 bg-sky-100 flex flex-col gap-2">
                    <legend className='text-xs text-gray-800'>Customer Supplied Information</legend>

                    <TextInput
                      label="Coming From"
                      name="coming-from"
                    />

                    <TextInput
                      label="PO Reference"
                      name="po-ref"
                    />
                    <TextInput
                      label="Tracking Number"
                      name="tracking-num"
                    />
                    <DateInput
                      label="Expected Arrival"
                      name="expected-arrival"
                    />
                    <NumberInput
                      label='Expected Quantity'
                      name='expected-quantity'
                    />
                  </fieldset>
                )}
                {section['component-source'] === 'veracore-inventory' && (
                  <fieldset className="border rounded p-4 bg-sky-100 flex flex-col gap-2">
                    <legend className='text-xs text-gray-800'>Veracore Inventory Details</legend>

                    <TextInput
                      label="Product ID"
                      name="product-id"
                    />
                    <NumberInput
                      label='Quantity Needed'
                      name='quantity-needed'
                    />
                  </fieldset>
                )}
              </>
            )}



          </RepeatingSection>
          {projectType === 'shrinkwrap-only' &&
            <fieldset className='bg-amber-50'>
              <legend className="text-gray-800 text-sm">Shrinkwrap Pack Information</legend>

              <RepeatingSection fields={SHRINKWRAP_PK_INFO_REPEATING_FIELDS} onChange={handleShrinkwrapChange} count={1} allowManualAdd={true} unit='Pack' className='bg-amber-100' labelSize='xs' />
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
            options={PROJECT_TYPE}
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

export default App
