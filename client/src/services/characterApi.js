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
    method: "DELETE",
  });
};
