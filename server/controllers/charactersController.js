import { pool } from "../config/database.js";

const isValidId = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

const projectExists = async (projectId, db = pool) => {
  const result = await db.query(
    `SELECT id
     FROM story_projects
     WHERE id = $1`,
    [projectId],
  );

  return result.rows.length > 0;
};

// GET /api/projects/:projectId/characters
export const getCharacters = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!isValidId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Project id is required.",
      });
    }

    const exists = await projectExists(projectId);

    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
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
};

// GET /api/projects/:projectId/characters/:characterId
export const getCharacterById = async (req, res) => {
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

    const exists = await projectExists(projectId);

    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
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
};

// POST /api/projects/:projectId/characters
export const createCharacter = async (req, res) => {
  try {
    const { projectId } = req.params;

    const { name, story_role, description, goal, knowledge_notes } = req.body;

    if (!isValidId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Project id is required.",
      });
    }

    if (typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Character name is required.",
      });
    }

    const exists = await projectExists(projectId);

    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const result = await pool.query(
      `INSERT INTO characters
        (
          project_id,
          name,
          story_role,
          description,
          goal,
          knowledge_notes
        )
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        projectId,
        name.trim(),
        story_role ?? null,
        description ?? null,
        goal ?? null,
        knowledge_notes ?? null,
      ],
    );

    return res.status(201).json({
      success: true,
      message: "Character created successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating character:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create character.",
    });
  }
};

// PATCH /api/projects/:projectId/characters/:characterId
export const updateCharacter = async (req, res) => {
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

    const exists = await projectExists(projectId);

    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const { name, story_role, description, goal, knowledge_notes } = req.body;

    if (
      name !== undefined &&
      (typeof name !== "string" || name.trim() === "")
    ) {
      return res.status(400).json({
        success: false,
        message: "Character name cannot be empty.",
      });
    }

    const allowedFields = {
      name: name !== undefined ? name.trim() : undefined,
      story_role,
      description,
      goal,
      knowledge_notes,
    };

    const updates = [];
    const values = [];

    for (const [field, value] of Object.entries(allowedFields)) {
      if (value !== undefined) {
        values.push(value);
        updates.push(`${field} = $${values.length}`);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid character fields provided.",
      });
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");

    values.push(characterId);
    const characterIdIndex = values.length;

    values.push(projectId);
    const projectIdIndex = values.length;

    const result = await pool.query(
      `UPDATE characters
       SET ${updates.join(", ")}
       WHERE id = $${characterIdIndex}
         AND project_id = $${projectIdIndex}
       RETURNING *`,
      values,
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
};

// DELETE /api/projects/:projectId/characters/:characterId
export const deleteCharacter = async (req, res) => {
  let client;

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

    client = await pool.connect();

    await client.query("BEGIN");

    const exists = await projectExists(projectId, client);

    if (!exists) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const characterResult = await client.query(
      `SELECT *
       FROM characters
       WHERE id = $1
         AND project_id = $2`,
      [characterId, projectId],
    );

    if (characterResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        success: false,
        message: "Character not found.",
      });
    }

    // Remove scene assignments for this character
    await client.query(
      `DELETE FROM scene_characters
       WHERE character_id = $1`,
      [characterId],
    );

    // Remove relationships where this character appears
    await client.query(
      `DELETE FROM character_relationships
       WHERE character_id = $1
          OR related_character_id = $1`,
      [characterId],
    );

    const deleteResult = await client.query(
      `DELETE FROM characters
       WHERE id = $1
         AND project_id = $2
       RETURNING *`,
      [characterId, projectId],
    );

    await client.query("COMMIT");

    return res.status(200).json({
      success: true,
      message: "Character deleted successfully.",
      data: deleteResult.rows[0],
    });
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK");
    }

    console.error("Error deleting character:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete character.",
    });
  } finally {
    if (client) {
      client.release();
    }
  }
};
