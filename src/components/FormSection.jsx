function FormSection({ legend, children }) {
  return (
    <fieldset className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <legend className="px-1 text-base font-semibold text-gray-900">{legend}</legend>
      <div className="flex flex-col gap-4 pt-1">{children}</div>
    </fieldset>
  )
}

export default FormSection
