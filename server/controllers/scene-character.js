import { pool } from "../config/database.js";

const isValidId = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

const isValidOptionalText = (value) => {
  return value === undefined || value === null || typeof value === "string";
};

const normalizeOptionalText = (value) => {
  if (value === undefined || value === null) {
    return value;
  }

  const trimmedValue = value.trim();

  return trimmedValue === "" ? null : trimmedValue;
};

const projectExists = async (projectId, db = pool) => {
  const result = await db.query(
    `SELECT id
     FROM story_projects
     WHERE id = $1`,
    [projectId],
  );

  return result.rows.length > 0;
};

const sceneBelongsToProject = async (projectId, sceneId, db = pool) => {
  const result = await db.query(
    `SELECT id
     FROM scenes
     WHERE id = $1
       AND project_id = $2`,
    [sceneId, projectId],
  );

  return result.rows.length > 0;
};

const characterBelongsToProject = async (projectId, characterId, db = pool) => {
  const result = await db.query(
    `SELECT id
     FROM characters
     WHERE id = $1
       AND project_id = $2`,
    [characterId, projectId],
  );

  return result.rows.length > 0;
};

const assignmentExists = async (sceneId, characterId, db = pool) => {
  const result = await db.query(
    `SELECT scene_id, character_id
     FROM scene_characters
     WHERE scene_id = $1
       AND character_id = $2`,
    [sceneId, characterId],
  );

  return result.rows.length > 0;
};

const validateProjectAndScene = async (projectId, sceneId, db = pool) => {
  if (!isValidId(projectId)) {
    return {
      status: 400,
      body: {
        success: false,
        message: "Project id is required.",
      },
    };
  }

  if (!isValidId(sceneId)) {
    return {
      status: 400,
      body: {
        success: false,
        message: "Scene id is required.",
      },
    };
  }

  if (!(await projectExists(projectId, db))) {
    return {
      status: 404,
      body: {
        success: false,
        message: "Project not found.",
      },
    };
  }

  if (!(await sceneBelongsToProject(projectId, sceneId, db))) {
    return {
      status: 404,
      body: {
        success: false,
        message: "Scene not found.",
      },
    };
  }

  return null;
};

// GET /api/projects/:projectId/scenes/:sceneId/scene-characters
export const getSceneCharacters = async (req, res) => {
  try {
    const { projectId, sceneId } = req.params;

    const validationError = await validateProjectAndScene(projectId, sceneId);

    if (validationError) {
      return res.status(validationError.status).json(validationError.body);
    }

    console.log("About to getSceneCharacters");

    const result = await pool.query(
      `SELECT
         sc.scene_id,
         sc.character_id,
         sc.role_in_scene,
         sc.knowledge_gained,
         c.name,
         c.story_role,
         c.description,
         c.goal,
         c.knowledge_notes
       FROM scene_characters sc
       JOIN characters c
         ON sc.character_id = c.id
       WHERE sc.scene_id = $1
         AND c.project_id = $2
       ORDER BY c.id ASC`,
      [sceneId, projectId],
    );

    return res.status(200).json({
      success: true,
      message: "Scene characters retrieved successfully.",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error getting scene characters:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get scene characters.",
    });
  }
};

// GET /api/projects/:projectId/scenes/:sceneId/scene-characters/:characterId
export const getSceneCharacterById = async (req, res) => {
  try {
    const { projectId, sceneId, characterId } = req.params;

    const validationError = await validateProjectAndScene(projectId, sceneId);

    if (validationError) {
      return res.status(validationError.status).json(validationError.body);
    }

    if (!isValidId(characterId)) {
      return res.status(400).json({
        success: false,
        message: "Character id is required.",
      });
    }

    if (!(await characterBelongsToProject(projectId, characterId))) {
      return res.status(404).json({
        success: false,
        message: "Character not found.",
      });
    }

    const result = await pool.query(
      `SELECT
         sc.scene_id,
         sc.character_id,
         sc.role_in_scene,
         sc.knowledge_gained,
         c.name,
         c.story_role,
         c.description,
         c.goal,
         c.knowledge_notes
       FROM scene_characters sc
       JOIN characters c
         ON sc.character_id = c.id
       WHERE sc.scene_id = $1
         AND sc.character_id = $2
         AND c.project_id = $3`,
      [sceneId, characterId, projectId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Scene character assignment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Scene character assignment retrieved successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error getting scene character:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get scene character assignment.",
    });
  }
};

