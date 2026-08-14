function TextInput({ label, value, onChange, placeholder, name, required, disabled, readOnly, direction='col', wrapperId }) {
  return (
    <div className={`flex flex-${direction} gap-1`} id={wrapperId}>
      <label htmlFor={name}>{label}</label>
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
      />
    </div>
  )
}

export default TextInput
