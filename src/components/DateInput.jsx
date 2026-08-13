function DateInput({ label, value, onChange, name, required }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name}>{label}</label>
      <input
        type="date"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  )
}

export default DateInput
