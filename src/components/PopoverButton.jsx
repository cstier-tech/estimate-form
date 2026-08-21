import { useState } from 'react'

function PopoverButton({ label, children }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        {label}
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full z-10 mt-1 w-64 rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
            <div className="text-sm font-semibold text-gray-900">{label}</div>
            <button
              type="button"
              aria-label="Close"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              &#x2715;
            </button>
          </div>
          <div className="p-3">{children}</div>
        </div>
      )}
    </div>
  )
}

export default PopoverButton
