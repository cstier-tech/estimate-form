import { useState } from 'react'

function Tabs({ tabs = [] }) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="w-full">
      <div role="tablist" className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-controls={`tabpanel-${tab.label}`}
            onClick={() => setActiveIndex(index)}
            className={
              index === activeIndex
                ? 'border-b-2 border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600'
                : 'border-b-2 border-transparent px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700'
            }
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <article
          key={tab.label}
          role="tabpanel"
          id={`tabpanel-${tab.label}`}
          hidden={index !== activeIndex}
          className="p-4"
        >
          {tab.content}
        </article>
      ))}
    </div>
  )
}

export default Tabs
