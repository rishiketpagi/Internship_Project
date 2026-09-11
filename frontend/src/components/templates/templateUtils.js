export function getText(value) {
    if (!value) return "";
    if (typeof value === "string") return value;
    return [value.name, value.issuer, value.description]
        .filter(Boolean)
        .join(" - ");
}

export function getDateRange(entry) {
    return [entry.startDate, entry.endDate].filter(Boolean).join(" - ");
}
