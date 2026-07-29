import { apiRequest } from "./apiClient";

export const getScenes = (projectId) => {
  return apiRequest(`/api/projects/${projectId}/scenes`);
};

export const getSceneById = (projectId, sceneId) => {
  return apiRequest(`/api/projects/${projectId}/scenes/${sceneId}`);
};

export const createScene = (projectId, sceneData) => {
  return apiRequest(`/api/projects/${projectId}/scenes`, {
    method: "POST",
    body: JSON.stringify(sceneData),
  });
};

export const updateScene = (projectId, sceneId, sceneData) => {
  return apiRequest(`/api/projects/${projectId}/scenes/${sceneId}`, {
    method: "PATCH",
    body: JSON.stringify(sceneData),
  });
};

export const deleteScene = (projectId, sceneId) => {
  return apiRequest(`/api/projects/${projectId}/scenes/${sceneId}`, {
    method: "DELETE",
  });
};
