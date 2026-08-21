import { LABEL_CLASS, RADIO_CLASS } from './fieldStyles'

function RadioGroup({ label, name, options = [], value, onChange }) {
  return (
    <fieldset className="flex flex-col gap-1">
      <legend className={LABEL_CLASS}>{label}</legend>
      {options.map((option) => {
        const id = `${name}-${option.value}`
        return (
          <div key={option.value} className="flex items-center gap-2">
            <input
              type="radio"
              id={id}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              className={RADIO_CLASS}
            />
            <label htmlFor={id} className="text-sm text-gray-700">{option.label}</label>
          </div>
        )
      })}
    </fieldset>
  )
}

export default RadioGroup
