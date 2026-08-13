import { useState } from 'react'

function PopoverButton({ label, children }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative inline-block">
      <button type="button" onClick={() => setIsOpen((open) => !open)}>
        {label}
      </button>
      {isOpen && (
        <div className="window absolute top-full left-0 mt-1 z-10 w-64">
          <div className="title-bar">
            <div className="title-bar-text">{label}</div>
            <div className="title-bar-controls">
              <button aria-label="Close" onClick={() => setIsOpen(false)} />
            </div>
          </div>
          <div className="window-body">{children}</div>
        </div>
      )}
    </div>
  )
}

export default PopoverButton
