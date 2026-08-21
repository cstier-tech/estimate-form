import { LABEL_CLASS, INPUT_CLASS } from './fieldStyles'

const DIRECTION_CLASSES = { row: 'flex-row', col: 'flex-col' }

function TextInput({ label, value, onChange, placeholder, name, required, disabled, readOnly, direction='col', wrapperId, formText }) {
  return (
    <div className={`flex ${DIRECTION_CLASSES[direction] || 'flex-col'} gap-1`} id={wrapperId}>
      <label htmlFor={name} className={LABEL_CLASS}>{label}</label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        disabled={disabled}
        className={INPUT_CLASS}
      />
      {formText && <small className="text-xs text-gray-500">{formText}</small>}
    </div>
  )
}

export default TextInput
