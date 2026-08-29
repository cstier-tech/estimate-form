function FormSection({ legend, children, bg = 'bg-white', border = 'border-gray-200' }) {
  return (
    <fieldset className={`rounded-lg border px-10 pb-10 pt-5 ${bg} ${border}`}>
      <legend className="px-1 text-base font-semibold text-gray-900">{legend}</legend>
      <div className="flex flex-col gap-4 pt-1">{children}</div>
    </fieldset>
  )
}

export default FormSection
