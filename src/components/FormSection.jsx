function FormSection({ legend, children, bgColor='white'}) {
  return (
    <fieldset className={`mb-4 bg-${bgColor}`}>
      <legend>{legend}</legend>
      <div className="flex flex-col gap-3 p-2">{children}</div>
    </fieldset>
  )
}

export default FormSection
