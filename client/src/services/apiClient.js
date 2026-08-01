const PRODUCTION_API_URL = "https://arcforge-api.onrender.com";

export class ApiError extends Error {
  constructor(
    message,
    { status = 0, method = "GET", url = "", responseBody = null } = {},
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.method = method;
    this.url = url;
    this.responseBody = responseBody;
  }
}

const normalizeApiBaseUrl = (baseUrl) => {
  const normalizedBaseUrl = String(baseUrl ?? "")
    .trim()
    .replace(/\/+$/, "");

  if (!normalizedBaseUrl) {
    return "";
  }

  return normalizedBaseUrl.endsWith("/api")
    ? normalizedBaseUrl
    : `${normalizedBaseUrl}/api`;
};

const resolveApiBaseUrl = () => {
  const configuredApiBaseUrl = normalizeApiBaseUrl(
    import.meta.env.VITE_API_BASE_URL,
  );

  if (configuredApiBaseUrl) {
    return configuredApiBaseUrl;
  }

  // Vite forwards /api requests to localhost:3001 during development.
  if (import.meta.env.DEV) {
    return "/api";
  }

  // Production fallback in case the Render environment variable is missing.
  return normalizeApiBaseUrl(PRODUCTION_API_URL);
};

const API_BASE_URL = resolveApiBaseUrl();

const normalizeEndpoint = (endpoint) => {
  if (typeof endpoint !== "string") {
    throw new TypeError("The API endpoint must be a string.");
  }

  const normalizedEndpoint = endpoint.trim();

  if (!normalizedEndpoint) {
    throw new Error("A valid API endpoint is required.");
  }

  return normalizedEndpoint.startsWith("/")
    ? normalizedEndpoint
    : `/${normalizedEndpoint}`;
};

const parseResponseBody = async (response) => {
  if (response.status === 204 || response.status === 205) {
    return null;
  }

  const responseText = await response.text();

  if (!responseText) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(responseText);
    } catch {
      throw new Error("The API returned an invalid JSON response.");
    }
  }

  return responseText;
};

const getErrorMessage = (responseBody, status) => {
  if (typeof responseBody === "string" && responseBody.trim()) {
    return responseBody;
  }

  if (responseBody && typeof responseBody === "object") {
    return (
      responseBody.message ||
      responseBody.error ||
      `API request failed with status ${status}.`
    );
  }

  return `API request failed with status ${status}.`;
};

export const apiRequest = async (endpoint, options = {}) => {
  const normalizedEndpoint = normalizeEndpoint(endpoint);
  const url = `${API_BASE_URL}${normalizedEndpoint}`;

  const {
    headers: customHeaders = {},
    body,
    method = "GET",
    ...customConfig
  } = options;

  const headers = new Headers(customHeaders);
  headers.set("Accept", "application/json");

  let requestBody = body;

  if (body !== undefined && body !== null) {
    const isFormData =
      typeof FormData !== "undefined" && body instanceof FormData;

    const isUrlSearchParams =
      typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams;

    if (!isFormData && !isUrlSearchParams) {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }

      requestBody = typeof body === "string" ? body : JSON.stringify(body);
    }
  }

  const config = {
    ...customConfig,
    method: String(method).toUpperCase(),
    headers,
  };

  if (requestBody !== undefined && requestBody !== null) {
    config.body = requestBody;
  }

  try {
    const response = await fetch(url, config);
    const responseBody = await parseResponseBody(response);

    if (!response.ok || responseBody?.success === false) {
      throw new ApiError(getErrorMessage(responseBody, response.status), {
        status: response.status,
        method: config.method,
        url,
        responseBody,
      });
    }

    if (
      responseBody !== null &&
      typeof responseBody === "object" &&
      responseBody.data !== undefined
    ) {
      return responseBody.data;
    }

    return responseBody;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }

    const normalizedError =
      error instanceof Error ? error : new Error(String(error));

    const status =
      normalizedError instanceof ApiError ? normalizedError.status : 0;

    const shouldLog = import.meta.env.DEV && (status === 0 || status >= 500);

    if (shouldLog) {
      console.error("[API Error]", {
        method: config.method,
        url,
        status,
        message: normalizedError.message,
      });
    }

    throw normalizedError;
  }
};
