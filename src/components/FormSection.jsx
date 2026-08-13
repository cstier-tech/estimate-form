function FormSection({ legend, children }) {
  return (
    <fieldset className="mb-4">
      <legend>{legend}</legend>
      <div className="flex flex-col gap-3 p-2">{children}</div>
    </fieldset>
  )
}

export default FormSection
