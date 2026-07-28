import express from "express";
import {
  assignCharacterToScene,
  deleteSceneCharacter,
  getSceneCharacterById,
  getSceneCharacters,
  updateSceneCharacter,
} from "../controllers/scene-character.js";

const router = express.Router({ mergeParams: true });

router.route("/").get(getSceneCharacters).post(assignCharacterToScene);

router
  .route("/:characterId")
  .get(getSceneCharacterById)
  .patch(updateSceneCharacter)
  .delete(deleteSceneCharacter);

export default router;
