// Shared conditional-visibility logic for config-driven fields.
//
// A field is hidden unless its `showwhen` matches current form data. Shapes:
//
//   showwhen: { field: "job_type", value: "Reprint – No Changes" }
//       -> show when formData.job_type === "Reprint – No Changes"
//
//   showwhen: { field: "job_type", value: ["Reprint – With Changes", "Quote Update"] }
//       -> show when job_type is EITHER value (OR on one field)
//
//   showwhen: [
//       { field: "job_type", value: "Reprint – With Changes" },
//       { field: "version_type", value: "job" }
//   ]
//       -> show when ANY condition matches (OR across different fields)

function matchesCondition(cond, formData) {

    if (!cond || !cond.field) {
        return true
    }

    const actual = formData[cond.field]

    const accepted = []
    if (Array.isArray(cond.value)) {
        accepted.push(...cond.value)
    } else if ("value" in cond) {
        accepted.push(cond.value)
    }
    if ("checked" in cond) {
        accepted.push(cond.checked)
    }

    return accepted.some(v => actual === v)
}


export function shouldShow(field, formData) {

    if (!field || !field.showwhen) {
        return true
    }

    const conditions = Array.isArray(field.showwhen)
        ? field.showwhen
        : [field.showwhen]

    return conditions.some(
        cond => matchesCondition(cond, formData)
    )
}


export function getVisibleFields(fields, formData) {

    return (fields || []).filter(
        field => shouldShow(field, formData)
    )
}
