function Modal({ title, children, isOpen, onClose }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-96 overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div className="font-semibold text-gray-900">{title}</div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            &#x2715;
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  )
}

export default Modal
