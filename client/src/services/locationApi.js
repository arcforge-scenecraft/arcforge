import { apiRequest } from "./apiClient";

export const getLocations = (projectId) => {
  return apiRequest(`/api/projects/${projectId}/locations`);
};

export const getLocation = (projectId, locationId) => {
  return apiRequest(`/api/projects/${projectId}/locations/${locationId}`);
};
