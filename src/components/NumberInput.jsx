function NumberInput({ label, value, onChange, name, min, max, required }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name}>{label}</label>
      <input
        type="number"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        required={required}
      />
    </div>
  )
}

export default NumberInput
