import { pool } from "../config/database.js";

const isValidId = (id) => Number.isInteger(Number(id)) && Number(id) > 0;
const validOrderColumns = ["scene_order", "timeline_order"];
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

const sceneSelect = `
  SELECT
    s.*,
    CASE
      WHEN l.id IS NULL THEN NULL
      ELSE json_build_object(
        'id', l.id,
        'project_id', l.project_id,
        'name', l.name,
        'description', l.description,
        'atmosphere', l.atmosphere,
        'created_at', l.created_at,
        'updated_at', l.updated_at
      )
    END AS location
  FROM scenes s
  LEFT JOIN locations l
    ON s.location_id = l.id
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
      : "scene_order";

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

// POST /api/projects/:projectId/scenes
// Create a new scene
export const createScene = async (req, res) => {
  try {
    const { projectId } = req.params;
    const {
      title,
      summary,
      location_id,
      scene_order,
      timeline_order,
      status,
      mood,
      notes,
    } = req.body;

    if (!isValidId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Project id is required.",
      });
    }

    if (typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Scene title is required.",
      });
    }

    if (!(await getProjectExists(projectId))) {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    let normalizedLocationId = null;

    if (location_id !== undefined && location_id !== null && location_id !== "") {
      if (!isValidId(location_id)) {
        return res.status(400).json({
          success: false,
          message: "Location id must be a positive integer.",
        });
      }

      const locationExists = await getLocationExists(projectId, location_id);

      if (!locationExists) {
        return res.status(404).json({
          success: false,
          message: "Location not found.",
        });
      }

      normalizedLocationId = Number(location_id);
    }

    const sceneOrder = parseOptionalOrderValue(scene_order);

    if (!sceneOrder.valid) {
      return res.status(400).json({
        success: false,
        message: "Scene order must be a positive integer.",
      });
    }

    const timelineOrder = parseOptionalOrderValue(timeline_order);

    if (!timelineOrder.valid) {
      return res.status(400).json({
        success: false,
        message: "Timeline order must be a positive integer.",
      });
    }

    const normalizedStatus = normalizeStatus(status);

    if (
      normalizedStatus !== undefined &&
      normalizedStatus !== null &&
      !validSceneStatuses.includes(normalizedStatus)
    ) {
      return res.status(400).json({
        success: false,
        message: "Status must be Draft, In Progress, or Completed.",
      });
    }

    const normalizedSummary = normalizeOptionalText(toOptionalString(summary));
    const normalizedMood = normalizeOptionalText(toOptionalString(mood));
    const normalizedNotes = normalizeOptionalText(toOptionalString(notes));

    if (
      (summary !== undefined && summary !== null && normalizedSummary === null && typeof summary !== "string") ||
      (mood !== undefined && mood !== null && normalizedMood === null && typeof mood !== "string") ||
      (notes !== undefined && notes !== null && normalizedNotes === null && typeof notes !== "string")
    ) {
      return res.status(400).json({
        success: false,
        message: "Summary, mood, and notes must be strings when provided.",
      });
    }

    const result = await pool.query(
      `INSERT INTO scenes
        (
          project_id,
          location_id,
          title,
          summary,
          scene_order,
          timeline_order,
          status,
          mood,
          notes
        )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        projectId,
        normalizedLocationId,
        title.trim(),
        normalizedSummary,
        sceneOrder.parsed,
        timelineOrder.parsed,
        normalizedStatus,
        normalizedMood,
        normalizedNotes,
      ],
    );

    return res.status(201).json({
      success: true,
      message: "Scene created successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating scene:", error);

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

    const {
      title,
      summary,
      location_id,
      scene_order,
      timeline_order,
      status,
      mood,
      notes,
    } = req.body;

    if (
      title !== undefined &&
      (typeof title !== "string" || title.trim() === "")
    ) {
      return res.status(400).json({
        success: false,
        message: "Scene title cannot be empty.",
      });
    }

    if (summary !== undefined && summary !== null && typeof summary !== "string") {
      return res.status(400).json({
        success: false,
        message: "Summary must be a string.",
      });
    }

    if (mood !== undefined && mood !== null && typeof mood !== "string") {
      return res.status(400).json({
        success: false,
        message: "Mood must be a string.",
      });
    }

    if (notes !== undefined && notes !== null && typeof notes !== "string") {
      return res.status(400).json({
        success: false,
        message: "Notes must be a string.",
      });
    }

    if (location_id !== undefined && location_id !== null && location_id !== "") {
      if (!isValidId(location_id)) {
        return res.status(400).json({
          success: false,
          message: "Location id must be a positive integer.",
        });
      }

      const locationExists = await getLocationExists(projectId, location_id);

      if (!locationExists) {
        return res.status(404).json({
          success: false,
          message: "Location not found.",
        });
      }
    }

    const sceneOrder = parseOptionalOrderValue(scene_order);

    if (scene_order !== undefined && !sceneOrder.valid) {
      return res.status(400).json({
        success: false,
        message: "Scene order must be a positive integer.",
      });
    }

    const timelineOrder = parseOptionalOrderValue(timeline_order);

    if (timeline_order !== undefined && !timelineOrder.valid) {
      return res.status(400).json({
        success: false,
        message: "Timeline order must be a positive integer.",
      });
    }

    const normalizedStatus = normalizeStatus(status);

    if (
      status !== undefined &&
      status !== null &&
      normalizedStatus !== null &&
      !validSceneStatuses.includes(normalizedStatus)
    ) {
      return res.status(400).json({
        success: false,
        message: "Status must be Draft, In Progress, or Completed.",
      });
    }

    if (status !== undefined && status !== null && normalizedStatus === null) {
      return res.status(400).json({
        success: false,
        message: "Status must be a string.",
      });
    }

    const allowedFields = {
      title: title !== undefined ? title.trim() : undefined,
      summary:
        summary !== undefined
          ? normalizeOptionalText(summary)
          : undefined,
      location_id:
        location_id !== undefined
          ? location_id === null || location_id === ""
            ? null
            : Number(location_id)
          : undefined,
      scene_order:
        scene_order !== undefined ? sceneOrder.parsed : undefined,
      timeline_order:
        timeline_order !== undefined ? timelineOrder.parsed : undefined,
      status:
        status !== undefined
          ? normalizedStatus === ""
            ? null
            : normalizedStatus
          : undefined,
      mood: mood !== undefined ? normalizeOptionalText(mood) : undefined,
      notes: notes !== undefined ? normalizeOptionalText(notes) : undefined,
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
        message: "No valid scene fields provided.",
      });
    }

    updates.push("updated_at = CURRENT_TIMESTAMP");

    values.push(sceneId);
    const sceneIdIndex = values.length;

    values.push(projectId);
    const projectIdIndex = values.length;

    const result = await pool.query(
      `UPDATE scenes
       SET ${updates.join(", ")}
       WHERE id = $${sceneIdIndex}
         AND project_id = $${projectIdIndex}
       RETURNING *`,
      values,
    );

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
    console.error("Error updating scene:", error);

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
      `DELETE FROM scenes
       WHERE id = $1
         AND project_id = $2
       RETURNING *`,
      [sceneId, projectId],
    );

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
