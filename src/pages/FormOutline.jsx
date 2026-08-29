// Testing reference: a flat listing of every question in NewestForm, every
// conditional that shows/hides a question or section, and the options for each
// select/checkbox group. Hand-maintained — update it when the form changes.

const OUTLINE = [
    {
        section: "Project Overview",
        component: "form_sections/job_overview/ProjectOverview.jsx",
        note: "Client Name and Customer Number are NOT asked here — they come from URL query params (?clientName=&customerNumber=) via App.jsx.",
        fields: [
            { label: "Project Name", type: "text", flags: ["optional"] },
            { label: "Estimate Due Date", type: "date" },
            { label: "Sales Rep", type: "text" },
            {
                label: "Job Type",
                type: "select",
                options: [
                    "Select One (empty)",
                    "New Job",
                    "Reprint – No Changes",
                    "Reprint – With Changes",
                    "Quote Update",
                ],
            },
            {
                label: "Previous Job # (if applicable)",
                type: "text",
                showWhen: 'Job Type is "Reprint – No Changes", "Reprint – With Changes", or "Quote Update"',
            },
            {
                label: "Previous Estimate # (if applicable)",
                type: "text",
                showWhen: 'Job Type is "Reprint – No Changes", "Reprint – With Changes", or "Quote Update"',
            },
            {
                label: "Changes from previous job or quote?",
                type: "text",
                showWhen: 'Job Type is "Reprint – With Changes" or "Quote Update"',
            },
            { label: "Project Description", type: "textarea", flags: ["required"] },
        ],
    },
    {
        section: "Quantities to Quote",
        component: "form_sections/shared/QuantityControl.jsx",
        fields: [
            { label: "Quantity", type: "number", flags: ["repeatable — 'Add Qty', remove per row"] },
        ],
    },
    {
        section: "Service Type",
        component: "form_sections/job_services/ServiceType.jsx",
        note: "Checkboxes — select all that apply. Some toggle whole sections below.",
        fields: [
            { label: "Kitting", type: "checkbox", effect: "Shows the Kitting section" },
            { label: "Packing", type: "checkbox" },
            { label: "Distribution", type: "checkbox" },
            { label: "Mailing", type: "checkbox", effect: "Shows the Mailing section" },
            { label: "Inkjet", type: "checkbox" },
            { label: "Inventory Storage", type: "checkbox" },
            { label: "Data Prep", type: "checkbox" },
            { label: "Other Service Types", type: "checkbox" },
            {
                label: "Specify other service types (comma separate multiple types if more than 1)",
                type: "text",
                showWhen: '"Other Service Types" is checked',
            },
        ],
    },
    {
        section: "Components",
        component: "form_sections/job_components/JobComponents.jsx",
        note: "Repeatable — 'Add Component'. Each component can be saved individually and has its own Finishing sub-section.",
        fields: [
            { label: "Component Name", type: "text" },
            {
                label: "Component Source",
                type: "select",
                options: [
                    "Select Source (empty)",
                    "LCP Production",
                    "Customer Supplied",
                    "Veracore Inventory",
                ],
            },
            {
                label: "Job Number",
                type: "text",
                showWhen: 'Component Source is "LCP Production"',
            },
            { label: "Size", type: "text" },
            { label: "Flat Size", type: "text" },
            { label: "Stock", type: "text" },
            { label: "Coating", type: "text" },
            {
                label: "Quantity (per component)",
                type: "number",
                flags: ["repeatable"],
                showWhen: '"Quantity is the same as Total Finished Qty(s)" is NOT checked',
            },
            {
                label: "Quantity is the same as Total Finished Qty(s)",
                type: "checkbox",
                effect: "When checked, hides the per-component Quantity inputs and reuses the Quantities to Quote values",
            },
        ],
        subSections: [
            {
                section: "Finishing (per component)",
                component: "form_sections/job_components/Finishing.jsx",
                note: "Checkboxes — select all that apply. Checking an operation reveals its detail fields.",
                fields: [
                    {
                        label: "Perf",
                        type: "checkbox",
                        reveals: ["Performed By? (text)", "Perf Type (text)", "Perf Location (text)"],
                    },
                    { label: "Hole Drill", type: "checkbox" },
                    { label: "Score", type: "checkbox" },
                    { label: "Folding", type: "checkbox", note: "No detail fields defined" },
                    {
                        label: "Glue / Seal",
                        type: "checkbox",
                        reveals: [
                            "Tab Glue (checkbox)",
                            "Glue Dots (checkbox)",
                            "Fugitive Glue (checkbox)",
                            "Double Sided Tape (checkbox)",
                        ],
                    },
                    { label: "Trim", type: "checkbox", reveals: ["Trim To (text)"] },
                    { label: "Other", type: "checkbox", reveals: ["Specify Other (text)"] },
                ],
            },
        ],
    },
    {
        section: "Kitting",
        component: "form_sections/job_kitting/Kitting.jsx",
        showWhen: 'Service Type "Kitting" is checked',
        note: "Repeatable — 'Add Kit'. Kits are also auto-created from saved components while Kitting is enabled.",
        fields: [
            { label: "What should be done with the overage?", type: "text" },
            { label: "Qty per kit", type: "number", flags: ["repeatable"] },
        ],
    },
    {
        section: "Mailing",
        component: "form_sections/job_mailing/Mailing.jsx",
        showWhen: 'Service Type "Mailing" is checked',
        fields: [
            { label: "Class of Mail", type: "text" },
            { label: "Indicia", type: "text" },
            { label: "Payment Method", type: "text" },
            { label: "Permit Type", type: "text" },
            { label: "Nonprofit Auth #", type: "text" },
            { label: "Mailing From", type: "text" },
            { label: "Permit Owner Info", type: "text" },
            { label: "Exact Company Name", type: "text" },
            { label: "Exact Company Address", type: "text" },
        ],
    },
    {
        section: "Packing",
        component: "form_sections/PackDistribution.jsx (rendered inline by NewestForm)",
        note: "Currently always rendered — NOT gated on the 'Packing' service type. Repeating pack-distribution rows; each row picks its own pack type.",
        fields: [
            {
                label: "Pack Distribution",
                type: "repeating",
                reveals: ["Each row: Pack Type (dropdown: Shrink Wrap / Banded / Other), Qty per Pack (number), Number of Packs (number)"],
            },
        ],
    },
]

