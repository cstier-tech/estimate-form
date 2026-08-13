function RadioGroup({ label, name, options = [], value, onChange }) {
  return (
    <fieldset className="flex flex-col gap-1">
      <legend>{label}</legend>
      {options.map((option) => {
        const id = `${name}-${option.value}`
        return (
          <div key={option.value} className="flex items-center gap-1">
            <input
              type="radio"
              id={id}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
            />
            <label htmlFor={id}>{option.label}</label>
          </div>
        )
      })}
    </fieldset>
  )
}

export default RadioGroup
