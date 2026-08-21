import { LABEL_CLASS, INPUT_CLASS } from './fieldStyles'

function DateInput({ label, value, onChange, name, required }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className={LABEL_CLASS}>{label}</label>
      <input
        type="date"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={INPUT_CLASS}
      />
    </div>
  )
}

export default DateInput
