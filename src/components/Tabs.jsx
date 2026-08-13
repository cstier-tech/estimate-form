import { useState } from 'react'

function Tabs({ tabs = [] }) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className="w-full">
      <menu role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={tab.label}
            role="tab"
            aria-selected={index === activeIndex}
            aria-controls={`tabpanel-${tab.label}`}
            onClick={() => setActiveIndex(index)}
          >
            {tab.label}
          </button>
        ))}
      </menu>
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
