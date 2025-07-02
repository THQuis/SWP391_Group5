const API_BASE = process.env.REACT_APP_API_URL;

export default function apiFetch(endpoint, options = {}) {
    // Đảm bảo endpoint không bị double slash
    let url = endpoint.startsWith("/")
        ? `${API_BASE}${endpoint}`
        : `${API_BASE}/${endpoint}`;
    return fetch(url, options);
}