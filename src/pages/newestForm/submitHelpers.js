// Shared error reporting and Supabase insert helpers used while submitting the form.
import { supabase } from "../../lib/supabaseClient"

export function fail(action, error) {
    console.error(`Error ${action}:`, error)
    alert(`Error ${action}: ${error.message}`)
}

export async function insertOne(table, payload) {
    return supabase.from(table).insert(payload).select().single()
}

export async function insertMany(table, rows) {
    return rows.length > 0 ? supabase.from(table).insert(rows) : { error: null }
}
