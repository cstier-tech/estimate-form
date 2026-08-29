// Conversions between the form's string-array quantity state and DB row shapes.

// Rows like [{ quantity }] -> ["12", "34"], defaulting to a single blank input
export function toQtyStrings(rows) {
    return rows.length > 0 ? rows.map(row => String(row.quantity)) : [""]
}

// Blank-filtered quantity strings -> DB insert rows for the given foreign key
export function toQtyRows(qtys, idKey, idValue) {
    return qtys
        .filter(qty => qty !== "" && qty !== null)
        .map(qty => ({ [idKey]: idValue, quantity: Number(qty) }))
}

export function toNumbers(qtys) {
    return qtys.filter(qty => qty !== "" && qty !== null).map(Number)
}
