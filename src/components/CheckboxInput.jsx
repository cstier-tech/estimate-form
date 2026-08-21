import { CHECKBOX_CLASS } from './fieldStyles'

function CheckboxInput({ label, checked, onChange, name }) {
  return (
    <div className="flex items-center gap-2">
      <input type="checkbox" id={name} name={name} checked={checked} onChange={onChange} className={CHECKBOX_CLASS} />
      <label htmlFor={name} className="text-sm text-gray-700">{label}</label>
    </div>
  )
}

export default CheckboxInput
