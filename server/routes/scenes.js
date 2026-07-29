import express from "express";
import {
  getScenes,
  getSceneById,
  createScene,
  updateScene,
  deleteScene,
} from "../controllers/scenesController.js";

const router = express.Router({ mergeParams: true });

router.route("/").get(getScenes).post(createScene);

router
  .route("/:sceneId")
  .get(getSceneById)
  .patch(updateScene)
  .delete(deleteScene);

export default router;
