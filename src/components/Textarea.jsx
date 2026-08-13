function Textarea({ label, value, onChange, name, rows, placeholder }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name}>{label}</label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
      />
    </div>
  )
}

export default Textarea
