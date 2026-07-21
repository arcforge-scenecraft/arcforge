import { pool } from "../config/database.js";

/**
 * Convert and validate a project ID from a route parameter.
 *
 * @param {string} projectId
 * @returns {number|null}
 */
const parseProjectId = (projectId) => {
  const parsedId = Number(projectId);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return null;
  }

  return parsedId;
};

/**
 * Validate an optional text field.
 *
 * The field may be:
 * - undefined when it was not provided
 * - null when the user wants to clear it
 * - a string
 *
 * @param {*} value
 * @returns {boolean}
 */
const isValidOptionalText = (value) => {
  return value === undefined || value === null || typeof value === "string";
};

/**
 * Normalize an optional text field.
 *
 * Empty strings become null.
 *
 * @param {string|null|undefined} value
 * @returns {string|null|undefined}
 */
const normalizeOptionalText = (value) => {
  if (value === undefined || value === null) {
    return value;
  }

  const trimmedValue = value.trim();

  return trimmedValue === "" ? null : trimmedValue;
};

// GET /api/projects
// Retrieve all projects
export const getProjects = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM story_projects
       ORDER BY id ASC`,
    );

    return res.status(200).json({
      success: true,
      message: "Projects retrieved successfully.",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error getting projects:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get projects.",
    });
  }
};

// GET /api/projects/:projectId
// Retrieve one project by ID
export const getProjectById = async (req, res) => {
  try {
    const projectId = parseProjectId(req.params.projectId);

    if (projectId === null) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID.",
      });
    }

    const result = await pool.query(
      `SELECT *
       FROM story_projects
       WHERE id = $1`,
      [projectId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project retrieved successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error getting project:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get project.",
    });
  }
};

// POST /api/projects
// Create a new project
export const createProject = async (req, res) => {
  try {
    const {
      title,
      description = "",
      genre = [],
      status = "Planning",
    } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Project title is required.",
      });
    }

    if (!Array.isArray(genre)) {
      return res.status(400).json({
        success: false,
        message: "Genre must be an array.",
      });
    }

    const cleanedGenres = genre
      .filter((value) => typeof value === "string")
      .map((value) => value.trim())
      .filter(Boolean);

    const result = await pool.query(
      `
        INSERT INTO story_projects (
          title,
          description,
          genre,
          status
        )
        VALUES ($1, $2, $3::TEXT[], $4)
        RETURNING *
      `,
      [title.trim(), description.trim() || null, cleanedGenres, status],
    );

    return res.status(201).json({
      success: true,
      message: "Project created successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating project:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create project.",
    });
  }
};

// PATCH /api/projects/:projectId
// Update an existing project
export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, genre, status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project title is required.",
      });
    }

    if (!Array.isArray(genre)) {
      return res.status(400).json({
        success: false,
        message: "Genre must be an array.",
      });
    }

    const result = await pool.query(
      `
        UPDATE story_projects
        SET
          title = $1,
          description = $2,
          genre = $3::TEXT[],
          status = $4,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        RETURNING *
      `,
      [title.trim(), description?.trim() || null, genre, status, projectId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating project:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update project.",
    });
  }
};

// DELETE /api/projects/:projectId
// Delete an existing project
export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await pool.query(
      `
        DELETE FROM story_projects
        WHERE id = $1
        RETURNING *
      `,
      [projectId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting project:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete project.",
    });
  }
};
