import { LABEL_CLASS, INPUT_CLASS } from './fieldStyles'

function Textarea({ label, value, onChange, name, rows, placeholder, required }) {
  return (
    <div className="flex flex-col gap-1">
      {required ?
      <label htmlFor={name} className={LABEL_CLASS}>{label} <span className="text-red-500 pl-1">*</span></label>
      : <label htmlFor={name} className={LABEL_CLASS}>{label}</label>
    }
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className={INPUT_CLASS}
      />
    </div>
  )
}

export default Textarea
