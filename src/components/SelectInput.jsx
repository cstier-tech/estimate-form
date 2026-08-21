import { LABEL_CLASS, INPUT_CLASS } from './fieldStyles'

function SelectInput({ label, value, onChange, name, options = [] }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className={LABEL_CLASS}>{label}</label>
      <select id={name} name={name} value={value} onChange={onChange} className={INPUT_CLASS}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SelectInput
