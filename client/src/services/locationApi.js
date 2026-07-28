import { apiRequest } from "./apiClient";

export const getLocations = (projectId, options = {}) => {
  return apiRequest(`/projects/${projectId}/locations`, options);
};

export const getLocation = (projectId, locationId, options = {}) => {
  return apiRequest(`/projects/${projectId}/locations/${locationId}`, options);
};

export const createLocation = (projectId, locationData, options = {}) => {
  return apiRequest(`/projects/${projectId}/locations`, {
    ...options,
    method: "POST",
    body: locationData,
  });
};

export const updateLocation = (
  projectId,
  locationId,
  locationData,
  options = {},
) => {
  return apiRequest(`/projects/${projectId}/locations/${locationId}`, {
    ...options,
    method: "PATCH",
    body: locationData,
  });
};

export const deleteLocation = (projectId, locationId, options = {}) => {
  return apiRequest(`/projects/${projectId}/locations/${locationId}`, {
    ...options,
    method: "DELETE",
  });
};
