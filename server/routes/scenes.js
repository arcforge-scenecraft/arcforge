import express from "express";
import {
  getScenes,
  getSceneById,
} from "../controllers/scenesController.js";

const router = express.Router({ mergeParams: true });

router.route("/").get(getScenes);
router.route("/:sceneId").get(getSceneById);

export default router;