function Field({ field }) {
    return (
        <li className="border-l-2 border-gray-200 pl-4 py-2">
            <div className="flex flex-wrap items-baseline gap-2">
                <span className="font-medium text-gray-900">{field.label}</span>
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-mono text-gray-600">
                    {field.type}
                </span>
                {(field.flags || []).map(flag => (
                    <span key={flag} className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                        {flag}
                    </span>
                ))}
            </div>

            {field.showWhen && (
                <p className="mt-1 text-sm text-indigo-700">
                    <span className="font-semibold">Shown when:</span> {field.showWhen}
                </p>
            )}
            {field.effect && (
                <p className="mt-1 text-sm text-emerald-700">
                    <span className="font-semibold">Effect:</span> {field.effect}
                </p>
            )}
            {field.note && (
                <p className="mt-1 text-sm text-gray-500">{field.note}</p>
            )}

            {field.options && (
                <div className="mt-1 text-sm text-gray-700">
                    <span className="font-semibold">Options:</span>
                    <ul className="ml-4 list-disc">
                        {field.options.map(option => (
                            <li key={option}>{option}</li>
                        ))}
                    </ul>
                </div>
            )}

            {field.reveals && (
                <div className="mt-1 text-sm text-gray-700">
                    <span className="font-semibold">Reveals when checked:</span>
                    <ul className="ml-4 list-disc">
                        {field.reveals.map(item => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}
        </li>
    )
}

function Section({ section, nested = false }) {
    return (
        <section className={nested ? "mt-4 rounded-md border border-gray-200 bg-gray-50 p-4" : "rounded-md border border-gray-300 bg-white p-5"}>
            <div className="flex flex-wrap items-baseline gap-2">
                <h2 className={nested ? "text-lg font-semibold text-gray-800" : "text-xl font-bold text-gray-900"}>
                    {section.section}
                </h2>
                {section.showWhen && (
                    <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs text-indigo-800">
                        section shown when: {section.showWhen}
                    </span>
                )}
            </div>
            {section.component && (
                <p className="mt-0.5 text-xs font-mono text-gray-400">src/{section.component}</p>
            )}
            {section.note && (
                <p className="mt-2 text-sm text-gray-600">{section.note}</p>
            )}

            <ul className="mt-3 space-y-1">
                {section.fields.map(field => (
                    <Field key={field.label} field={field} />
                ))}
            </ul>

            {(section.subSections || []).map(sub => (
                <Section key={sub.section} section={sub} nested />
            ))}
        </section>
    )
}

function FormOutline() {
    const questionCount = OUTLINE.reduce((total, section) => {
        const subCount = (section.subSections || []).reduce((sum, sub) => sum + sub.fields.length, 0)
        return total + section.fields.length + subCount
    }, 0)

    return (
        <div className="mx-auto max-w-3xl space-y-5">
            <header>
                <h1 className="text-2xl font-bold text-gray-900">Form Outline — testing reference</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Every question in NewestForm, its conditionals, and the options for each select /
                    checkbox group. {questionCount} questions across {OUTLINE.length} top-level sections.
                </p>
            </header>

            {OUTLINE.map(section => (
                <Section key={section.section} section={section} />
            ))}
        </div>
    )
}

export default FormOutline
