const API_BASE = "/api";

export const apiRequest = async (endpoint, options = {}) => {
  const { headers: customHeaders, body, ...customConfig } = options;

  const config = {
    method: "GET",
    ...customConfig,
    headers: {
      "Content-Type": "application/json",
      ...customHeaders,
    },
  };

  if (body !== undefined && body !== null) {
    // Stringify body if an object is passed
    config.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);

    // Safely handle 204 No Content or empty responses
    const json = await response.json().catch(() => ({}));

    // Handle standard HTTP errors or backend boolean flags
    if (!response.ok || json.success === false) {
      throw new Error(json.message || `HTTP Error: ${response.status}`);
    }

    // Unwrap data payload if present, otherwise return full json
    return json.data !== undefined ? json.data : json;
  } catch (error) {
    // Re-throw AbortError so calling components can ignore unmount cancellations
    if (error.name === "AbortError" || error.message?.includes("aborted")) {
      throw error;
    }

    console.error(`[API Error] ${config.method || "GET"} ${endpoint}:`, error.message);
    throw error;
  }
};
