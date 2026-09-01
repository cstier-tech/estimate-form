// Shared conditional-visibility logic for config-driven fields.
//
// A field is hidden unless its `showwhen` condition matches current form data:
//   showwhen: { field: "job_type", value: "Reprint – No Changes" }

export function shouldShow(field, formData) {

    if (!field || !field.showwhen) {
        return true
    }

    return (
        formData[field.showwhen.field] ===
        field.showwhen.value
    )
}


export function getVisibleFields(fields, formData) {

    return (fields || []).filter(
        field => shouldShow(field, formData)
    )
}
