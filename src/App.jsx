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

const CATEGORY_OPTIONS = [
  { label: 'Hardware', value: 'hardware' },
  { label: 'Software', value: 'software' },
  { label: 'Services', value: 'services' },
]

const SHIPPING_OPTIONS = [
  { label: 'Standard', value: 'standard' },
  { label: 'Express', value: 'express' },
  { label: 'Overnight', value: 'overnight' },
]

const REPEATING_FIELDS = [
  { name: 'name', label: 'Name', type: 'text' },
  { name: 'quantity', label: 'Quantity', type: 'number' },
  { name: 'date', label: 'Date', type: 'date' },
  { name: 'category', label: 'Category', type: 'select', options: CATEGORY_OPTIONS },
]

function FormFieldsTab() {
  const [textValue, setTextValue] = useState('')
  const [numberValue, setNumberValue] = useState('')
  const [dateValue, setDateValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')
  const [selectValue, setSelectValue] = useState(CATEGORY_OPTIONS[0].value)
  const [checked, setChecked] = useState(false)
  const [shipping, setShipping] = useState(SHIPPING_OPTIONS[0].value)

  return (
    <FormSection legend="Item Details">
      <TextInput
        label="Name"
        name="name"
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
        placeholder="Enter a name"
      />
      <NumberInput
        label="Quantity"
        name="quantity"
        value={numberValue}
        onChange={(e) => setNumberValue(e.target.value)}
        min={0}
      />
      <DateInput
        label="Due Date"
        name="dueDate"
        value={dateValue}
        onChange={(e) => setDateValue(e.target.value)}
      />
      <Textarea
        label="Notes"
        name="notes"
        value={textareaValue}
        onChange={(e) => setTextareaValue(e.target.value)}
        rows={4}
        placeholder="Additional notes"
      />
      <SelectInput
        label="Category"
        name="category"
        value={selectValue}
        onChange={(e) => setSelectValue(e.target.value)}
        options={CATEGORY_OPTIONS}
      />
      <CheckboxInput
        label="Taxable"
        name="taxable"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      <RadioGroup
        label="Shipping Method"
        name="shipping"
        options={SHIPPING_OPTIONS}
        value={shipping}
        onChange={(e) => setShipping(e.target.value)}
      />
    </FormSection>
  )
}

function RepeatingSectionsTab() {
  return (
    <FormSection legend="Line Items">
      <RepeatingSection fields={REPEATING_FIELDS} onChange={() => { }} />
    </FormSection>
  )
}

function ControlsTab() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <FormSection legend="Buttons">
        <div className="flex flex-wrap gap-2">
          <Button label="Primary" variant="primary" onClick={() => { }} />
          <Button label="Danger" variant="danger" onClick={() => { }} />
          <Button label="Info" variant="info" onClick={() => { }} />
          <Button label="Success" variant="success" onClick={() => { }} />
          <Button label="Warning" variant="warning" onClick={() => { }} />
          <Button label="Disabled" disabled />
          <PopoverButton label="More Info">
            <p>This is a floating popover panel.</p>
          </PopoverButton>
          <Button label="Open Modal" onClick={() => setIsModalOpen(true)} />
        </div>
        <ButtonBar>
          <Button label="Save" variant="success" onClick={() => { }} />
          <Button label="Cancel" variant="warning" onClick={() => { }} />
          <Button label="Reset" variant="info" onClick={() => { }} />
        </ButtonBar>
      </FormSection>
      <Modal
        title="Confirm Action"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <p>Are you sure you want to proceed?</p>
        <ButtonBar>
          <Button label="OK" onClick={() => setIsModalOpen(false)} />
          <Button label="Cancel" onClick={() => setIsModalOpen(false)} />
        </ButtonBar>
      </Modal>
    </div>
  )
}

function App() {
  const tabs = [
    { label: 'Form Fields', content: <FormFieldsTab /> },
    { label: 'Repeating Sections', content: <RepeatingSectionsTab /> },
    { label: 'Controls', content: <ControlsTab /> },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="window w-full max-w-2xl">
        <div className="title-bar">
          <div className="title-bar-text">Data Entry Mockup</div>
          <div className="title-bar-controls">
            <button aria-label="Minimize" />
            <button aria-label="Maximize" />
            <button aria-label="Close" />
          </div>
        </div>
        <div className="window-body">
          <Tabs tabs={tabs} />
        </div>
      </div>
    </div>
  )
}

export default App
