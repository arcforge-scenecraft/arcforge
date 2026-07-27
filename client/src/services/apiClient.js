const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export const apiRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const contentType = response.headers.get("content-type");
  const responseBody = contentType?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    throw new Error(responseBody?.message || "API request failed.");
  }

  return responseBody?.data ?? null;
};
