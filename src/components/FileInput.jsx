import { LABEL_CLASS } from './fieldStyles'

function FileInput({ label, value, name, onChange, required }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className={LABEL_CLASS}>{label}</label>
      <input
        type="file"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-gray-700 hover:file:bg-gray-200"
      />
    </div>
  )
}

export default FileInput
