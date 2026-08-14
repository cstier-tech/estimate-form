function FileInput({ label, value, name, onChange, required }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name}>{label}</label>
      <input
        type="file"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  )
}

export default FileInput
