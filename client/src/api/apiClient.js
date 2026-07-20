// We can use a relative path because of your Vite proxy and production build setup!
const API_BASE = '/api';

async function request(endpoint, { method = 'GET', body, ...customConfig } = {}) {
    const headers = { 'Content-Type': 'application/json' };

    const config = {
        method,
        ...customConfig,
        headers: { ...headers, ...customConfig.headers },
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, config);

        // Attempt to parse JSON. If it's a 204 No Content, this might fail, so we catch it.
        const json = await response.json().catch(() => ({}));

        // Your backend explicitly uses `success: true/false`
        if (!response.ok || json.success === false) {
            // Throw the exact error message your Express backend sends
            throw new Error(json.message || `HTTP Error: ${response.status}`);
        }

        // Your backend wraps responses in a `data` object, so we unwrap it here
        return json.data;

    } catch (error) {
        // Inside your apiClient.js catch block:
        if (error.name === "AbortError" || error.message.includes("aborted")) {
            // Silently ignore intentional React unmount cancellations
            return null;
        }

        // Otherwise, log real errors
        console.error(`[API Error] GET ${endpoint}:`, error.message);
    }
}

// Export clean, semantic methods
export const api = {
    // Add `customConfig` here to support things like AbortController signals
    get: (endpoint, customConfig) => request(endpoint, { ...customConfig }),
    post: (endpoint, body, customConfig) => request(endpoint, { method: 'POST', body, ...customConfig }),
    patch: (endpoint, body, customConfig) => request(endpoint, { method: 'PATCH', body, ...customConfig }),
    delete: (endpoint, customConfig) => request(endpoint, { method: 'DELETE', ...customConfig }),
};