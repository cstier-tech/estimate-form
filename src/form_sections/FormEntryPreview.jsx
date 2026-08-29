// Live preview of the whole form — mirrors the `formData` object that
// testingHandleSubmit logs to the console in NewestForm.jsx.
//
// Every field always renders its label. Empty values show "—", everything
// else shows the value. Arrays and nested objects are expanded recursively.

// Friendly labels for known keys; anything not listed falls back to humanize().
const LABELS = {
    // overview
    clientName: "Customer",
    customerNumber: "Customer #",
    projName: "Job Name",
    projDesc: "Description",
    dueDate: "Desired Due Date",
    salesRep: "Sales Rep",
    jobType: "Job Type",
    prevJobNo: "Previous Job #",
    prevEstNo: "Previous Estimate #",
    additionalComments: "Additional Comments",
    // top-level groups
    qtysToQuote: "Quantities to Quote",
    kitsCount: "Kits per Quantity Level",
    serviceTypes: "Service Types",
    components: "Components",
    kits: "Kits",
    mailing: "Mailing",
    packDistribution: "Pack Distribution",
    // component fields
    componentKey: "Component Key",
    Component: "Component",
    Size: "Size",
    FlatSize: "Flat Size",
    Stock: "Stock",
    Coating: "Coating",
    quantities: "Quantities",
    saved: "Saved",
    finishingOps: "Finishing Ops",
    SameQty: "Same Qty",
    // kit fields
    Kit: "Kit",
    OverageAction: "Overage Action",
    source: "Source",
    componentId: "Component ID",
    // mailing fields
    classOfMail: "Class of Mail",
    indicia: "Indicia",
    paymentMethod: "Payment Method",
    permitType: "Permit Type",
    nonprofitAuth: "Nonprofit Auth",
    mailingFrom: "Mailing From",
    permitOwner: "Permit Owner",
    exactCompanyName: "Exact Company Name",
    exactCompanyAddress: "Exact Company Address",
    // finishing / packing op fields
    value: "Type",
    details: "Details",
    id: "ID",
}

// "customerNumber" -> "Customer Number", "prev_est_no" -> "Prev Est No"
function humanize(key) {
    return String(key)
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase())
}

const labelFor = (key) => LABELS[key] || humanize(key)

// "Components" -> "Component", "Quantities" -> "Quantity"
function singular(label) {
    if (label.endsWith("ies")) return label.slice(0, -3) + "y"
    if (label.endsWith("s")) return label.slice(0, -1)
    return label
}

function formatPrimitive(value) {
    if (value === null || value === undefined || value === "") return "—"
    if (typeof value === "boolean") return value ? "Yes" : "No"
    return String(value)
}

function Entry({ label, value }) {
    // Primitive
    if (value === null || value === undefined || typeof value !== "object") {
        return (
            <div>
                <span className="font-semibold text-gray-700">{label}:</span> {formatPrimitive(value)}
            </div>
        )
    }

    const children = Array.isArray(value)
        ? value.map((item, i) => [`${singular(label)} ${i + 1}`, item])
        : Object.entries(value).map(([key, val]) => [labelFor(key), val])

    // Empty array / object
    if (children.length === 0) {
        return (
            <div>
                <span className="font-semibold text-gray-700">{label}:</span> —
            </div>
        )
    }

    return (
        <div>
            <span className="font-semibold text-gray-700">{label}:</span>
            <div className="ml-3 mt-1 flex flex-col gap-1 border-l border-gray-200 pl-3">
                {children.map(([childLabel, childValue], i) => (
                    <Entry key={i} label={childLabel} value={childValue} />
                ))}
            </div>
        </div>
    )
}

function FormEntryPreview({ user, data = {} }) {
    return (
        <div>
            <div className="mb-4 flex flex-col gap-y-1 rounded-md border border-gray-200 bg-white p-3 text-sm">
                <Entry label="User" value={user} />
                {Object.entries(data).map(([key, value]) => (
                    <Entry key={key} label={labelFor(key)} value={value} />
                ))}
            </div>
        </div>
    )
}

export default FormEntryPreview
