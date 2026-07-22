import { apiRequest } from "./apiClient";

export const getProjects = () => {
  return apiRequest("/api/projects");
};

export const getProjectById = (projectId, options = {}) => {
  return apiRequest(`/api/projects/${projectId}`, options);
};

export const createProject = (projectData) => {
  return apiRequest("/api/projects", {
    method: "POST",
    body: JSON.stringify(projectData),
  });
};

export const updateProject = (projectId, projectData) => {
  return apiRequest(`/api/projects/${projectId}`, {
    method: "PATCH",
    body: JSON.stringify(projectData),
  });
};

export const deleteProject = (projectId) => {
  return apiRequest(`/api/projects/${projectId}`, {
    method: "DELETE",
  });
};
