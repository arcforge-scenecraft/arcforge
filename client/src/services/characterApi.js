import { apiRequest } from "./apiClient";

export const getCharacters = (projectId) => {
  return apiRequest(`/api/projects/${projectId}/characters`);
};

export const getCharacterById = (projectId, characterId) => {
  return apiRequest(`/api/projects/${projectId}/characters/${characterId}`);
};

export const createCharacter = (projectId, characterData) => {
  return apiRequest(`/api/projects/${projectId}/characters`, {
    method: "POST",
    body: JSON.stringify(characterData),
  });
};

export const updateCharacter = (projectId, characterId, characterData) => {
  return apiRequest(`/api/projects/${projectId}/characters/${characterId}`, {
    method: "PATCH",
    body: JSON.stringify(characterData),
  });
};

export const deleteCharacter = (projectId, characterId) => {
  return apiRequest(`/api/projects/${projectId}/characters/${characterId}`, {
    method: "DELETE",
  });
};
