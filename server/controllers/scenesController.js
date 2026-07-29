import { pool } from "../config/database.js";

const isValidId = (id) => Number.isInteger(Number(id)) && Number(id) > 0;
const validOrderColumns = ["created_at", "sceneOrder", "timelineOrder"];

const validateSceneFields = (
  { name, description, sceneOrder, timelineOrder, notes, location, characters, status },
  { requireName = true } = {},
) => {
  let errorString = "";
  if (requireName && !name.trim()) {
    errorString += "Scene name is required. ";
  }

  if (name !== undefined && typeof name !== "string") {
    errorString += "Scene name must be text. ";
  }

  if (typeof name === "string" && !name.trim()) {
    errorString += "Scene name cannot be empty. ";
  }

  if (typeof name === "string" && name.trim().length > 255) {
    errorString += "Scene name must be 255 characters or fewer. ";
  }

  if (description !== undefined && typeof description !== "string") {
    errorString += "Scene description must be text. ";
  }

  if (sceneOrder !== undefined && typeof sceneOrder !== "number") {
    errorString += "Scene order must be a number. ";
  }

  if (typeof sceneOrder == "number" && sceneOrder < 0) {
    errorString += "Scene order must be a positive number. ";
  }

  if (timelineOrder !== undefined && typeof timelineOrder !== "number") {
    errorString += "Timeline order must be a number. ";
  }

  if (typeof timelineOrder == "number" && timelineOrder < 0) {
    errorString += "Timeline order must be a positive number. ";
  }

  if (notes !== undefined && typeof notes !== "string") {
    errorString += "Scene notes must be text. ";
  }

  if (!Array.isArray(characters)) {
    errorString += "Scene characters must be an array. ";
  }

  if (typeof status !== "string" || !status.trim()) {
    errorString += "Scene status is required. ";
  }

  return errorString;
};
const validSceneStatuses = ["draft", "in progress", "completed"];

const toOptionalString = (value) => {
  if (value === undefined || value === null) {
    return value;
  }

  if (typeof value !== "string") {
    return null;
  }

  return value.trim();
};

const normalizeOptionalText = (value) => {
  if (value === undefined || value === null) {
    return value;
  }

  const trimmedValue = value.trim();

  return trimmedValue === "" ? null : trimmedValue;
};

const parseOptionalOrderValue = (value) => {
  if (value === undefined || value === null || value === "") {
    return { valid: true, parsed: null };
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1) {
    return { valid: false, parsed: null };
  }

  return { valid: true, parsed: parsedValue };
};

const normalizeStatus = (status) => {
  if (status === undefined || status === null) {
    return status;
  }

  if (typeof status !== "string") {
    return null;
  }

  return status.trim().toLowerCase();
};

const getProjectExists = async (projectId) => {
  const result = await pool.query(
    `SELECT id
     FROM story_projects
     WHERE id = $1`,
    [projectId],
  );

  return result.rows.length > 0;
};

const getLocationExists = async (projectId, locationId) => {
  const result = await pool.query(
    `SELECT id
     FROM locations
     WHERE id = $1
       AND project_id = $2`,
    [locationId, projectId],
  );

  return result.rows.length > 0;
};

// const sceneSelect = `
//   SELECT
//     s.*,
//     CASE
//       WHEN l.id IS NULL THEN NULL
//       ELSE json_build_object(
//         'id', l.id,
//         'project_id', l.project_id,
//         'name', l.name,
//         'description', l.description,
//         'sceneOrder', l.sceneOrder,
//         'timelineOrder', l.timelineOrder,
//         'notes', l.notes,
//         'scene', l.scene,
//         'characters', l.characters,
//         'status', l.status,
//         'created_at', l.created_at,
//         'updated_at', l.updated_at
//       )
//     END AS scene
//   FROM scenes s
//   LEFT JOIN locations l
//     ON s.location = l.name
// `;

const sceneSelect = `
  SELECT *
  FROM scenes s
`;

// GET /api/projects/:projectId/scenes
// Retrieves all scenes for a project
export const getScenes = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { orderBy } = req.query;

    // Validate required fields
    if (!isValidId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Project id is required.",
      });
    }

    if (!(await getProjectExists(projectId))) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const orderColumn = validOrderColumns.includes(orderBy)
      ? orderBy
      : "created_at";

    const result = await pool.query(
      `${sceneSelect}
       WHERE s.project_id = $1
       ORDER BY s.${orderColumn} ASC NULLS LAST, s.id ASC`,
      [projectId],
    );

    return res.status(200).json({
      success: true,
      message: "Scenes retrieved successfully.",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error getting scenes:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get scenes.",
    });
  }
};