// POST /api/projects/:projectId/scenes/:sceneId/scene-characters
export const assignCharacterToScene = async (req, res) => {
  try {
    const { projectId, sceneId } = req.params;
    const { character_id, role_in_scene, knowledge_gained } = req.body;

    const validationError = await validateProjectAndScene(projectId, sceneId);

    if (validationError) {
      return res.status(validationError.status).json(validationError.body);
    }

    if (!isValidId(character_id)) {
      return res.status(400).json({
        success: false,
        message: "Character id is required.",
      });
    }

    if (!isValidOptionalText(role_in_scene)) {
      return res.status(400).json({
        success: false,
        message: "Role in scene must be text.",
      });
    }

    if (!isValidOptionalText(knowledge_gained)) {
      return res.status(400).json({
        success: false,
        message: "Knowledge gained must be text.",
      });
    }

    if (!(await characterBelongsToProject(projectId, character_id))) {
      return res.status(404).json({
        success: false,
        message: "Character not found.",
      });
    }

    if (await assignmentExists(sceneId, character_id)) {
      return res.status(409).json({
        success: false,
        message: "Character is already assigned to this scene.",
      });
    }

    const result = await pool.query(
      `INSERT INTO scene_characters
         (scene_id, character_id, role_in_scene, knowledge_gained)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        sceneId,
        character_id,
        normalizeOptionalText(role_in_scene) ?? null,
        normalizeOptionalText(knowledge_gained) ?? null,
      ],
    );

    return res.status(201).json({
      success: true,
      message: "Character assigned to scene successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Character is already assigned to this scene.",
      });
    }

    console.error("Error assigning character to scene:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to assign character to scene.",
    });
  }
};

// PATCH /api/projects/:projectId/scenes/:sceneId/scene-characters/:characterId
export const updateSceneCharacter = async (req, res) => {
  try {
    const { projectId, sceneId, characterId } = req.params;
    const { role_in_scene, knowledge_gained } = req.body;

    const validationError = await validateProjectAndScene(projectId, sceneId);

    if (validationError) {
      return res.status(validationError.status).json(validationError.body);
    }

    if (!isValidId(characterId)) {
      return res.status(400).json({
        success: false,
        message: "Character id is required.",
      });
    }

    if (!isValidOptionalText(role_in_scene)) {
      return res.status(400).json({
        success: false,
        message: "Role in scene must be text.",
      });
    }

    if (!isValidOptionalText(knowledge_gained)) {
      return res.status(400).json({
        success: false,
        message: "Knowledge gained must be text.",
      });
    }

    if (role_in_scene === undefined && knowledge_gained === undefined) {
      return res.status(400).json({
        success: false,
        message: "No valid scene character fields provided.",
      });
    }

    if (!(await characterBelongsToProject(projectId, characterId))) {
      return res.status(404).json({
        success: false,
        message: "Character not found.",
      });
    }

    const updates = [];
    const values = [];

    if (role_in_scene !== undefined) {
      values.push(normalizeOptionalText(role_in_scene));
      updates.push(`role_in_scene = $${values.length}`);
    }

    if (knowledge_gained !== undefined) {
      values.push(normalizeOptionalText(knowledge_gained));
      updates.push(`knowledge_gained = $${values.length}`);
    }

    values.push(sceneId);
    const sceneIdIndex = values.length;

    values.push(characterId);
    const characterIdIndex = values.length;

    const result = await pool.query(
      `UPDATE scene_characters
       SET ${updates.join(", ")}
       WHERE scene_id = $${sceneIdIndex}
         AND character_id = $${characterIdIndex}
       RETURNING *`,
      values,
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Scene character assignment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Scene character assignment updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating scene character:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update scene character assignment.",
    });
  }
};

// DELETE /api/projects/:projectId/scenes/:sceneId/scene-characters/:characterId
export const deleteSceneCharacter = async (req, res) => {
  try {
    const { projectId, sceneId, characterId } = req.params;

    const validationError = await validateProjectAndScene(projectId, sceneId);

    if (validationError) {
      return res.status(validationError.status).json(validationError.body);
    }

    if (!isValidId(characterId)) {
      return res.status(400).json({
        success: false,
        message: "Character id is required.",
      });
    }

    if (!(await characterBelongsToProject(projectId, characterId))) {
      return res.status(404).json({
        success: false,
        message: "Character not found.",
      });
    }

    const result = await pool.query(
      `DELETE FROM scene_characters
       WHERE scene_id = $1
         AND character_id = $2
       RETURNING *`,
      [sceneId, characterId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Scene character assignment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Character removed from scene successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error removing character from scene:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to remove character from scene.",
    });
  }
};
