import express from "express";

import {
  createCharacter,
  deleteCharacter,
  getCharacterById,
  getCharacters,
  updateCharacter,
} from "../controllers/charactersController.js";

const router = express.Router({
  mergeParams: true,
});

router.get("/", getCharacters);
router.get("/:characterId", getCharacterById);
router.post("/", createCharacter);
router.patch("/:characterId", updateCharacter);
router.delete("/:characterId", deleteCharacter);

export default router;
