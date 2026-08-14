import { useState, useEffect } from 'react'
import Button from './Button'


function emptySection(fields) {
  return fields.reduce((section, field) => {
    section[field.name] = field.type === 'checkbox' ? false : ''
    return section
  }, {})
}

function RepeatingSection({
  fields = [],
  count = 0,
  onChange,
  allowManualAdd = true,
  unit = 'Item',
  className,
  labelSize = 'sm',
  children
}) {
  const [sections, setSections] = useState([])

  function updateSections(next) {
    setSections(next)
    onChange?.(next)
  }

  function updateField(index, name, value) {
    const next = sections.map((section, i) =>
      i === index ? { ...section, [name]: value } : section
    )
    updateSections(next)
  }

  function addSection() {
    updateSections([...sections, emptySection(fields)])
  }

  function removeSection(index) {
    updateSections(sections.filter((_, i) => i !== index))
  }

  useEffect(() => {
    const total = Math.max(0, Number(count) || 0)

    const next = Array.from(
      { length: total },
      (_, i) => sections[i] || emptySection(fields)
    )

    if (next.length !== sections.length) {
      updateSections(next)
    }
  }, [count])

  function renderField(field, section, index) {
    const id = `${field.name}-${index}`
    // const value = section[field.name]
    const value = field.calculate
      ? field.calculate(section)
      : section[field.name];

    switch (field.type) {
      case 'number':
        return (
          <input
            type="number"
            id={id}
            value={value}
            readOnly={field.isReadOnly}
            disabled={field.isReadOnly}
            onChange={(e) =>
              updateField(index, field.name, e.target.value)
            }

          />
        )

      case 'date':
        return (
          <input
            type="date"
            id={id}
            value={value}
            onChange={(e) =>
              updateField(index, field.name, e.target.value)
            }
          />
        )

      case 'select':
        return (
          <select
            id={id}
            value={value}
            onChange={(e) =>
              updateField(index, field.name, e.target.value)
            }
          >
            {(field.options || []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )

      case 'checkbox':
        return (
          <input
            type="checkbox"
            id={id}
            checked={value}
            onChange={(e) =>
              updateField(index, field.name, e.target.checked)
            }
          />
        )

      default:
        return (
          <input
            type="text"
            id={id}
            value={value}
            onChange={(e) =>
              updateField(index, field.name, e.target.value)
            }
          />
        )
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {sections.map((section, index) => (
        <fieldset key={index} className={className}>
          <legend className={`text-gray-800 text-${labelSize}`}>{unit} {index + 1}</legend>

          <div className="flex flex-wrap gap-3 p-2">
            {fields
              .filter(
                (field) =>
                  !field.showWhen || field.showWhen(section)
              )
              .map((field) => (
                <div
                  key={field.name}
                  className={
                    field.type === 'checkbox'
                      ? 'flex items-center gap-1'
                      : 'flex flex-col gap-1'
                  }
                >
                  {field.type === 'checkbox' ? (
                    <>
                      {renderField(field, section, index)}
                      <label htmlFor={`${field.name}-${index}`}>
                        {field.label}
                      </label>
                    </>
                  ) : (
                    <>
                      <label htmlFor={`${field.name}-${index}`}>
                        {field.label}
                      </label>
                      {renderField(field, section, index)}
                    </>
                  )}
                </div>
              ))}
          </div>
          {allowManualAdd && (
            <div className="flex justify-end p-2">

              <Button label='Remove' variant='danger' onClick={() => removeSection(index)} />
            </div>
          )}
          {typeof children === 'function' && children(section, index)}
        </fieldset>
      ))}

      {allowManualAdd && (
        <div>
          <Button label='Add Item' onClick={addSection} variant='info' />
        </div>
      )}
    </div>
  )
}

export default RepeatingSection