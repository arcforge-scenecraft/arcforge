import { pool } from "../config/database.js";

const isValidId = (id) => Number.isInteger(Number(id)) && Number(id) > 0;

// GET /api/projects/:projectId/locations
// Retrieves all locations for a project
export const getLocations = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Validate required fields
    if (!isValidId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Project id is required.",
      });
    }

    const result = await pool.query(
      `SELECT *
       FROM locations
       WHERE project_id = $1
       ORDER BY id ASC`,
      [projectId],
    );

    return res.status(200).json({
      success: true,
      message: "Locations retrieved successfully.",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error getting locations:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get locations.",
    });
  }
};

// GET /api/projects/:projectId/locations/:locationId
// Retrieve a location by id
export const getLocationById = async (req, res) => {
  try {
    const { projectId, locationId } = req.params;

    // Validate required fields
    if (!isValidId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Project id is required.",
      });
    }

    if (!isValidId(locationId)) {
      return res.status(400).json({
        success: false,
        message: "Location id is required.",
      });
    }

    const result = await pool.query(
      `SELECT *
       FROM locations
       WHERE id = $1
         AND project_id = $2`,
      [locationId, projectId],
    );

    // Location does not exist
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Location not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Location retrieved successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error getting location:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get location.",
    });
  }
};

// POST /api/projects/:projectId/locations
// Create a new location
export const createLocation = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, description, atmosphere } = req.body;

    // Validate required fields
    if (!isValidId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Project id is required.",
      });
    }

    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Location name is required.",
      });
    }

    const result = await pool.query(
      `INSERT INTO locations
        (project_id, name, description, atmosphere)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [projectId, name.trim(), description || null, atmosphere || null],
    );

    return res.status(201).json({
      success: true,
      message: "Location created successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating location:", error);

    if (error.code === "23503") {
      return res.status(404).json({
        success: false,
        message: "Project not found.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create location.",
    });
  }
};

// PATCH /api/projects/:projectId/locations/:locationId
// Update an existing location
export const updateLocation = async (req, res) => {
  try {
    const { projectId, locationId } = req.params;
    const { name, description, atmosphere } = req.body;

    // Validate required fields
    if (!isValidId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Project id is required.",
      });
    }

    if (!isValidId(locationId)) {
      return res.status(400).json({
        success: false,
        message: "Location id is required.",
      });
    }

    // If name is provided, it cannot be empty
    if (name !== undefined && name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Location name cannot be empty.",
      });
    }

    const result = await pool.query(
      `UPDATE locations
       SET
         name = COALESCE($1, name),
         description = COALESCE($2, description),
         atmosphere = COALESCE($3, atmosphere),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
         AND project_id = $5
       RETURNING *`,
      [
        name !== undefined ? name.trim() : null,
        description !== undefined ? description : null,
        atmosphere !== undefined ? atmosphere : null,
        locationId,
        projectId,
      ],
    );

    // Location does not exist
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Location not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Location updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating location:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update location.",
    });
  }
};

// DELETE /api/projects/:projectId/locations/:locationId
// Delete an existing location
export const deleteLocation = async (req, res) => {
  try {
    const { projectId, locationId } = req.params;

    // Validate required fields
    if (!isValidId(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Project id is required.",
      });
    }

    if (!isValidId(locationId)) {
      return res.status(400).json({
        success: false,
        message: "Location id is required.",
      });
    }

    const result = await pool.query(
      `DELETE FROM locations
       WHERE id = $1
         AND project_id = $2
       RETURNING *`,
      [locationId, projectId],
    );

    // Location does not exist
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Location not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Location deleted successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting location:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete location.",
    });
  }
};
