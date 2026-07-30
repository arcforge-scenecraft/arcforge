import { apiRequest } from "./apiClient";

export const getScenes = (projectId) => {
  return apiRequest(`/projects/${projectId}/scenes`);
};

export const getSceneById = (projectId, sceneId) => {
  return apiRequest(`/projects/${projectId}/scenes/${sceneId}`);
};

export const createScene = (projectId, sceneData) => {
  return apiRequest(`/projects/${projectId}/scenes`, {
    method: "POST",
    body: JSON.stringify(sceneData),
  });
};

export const updateScene = (projectId, sceneId, sceneData) => {
  return apiRequest(`/projects/${projectId}/scenes/${sceneId}`, {
    method: "PATCH",
    body: JSON.stringify(sceneData),
  });
};

export const deleteScene = (projectId, sceneId) => {
  return apiRequest(`/projects/${projectId}/scenes/${sceneId}`, {
    method: "DELETE",
  });
};
