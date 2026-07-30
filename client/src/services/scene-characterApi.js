import { apiRequest } from "./apiClient";

export const getSceneCharacters = (projectId, sceneId) => {
  return apiRequest(`/projects/${projectId}/scenes/${sceneId}/scene-characters`);
};

export const getSceneCharacterById = (projectId, sceneId, characterId) => {
  return apiRequest(`/projects/${projectId}/scenes/${sceneId}/scene-characters/${characterId}`);
};

export const assignCharacterToScene = (projectId, sceneId, characterData) => {
  return apiRequest(`/projects/${projectId}/scenes/${sceneId}/scene-characters`, {
    method: "POST",
    body: JSON.stringify(characterData),
  });
};

export const updateSceneCharacter = (projectId, sceneId, characterId, characterData) => {
  return apiRequest(`/projects/${projectId}/scenes/${sceneId}/scene-characters/${characterId}`, {
    method: "PATCH",
    body: JSON.stringify(characterData),
  });
};

export const deleteSceneCharacter = (projectId, sceneId, characterId) => {
  return apiRequest(`/projects/${projectId}/scenes/${sceneId}/scene-characters/${characterId}`, {
    method: "DELETE",
  });
};
