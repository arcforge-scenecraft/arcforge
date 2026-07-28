import { apiRequest } from "./apiClient";

export const getProjects = (options = {}) => {
  return apiRequest("/projects", options);
};

export const getProjectById = (projectId, options = {}) => {
  return apiRequest(`/projects/${projectId}`, options);
};

export const createProject = (projectData, options = {}) => {
  return apiRequest("/projects", {
    ...options,
    method: "POST",
    body: projectData,
  });
};

export const updateProject = (projectId, projectData, options = {}) => {
  return apiRequest(`/projects/${projectId}`, {
    ...options,
    method: "PATCH",
    body: projectData,
  });
};

export const deleteProject = (projectId, options = {}) => {
  return apiRequest(`/projects/${projectId}`, {
    ...options,
    method: "DELETE",
  });
};
