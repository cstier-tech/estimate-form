import { LABEL_CLASS, INPUT_CLASS } from './fieldStyles'
// Source - https://stackoverflow.com/a/59291891
// Posted by Vincent, modified by community. See post 'Timeline' for change history
// Retrieved 2026-08-27, License - CC BY-SA 4.0

function enforceMinMax(el) {
  if (el.value != "") {
    if (parseInt(el.value) < parseInt(el.min)) {
      el.value = el.min;
    }
    if (parseInt(el.value) > parseInt(el.max)) {
      el.value = el.max;
    }
  }
}
function NumberInput({ label, value, onChange, name, min = '0', max, required, disabled }) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label !== '' &&
        <label htmlFor={name} className={`LABEL_CLASS` + ` test`}>{label}</label>
      }
      <input
        type="number"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        required={required}
        disabled={disabled}
        className={`${INPUT_CLASS} disabled:bg-gray-100 disabled:cursor-not-allowed`}
        onKeyUp={(e) => enforceMinMax(e.target)}
      />
    </div>
  )
}

export default NumberInput
