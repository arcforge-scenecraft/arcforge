import { apiRequest } from "./apiClient";

export const getLocations = (projectId) => {
  return apiRequest(`/projects/${projectId}/locations`);
};

export const getLocation = (projectId, locationId) => {
  return apiRequest(`/projects/${projectId}/locations/${locationId}`);
};

export const createLocation = (projectId, locationData) => {
  return apiRequest(`/projects/${projectId}/locations`, {
    method: "POST",
    body: JSON.stringify(locationData),
  });
};

export const updateLocation = (projectId, locationId, locationData) => {
  return apiRequest(`/projects/${projectId}/locations/${locationId}`, {
    method: "PATCH",
    body: JSON.stringify(locationData),
  });
};

export const deleteLocation = (projectId, locationId) => {
  return apiRequest(`/projects/${projectId}/locations/${locationId}`, {
    method: "DELETE",
  });
};
