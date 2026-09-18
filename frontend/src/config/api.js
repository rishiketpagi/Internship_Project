// Single source of truth for the backend URL.
//
// In dev: leave VITE_API_BASE_URL unset → defaults to http://localhost:5000.
// In prod: set VITE_API_BASE_URL="" (same-origin, served by Vercel) or to the
// backend's deployed URL if it lives on a different domain.
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export function apiUrl(path) {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    if (!BASE_URL) return normalized;
    return `${BASE_URL.replace(/\/$/, "")}${normalized}`;
}
