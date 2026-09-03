import { LABEL_CLASS, RADIO_CLASS } from './fieldStyles'

function RadioCards({ label, name, options = [], value, onChange }) {
    return (
        <fieldset className="flex gap-2">
            <legend className={`${LABEL_CLASS} mb-2`}>{label}</legend>
            {options.map((option) => {
                const id = `${name}-${option.value}`
                return (
                    <div key={option.value} className="flex items-center gap-2 group">

                        <label htmlFor={id} className="
                        whitespace-nowrap cursor-pointer
                        bg-white 
                        flex items-center gap-2
                        text-gray-700 
                        border border-gray-300 
                        hover:bg-gray-50 
                        peer-focus:ring-gray-400 
                        px-3 py-2 text-sm rounded-md 
                        group-has-[:checked]:bg-blue-50
                        group-has-[:checked]:hover:bg-blue-50
                        group-has-[:checked]:hover:text-blue-700
                        ">

                            <input
                                type="radio"
                                id={id}
                                name={name}
                                value={option.value}
                                checked={value === option.value}
                                onChange={onChange}
                                className={`${RADIO_CLASS} peer`}
                            />
                            <span className='peer-checked:text-blue-600 '>{option.label}</span>
                        </label>
                    </div>
                )
            })}
        </fieldset>
    )
}

export default RadioCards