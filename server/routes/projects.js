import express from "express";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectsController.js";

const router = express.Router();

router.route("/").get(getProjects).post(createProject);

router
  .route("/:projectId")
  .get(getProjectById)
  .patch(updateProject)
  .delete(deleteProject);

export default router;
