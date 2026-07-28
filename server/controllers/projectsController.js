import { pool } from "../config/database.js";

const VALID_STATUSES = new Set([
  "Planning",
  "In Progress",
  "On Hold",
  "Completed",
]);

const parseProjectId = (value) => {
  const projectId = Number(value);

  return Number.isInteger(projectId) && projectId > 0 ? projectId : null;
};

const normalizeRequiredText = (value) => {
  return typeof value === "string" ? value.trim() : "";
};

const normalizeOptionalText = (value) => {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue || null;
};

const normalizeGenres = (value) => {
  if (!Array.isArray(value)) {
    return null;
  }

  return [
    ...new Set(
      value
        .filter((genre) => typeof genre === "string")
        .map((genre) => genre.trim())
        .filter(Boolean),
    ),
  ];
};

const normalizeStatus = (value) => {
  return VALID_STATUSES.has(value) ? value : null;
};

// GET /api/projects
export const getProjects = async (_req, res) => {
  try {
    const result = await pool.query(
      `
        SELECT *
        FROM story_projects
        ORDER BY id ASC
      `,
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
      `
        SELECT *
        FROM story_projects
        WHERE id = $1
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
export const createProject = async (req, res) => {
  try {
    const title = normalizeRequiredText(req.body?.title);
    const description = normalizeOptionalText(req.body?.description);
    const genre = normalizeGenres(req.body?.genre ?? []);
    const status = normalizeStatus(req.body?.status ?? "Planning");

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Project title is required.",
      });
    }

    if (title.length > 255) {
      return res.status(400).json({
        success: false,
        message: "Project title must be 255 characters or fewer.",
      });
    }

    if (genre === null) {
      return res.status(400).json({
        success: false,
        message: "Genre must be an array.",
      });
    }

    if (status === null) {
      return res.status(400).json({
        success: false,
        message: "Invalid project status.",
      });
    }

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
      [title, description, genre, status],
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
export const updateProject = async (req, res) => {
  try {
    const projectId = parseProjectId(req.params.projectId);

    if (projectId === null) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID.",
      });
    }

    const title = normalizeRequiredText(req.body?.title);
    const description = normalizeOptionalText(req.body?.description);
    const genre = normalizeGenres(req.body?.genre);
    const status = normalizeStatus(req.body?.status);

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Project title is required.",
      });
    }

    if (title.length > 255) {
      return res.status(400).json({
        success: false,
        message: "Project title must be 255 characters or fewer.",
      });
    }

    if (genre === null) {
      return res.status(400).json({
        success: false,
        message: "Genre must be an array.",
      });
    }

    if (status === null) {
      return res.status(400).json({
        success: false,
        message: "Invalid project status.",
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
      [title, description, genre, status, projectId],
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
export const deleteProject = async (req, res) => {
  try {
    const projectId = parseProjectId(req.params.projectId);

    if (projectId === null) {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID.",
      });
    }

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
