import express from "express";
import { pool } from "../config/database.js";

const router = express.Router({ mergeParams: true });

const isValidId = (id) => Number.isInteger(Number(id)) && Number(id) > 0;
const validOrderColumns = ["scene_order", "timeline_order"];

const getProjectExists = async (projectId) => {
  const result = await pool.query(
    `SELECT id
     FROM story_projects
     WHERE id = $1`,
    [projectId],
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
router.get("/", async (req, res) => {
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
});

// GET /api/projects/:projectId/scenes/:sceneId
// Retrieve a scene by id
router.get("/:sceneId", async (req, res) => {
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
});

export default router;