// GET /api/projects/:projectId/scenes/:sceneId
// Retrieve a scene by id
export const getSceneById = async (req, res) => {
  try {
    const { projectId, sceneId } = req.params;

    // Validate required fields
    if (!isValidId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Project id is required.",
      });
    }

    if (!isValidId(sceneId)) {
      return res.status(400).json({
        success: false,
        message: "Scene id is required.",
      });
    }

    if (!(await getProjectExists(projectId))) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    const result = await pool.query(
      `${sceneSelect}
       WHERE s.id = $1
         AND s.project_id = $2`,
      [sceneId, projectId],
    );

    // Scene does not exist
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Scene not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Scene retrieved successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error getting scene:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get scene.",
    });
  }
};

// POST /api/projects/:projectId/scenes/new
// Create a new scene
export const createScene = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { 
      name,
      description = "",
      scene_order = 0,
      timeline_order = 0,
      notes = "",
      location = "",
      characters = [],
      status = "Planning",
    } = req.body;

    // Validate required fields
    if (!isValidId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Project id is required.",
      });
    }

    const validationMessage = validateSceneFields(
      { name, description, scene_order, timeline_order, notes, location, characters, status },
      { requireName: true },
    );

    if (validationMessage != "") {
      return res.status(400).json({
        success: false,
        message: validationMessage,
      });
    }

    const cleanedCharacters = characters
      .filter((value) => typeof value === "string")
      .map((value) => value.trim())
      .filter(Boolean);

    const result = await pool.query(
      `INSERT INTO scenes
        (project_id, name, description, scene_order, timeline_order, notes, location, characters, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8::TEXT[], $9)
       RETURNING *`,
      [
        projectId,
        name.trim(),
        description.trim() || null,
        scene_order || 0,
        timeline_order || 0,
        notes || null,
        location,
        cleanedCharacters,
        status,
      ],
    );

    return res.status(201).json({
      success: true,
      message: "Scene created successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating scene:", error);

    if (error.code === "23503") {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create scene.",
    });
  }
};

// PATCH /api/projects/:projectId/scenes/:sceneId
// Update an existing scene
export const updateScene = async (req, res) => {
  try {
    const { projectId, sceneId } = req.params;
    const { name, description, scene_order, timeline_order, notes, location, characters, status } = req.body;

    // Validate required fields
    if (!isValidId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Project id is required.",
      });
    }

    if (!isValidId(sceneId)) {
      return res.status(400).json({
        success: false,
        message: "Scene id is required.",
      });
    }

    const validationMessage = validateSceneFields({name, description, scene_order, timeline_order, notes, location, characters, status});

    if (validationMessage) {
      return res.status(400).json({
        success: false,
        message: validationMessage,
      });
    }

    const cleanedCharacters = characters
      .filter((value) => typeof value === "string")
      .map((value) => value.trim())
      .filter(Boolean);

    const result = await pool.query(
      `UPDATE scenes
        SET
          name = $1,
          description = $2,
          scene_order = $3,
          timeline_order = $4,
          notes = $5, 
          location = $6, 
          characters = $7::TEXT[],
          status = $8,
          updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
         AND project_id = $10
       RETURNING *`,
      [
        name.trim(),
        description.trim() || null,
        scene_order || 0,
        timeline_order || 0,
        notes || null,
        location,
        cleanedCharacters,
        status,
        sceneId,
        projectId,
      ],
    );

    // Scene does not exist
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Scene not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Scene updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating scene:", error)

    return res.status(500).json({
      success: false,
      message: "Failed to update scene.",
    });
  }
};

// DELETE /api/projects/:projectId/scenes/:sceneId
// Delete an existing scene
export const deleteScene = async (req, res) => {
  try {
    const { projectId, sceneId } = req.params;

    // Validate required fields
    if (!isValidId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Project id is required.",
      });
    }

    if (!isValidId(sceneId)) {
      return res.status(400).json({
        success: false,
        message: "Scene id is required.",
      });
    }

    const result = await pool.query(
      `DELETE FROM scenes
       WHERE id = $1
         AND project_id = $2
       RETURNING *`,
      [sceneId, projectId],
    );

    // Scene does not exist
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Scene not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Scene deleted successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting scene:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete scene.",
    });
  }
};