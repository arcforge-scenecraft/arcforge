import express from "express";
import { pool } from "../config/database.js";

const router = express.Router();

// GET /api/projects/
// Retrieves all projects
router.get("/", async (req, res) => {
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
});

// GET /api/projects/:projectId
// Retrieve a project by id
router.get("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await pool.query(
      `SELECT *
       FROM story_projects
       WHERE id = $1`,
      [projectId],
    );

    // Project does not exist
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
});

// POST /api/projects
// Create a new project
router.post("/", async (req, res) => {
  try {
    const { title, description, genre, status } = req.body;

    // Validate required fields
    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Project title is required.",
      });
    }

    const result = await pool.query(
      `INSERT INTO story_projects
        (title, description, genre, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title.trim(), description || null, genre || null, status || null],
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
});

// PATCH /api/projects/:projectId
// Update an existing project
router.patch("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, genre, status } = req.body;

    // If title is provided, it cannot be empty
    if (title !== undefined && title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Project title cannot be empty.",
      });
    }

    const result = await pool.query(
      `UPDATE story_projects
       SET
         title = COALESCE($1, title),
         description = COALESCE($2, description),
         genre = COALESCE($3, genre),
         status = COALESCE($4, status),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [
        title !== undefined ? title.trim() : null,
        description !== undefined ? description : null,
        genre !== undefined ? genre : null,
        status !== undefined ? status : null,
        projectId,
      ],
    );

    // Project does not exist
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
});

// DELETE /api/projects/:projectId
// Delete an existing project
router.delete("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await pool.query(
      `DELETE FROM story_projects
       WHERE id = $1
       RETURNING *`,
      [projectId],
    );

    // Project does not exist
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
});

export default router;
