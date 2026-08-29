// service_types is stored as JSON but may come back as a raw string or
// something unexpected, so this always normalizes it to an array.
export function parseServiceTypes(raw) {
    let services = raw || []

    if (typeof services === "string") {
        try {
            services = JSON.parse(services)
        } catch {
            services = []
        }
    }

    return Array.isArray(services) ? services : []
}
