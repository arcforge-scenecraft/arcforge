import { apiRequest } from "./apiClient";

export const getProjects = (options = {}) => {
  return apiRequest("/projects", options);
};

export const getProjectById = (projectId, options = {}) => {
  return apiRequest(`/projects/${projectId}`, options);
};

export const createProject = (projectData, options = {}) => {
  return apiRequest("/projects", {
    method: "POST",
    body: projectData,
    ...options,
  });
};

export const updateProject = (projectId, projectData, options = {}) => {
  return apiRequest(`/projects/${projectId}`, {
    method: "PATCH",
    body: projectData,
    ...options,
  });
};

export const deleteProject = (projectId, options = {}) => {
  return apiRequest(`/projects/${projectId}`, {
    method: "DELETE",
    ...options,
  });
};
