// Horizontal stepper. Each step shows one of three states: current, visited
// (done at least once), or not yet visited.

function WizardNav({ steps, current, visited, onSelect }) {
    return (
        <ol className="mb-4 flex flex-wrap flex-col gap-2">
            {steps.map((step, index) => {
                const isCurrent = step.id === current
                const isVisited = Boolean(visited[step.id])

                const button = [
                    "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition",
                    isCurrent
                        ? "font-semibold text-indigo-700"
                        : isVisited
                            ? "text-gray-700 hover:bg-gray-50"
                            : "text-gray-400 hover:bg-gray-50",
                ].join(" ")

                const badge = [
                    "flex h-5 w-5 items-center justify-center rounded-full text-xs",
                    isCurrent
                        ? "bg-indigo-500 text-white"
                        : isVisited
                            ? "bg-emerald-500 text-white"
                            : "bg-gray-200 text-gray-500",
                ].join(" ")

                return (
                    <li key={step.id}>
                        <button type="button" className={button} onClick={() => onSelect(step.id)}>
                            <span className={badge}>{isVisited && !isCurrent ? "✓" : index + 1}</span>
                            {step.label}
                        </button>
                    </li>
                )
            })}
        </ol>
    )
}

export default WizardNav
