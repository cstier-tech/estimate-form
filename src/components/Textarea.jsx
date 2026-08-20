function Textarea({ label, value, onChange, name, rows, placeholder, required }) {
  return (
    <div className="flex flex-col gap-1">
      {required ?
      <label htmlFor={name}>{label} <span className="text-red-500 pl-1">*</span></label>
      : <label htmlFor={name}>{label}</label>
    }
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        required={required}
      />
    </div>
  )
}

export default Textarea
