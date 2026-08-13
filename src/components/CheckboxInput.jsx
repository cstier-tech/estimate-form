function CheckboxInput({ label, checked, onChange, name }) {
  return (
    <div className="flex items-center gap-1">
      <input type="checkbox" id={name} name={name} checked={checked} onChange={onChange} />
      <label htmlFor={name}>{label}</label>
    </div>
  )
}

export default CheckboxInput
