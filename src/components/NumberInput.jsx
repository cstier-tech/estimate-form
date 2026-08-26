import { LABEL_CLASS, INPUT_CLASS } from './fieldStyles'

function NumberInput({ label, value, onChange, name, min, max, required }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={name} className={LABEL_CLASS}>{label}</label>
      <input
        type="number"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        required={required}
        className={INPUT_CLASS}
      />
    </div>
  )
}

export default NumberInput
