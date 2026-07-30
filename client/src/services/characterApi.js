import { apiRequest } from "./apiClient";

export const getCharacters = (projectId, options = {}) => {
  return apiRequest(`/projects/${projectId}/characters`, options);
};

export const getCharacter = (projectId, characterId, options = {}) => {
  return apiRequest(
    `/projects/${projectId}/characters/${characterId}`,
    options,
  );
};

export const createCharacter = (projectId, characterData, options = {}) => {
  return apiRequest(`/projects/${projectId}/characters`, {
    ...options,
    method: "POST",
    body: characterData,
  });
};

export const updateCharacter = (
  projectId,
  characterId,
  characterData,
  options = {},
) => {
  return apiRequest(`/projects/${projectId}/characters/${characterId}`, {
    ...options,
    method: "PATCH",
    body: characterData,
  });
};

export const deleteCharacter = (projectId, characterId, options = {}) => {
  return apiRequest(`/projects/${projectId}/characters/${characterId}`, {
    ...options,
export const getCharacters = (projectId) => {
  return apiRequest(`/projects/${projectId}/characters`);
};

export const getCharacterById = (projectId, characterId) => {
  return apiRequest(`/projects/${projectId}/characters/${characterId}`);
};

export const createCharacter = (projectId, characterData) => {
  return apiRequest(`/projects/${projectId}/characters`, {
    method: "POST",
    body: JSON.stringify(characterData),
  });
};

export const updateCharacter = (projectId, characterId, characterData) => {
  return apiRequest(`/projects/${projectId}/characters/${characterId}`, {
    method: "PATCH",
    body: JSON.stringify(characterData),
  });
};

export const deleteCharacter = (projectId, characterId) => {
  return apiRequest(`/projects/${projectId}/characters/${characterId}`, {
    method: "DELETE",
  });
};
