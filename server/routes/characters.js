import express from "express";
import { pool } from "../config/database.js";

const router = express.Router({ mergeParams: true });

const isValidId = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

// GET /api/projects/:projectId/characters
// Retrieves all characters for a project
router.get("/", async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!isValidId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Project id is required.",
      });
    }

    const result = await pool.query(
      `SELECT *
       FROM characters
       WHERE project_id = $1
       ORDER BY id ASC`,
      [projectId],
    );

    return res.status(200).json({
      success: true,
      message: "Characters retrieved successfully.",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error getting characters:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get characters.",
    });
  }
});

// GET /api/projects/:projectId/characters/:characterId
// Retrieve a character by id
router.get("/:characterId", async (req, res) => {
  try {
    const { projectId, characterId } = req.params;

    if (!isValidId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Project id is required.",
      });
    }

    if (!isValidId(characterId)) {
      return res.status(400).json({
        success: false,
        message: "Character id is required.",
      });
    }

    const result = await pool.query(
      `SELECT *
       FROM characters
       WHERE id = $1
         AND project_id = $2`,
      [characterId, projectId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Character not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Character retrieved successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error getting character:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get character.",
    });
  }
});

// POST /api/projects/:projectId/characters
// Create a new character
router.post("/", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, story_role, description, goal, knowledge_notes } = req.body;

    if (!isValidId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Project id is required.",
      });
    }

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Character name is required.",
      });
    }

    const result = await pool.query(
      `INSERT INTO characters
        (project_id, name, story_role, description, goal, knowledge_notes)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        projectId,
        name.trim(),
        story_role || null,
        description || null,
        goal || null,
        knowledge_notes || null,
      ],
    );

    return res.status(201).json({
      success: true,
      message: "Character created successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating character:", error);

    if (error.code === "23503") {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create character.",
    });
  }
});

// PATCH /api/projects/:projectId/characters/:characterId
// Update an existing character
router.patch("/:characterId", async (req, res) => {
  try {
    const { projectId, characterId } = req.params;
    const { name, story_role, description, goal, knowledge_notes } = req.body;

    if (!isValidId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Project id is required.",
      });
    }

    if (!isValidId(characterId)) {
      return res.status(400).json({
        success: false,
        message: "Character id is required.",
      });
    }

    if (name !== undefined && name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Character name cannot be empty.",
      });
    }

    const result = await pool.query(
      `UPDATE characters
       SET
         name = COALESCE($1, name),
         story_role = COALESCE($2, story_role),
         description = COALESCE($3, description),
         goal = COALESCE($4, goal),
         knowledge_notes = COALESCE($5, knowledge_notes),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
         AND project_id = $7
       RETURNING *`,
      [
        name !== undefined ? name.trim() : null,
        story_role !== undefined ? story_role : null,
        description !== undefined ? description : null,
        goal !== undefined ? goal : null,
        knowledge_notes !== undefined ? knowledge_notes : null,
        characterId,
        projectId,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Character not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Character updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating character:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update character.",
    });
  }
});

// DELETE /api/projects/:projectId/characters/:characterId
// Delete an existing character
router.delete("/:characterId", async (req, res) => {
  try {
    const { projectId, characterId } = req.params;

    if (!isValidId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Project id is required.",
      });
    }

    if (!isValidId(characterId)) {
      return res.status(400).json({
        success: false,
        message: "Character id is required.",
      });
    }

    const result = await pool.query(
      `DELETE FROM characters
       WHERE id = $1
         AND project_id = $2
       RETURNING *`,
      [characterId, projectId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Character not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Character deleted successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting character:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete character.",
    });
  }
});

export default router;
