import { ApiError } from "../services/apiClient";

export const isNotFoundError = (error) => {
  return error instanceof ApiError && error.status === 404;
};

export const isAbortError = (error) => {
  return error instanceof Error && error.name === "AbortError";
};
