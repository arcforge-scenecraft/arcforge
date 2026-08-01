import { apiRequest } from "./apiClient";

export const getScenes = (projectId, options = {}) => {
  return apiRequest(`/projects/${projectId}/scenes`, options);
};

export const getSceneById = (projectId, sceneId, options = {}) => {
  return apiRequest(`/projects/${projectId}/scenes/${sceneId}`, options);
};

export const createScene = (projectId, sceneData, options = {}) => {
  return apiRequest(`/projects/${projectId}/scenes`, {
    ...options,
    method: "POST",
    body: JSON.stringify(sceneData),
  });
};

export const updateScene = (projectId, sceneId, sceneData, options = {}) => {
  return apiRequest(`/projects/${projectId}/scenes/${sceneId}`, {
    ...options,
    method: "PATCH",
    body: JSON.stringify(sceneData),
  });
};

export const deleteScene = (projectId, sceneId, options = {}) => {
  return apiRequest(`/projects/${projectId}/scenes/${sceneId}`, {
    ...options,
    method: "DELETE",
  });
};
